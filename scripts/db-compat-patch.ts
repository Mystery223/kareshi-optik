import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config({ path: ".env.local" });

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is missing. Set it in env before running db:compat.");
  }
  return url;
}

const sql = postgres(getDatabaseUrl(), { max: 1 });

const statements: Array<{ label: string; query: string }> = [
  {
    label: "Patch products legacy columns",
    query: `
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'products'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'frame_material'
    ) AND NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'material'
    ) THEN
      ALTER TABLE public.products RENAME COLUMN frame_material TO material;
    END IF;

    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'frame_shape'
    ) AND NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'shape'
    ) THEN
      ALTER TABLE public.products RENAME COLUMN frame_shape TO shape;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'dimension'
    ) THEN
      ALTER TABLE public.products ADD COLUMN dimension varchar(50);
    END IF;

    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'lens_width'
    ) AND EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'bridge_width'
    ) AND EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'temple_length'
    ) THEN
      UPDATE public.products
      SET dimension = COALESCE(
        dimension,
        CONCAT_WS('-', lens_width::text, bridge_width::text, temple_length::text)
      )
      WHERE dimension IS NULL;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'item_sold'
    ) THEN
      ALTER TABLE public.products ADD COLUMN item_sold integer DEFAULT 0 NOT NULL;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'rating'
    ) THEN
      ALTER TABLE public.products ADD COLUMN rating numeric(3, 2) DEFAULT '0.00';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'review_count'
    ) THEN
      ALTER TABLE public.products ADD COLUMN review_count integer DEFAULT 0 NOT NULL;
    END IF;
  END IF;
END $$;
`,
  },
  {
    label: "Convert legacy array columns to jsonb when needed",
    query: `
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'features' AND udt_name = '_text'
  ) THEN
    ALTER TABLE public.products ALTER COLUMN features TYPE jsonb USING to_jsonb(features);
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'tags' AND udt_name = '_text'
  ) THEN
    ALTER TABLE public.products ALTER COLUMN tags TYPE jsonb USING to_jsonb(tags);
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'images' AND udt_name = '_text'
  ) THEN
    ALTER TABLE public.products ALTER COLUMN images TYPE jsonb USING to_jsonb(images);
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'lenses' AND column_name = 'coating' AND udt_name = '_text'
  ) THEN
    ALTER TABLE public.lenses ALTER COLUMN coating TYPE jsonb USING to_jsonb(coating);
  END IF;
END $$;
`,
  },
  {
    label: "Patch users password compatibility",
    query: `
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'users'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'password_hash'
    ) AND NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'password'
    ) THEN
      ALTER TABLE public.users ADD COLUMN password varchar(255);
    END IF;

    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'password_hash'
    ) AND EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'password'
    ) THEN
      UPDATE public.users
      SET password = password_hash
      WHERE password IS NULL AND password_hash IS NOT NULL;
    END IF;
  END IF;
END $$;
`,
  },
  {
    label: "Patch reviews columns used by app",
    query: `
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'reviews'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'reviews' AND column_name = 'customer_name'
    ) THEN
      ALTER TABLE public.reviews ADD COLUMN customer_name varchar(100);
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'reviews' AND column_name = 'comment'
    ) THEN
      ALTER TABLE public.reviews ADD COLUMN comment text;
    END IF;

    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'reviews' AND column_name = 'title'
    ) THEN
      UPDATE public.reviews
      SET customer_name = COALESCE(customer_name, NULLIF(title, ''), 'Pelanggan')
      WHERE customer_name IS NULL;
    END IF;

    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'reviews' AND column_name = 'content'
    ) THEN
      UPDATE public.reviews
      SET comment = COALESCE(comment, content)
      WHERE comment IS NULL;
    END IF;

    UPDATE public.reviews
    SET customer_name = 'Pelanggan'
    WHERE customer_name IS NULL OR customer_name = '';
  END IF;
END $$;
`,
  },
];

async function run() {
  try {
    for (const statement of statements) {
      process.stdout.write(`- ${statement.label}... `);
      await sql.unsafe(statement.query);
      console.log("ok");
    }
    console.log("Compatibility patch finished.");
  } finally {
    await sql.end({ timeout: 5 });
  }
}

run().catch((error) => {
  console.error("Compatibility patch failed:", error);
  process.exit(1);
});
