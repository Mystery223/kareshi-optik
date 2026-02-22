import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { appointmentSlots, customers, optometrists, users } from "../src/lib/db/schema";

type SeedUserInput = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "staff" | "customer";
};

async function getDb() {
  const mod = await import("../src/lib/db");
  return mod.db;
}

async function upsertUser(db: Awaited<ReturnType<typeof getDb>>, input: SeedUserInput) {
  const hashedPassword = await bcrypt.hash(input.password, 10);
  const [existing] = await db.select().from(users).where(eq(users.email, input.email)).limit(1);

  if (existing) {
    const [updated] = await db
      .update(users)
      .set({
        name: input.name,
        role: input.role,
        password: hashedPassword,
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role,
      isActive: true,
    })
    .returning();
  return created;
}

async function upsertCustomerProfile(
  db: Awaited<ReturnType<typeof getDb>>,
  userId: string,
  fullName: string,
  email: string,
  phone: string
) {
  const [existing] = await db.select().from(customers).where(eq(customers.id, userId)).limit(1);
  const names = fullName.split(" ");
  const firstName = names[0] || fullName;
  const lastName = names.slice(1).join(" ") || null;

  if (existing) {
    await db
      .update(customers)
      .set({
        firstName,
        lastName,
        email,
        phone,
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, userId));
    return;
  }

  await db.insert(customers).values({
    id: userId,
    firstName,
    lastName,
    email,
    phone,
    isActive: true,
  });
}

async function upsertStaffOptometrist(db: Awaited<ReturnType<typeof getDb>>, userId: string, name: string) {
  const [existing] = await db.select().from(optometrists).where(eq(optometrists.userId, userId)).limit(1);
  if (existing) {
    await db
      .update(optometrists)
      .set({
        name: `${name}, Opt.`,
        title: "Optometrist",
        isActive: true,
      })
      .where(eq(optometrists.id, existing.id));
    return;
  }

  await db.insert(optometrists).values({
    userId,
    name: `${name}, Opt.`,
    title: "Optometrist",
    specialization: "General Eye Exam",
    workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    isActive: true,
  });
}

async function seedAppointmentSlots(db: Awaited<ReturnType<typeof getDb>>) {
  const existing = await db.select().from(appointmentSlots).limit(1);
  if (existing.length > 0) return;

  const values: typeof appointmentSlots.$inferInsert[] = [];
  for (let day = 1; day <= 6; day += 1) {
    for (let hour = 9; hour <= 17; hour += 1) {
      const start = `${String(hour).padStart(2, "0")}:00:00`;
      const end = `${String(hour + 1).padStart(2, "0")}:00:00`;
      values.push({
        dayOfWeek: day,
        startTime: start,
        endTime: end,
        maxPatients: 4,
        isAvailable: true,
      });
    }
  }

  await db.insert(appointmentSlots).values(values);
}

async function main() {
  dotenv.config({ path: ".env.local" });
  dotenv.config();
  const db = await getDb();

  const seedUsers: SeedUserInput[] = [
    {
      name: "Admin Kareshi",
      email: "admin@kareshi-optik.com",
      password: "Admin12345",
      role: "admin",
    },
    {
      name: "Staff Kareshi",
      email: "staff@kareshi-optik.com",
      password: "Staff12345",
      role: "staff",
    },
    {
      name: "Customer Demo",
      email: "customer@kareshi-optik.com",
      password: "Customer12345",
      role: "customer",
    },
  ];

  const createdUsers = [];
  for (const user of seedUsers) {
    const saved = await upsertUser(db, user);
    createdUsers.push(saved);
  }

  const staff = createdUsers.find((item) => item.email === "staff@kareshi-optik.com");
  if (staff) {
    await upsertStaffOptometrist(db, staff.id, "Staff Kareshi");
  }

  const customer = createdUsers.find((item) => item.email === "customer@kareshi-optik.com");
  if (customer) {
    await upsertCustomerProfile(db, customer.id, customer.name, customer.email, "081234567890");
  }

  await seedAppointmentSlots(db);

  console.log("Test users ready:");
  console.log("- admin@kareshi-optik.com / Admin12345");
  console.log("- staff@kareshi-optik.com / Staff12345");
  console.log("- customer@kareshi-optik.com / Customer12345");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed to seed test data:", err);
    process.exit(1);
  });
