import { relations } from 'drizzle-orm';
import * as t from './tables';

export const brandsRelations = relations(t.brands, ({ many }) => ({
    products: many(t.products),
    lenses: many(t.lenses),
}));

export const categoriesRelations = relations(t.categories, ({ one, many }) => ({
    parent: one(t.categories, {
        fields: [t.categories.parentId],
        references: [t.categories.id],
        relationName: 'subcategory',
    }),
    subcategories: many(t.categories, { relationName: 'subcategory' }),
    products: many(t.products),
}));

export const productsRelations = relations(t.products, ({ one, many }) => ({
    brand: one(t.brands, {
        fields: [t.products.brandId],
        references: [t.brands.id],
    }),
    category: one(t.categories, {
        fields: [t.products.categoryId],
        references: [t.categories.id],
    }),
    variants: many(t.productVariants),
    reviews: many(t.reviews),
}));

export const productVariantsRelations = relations(t.productVariants, ({ one }) => ({
    product: one(t.products, {
        fields: [t.productVariants.productId],
        references: [t.products.id],
    }),
}));

export const usersRelations = relations(t.users, ({ one, many }) => ({
    optometristProfile: one(t.optometrists, {
        fields: [t.users.id],
        references: [t.optometrists.userId],
    }),
    blogPosts: many(t.blogPosts),
    handledOrders: many(t.orders),
}));

export const optometristsRelations = relations(t.optometrists, ({ one, many }) => ({
    user: one(t.users, {
        fields: [t.optometrists.userId],
        references: [t.users.id],
    }),
    appointments: many(t.appointments),
    examHistories: many(t.eyeExamHistory),
}));

export const appointmentsRelations = relations(t.appointments, ({ one }) => ({
    optometrist: one(t.optometrists, {
        fields: [t.appointments.optometristId],
        references: [t.optometrists.id],
    }),
    customer: one(t.customers, {
        fields: [t.appointments.customerId],
        references: [t.customers.id],
    }),
    examHistory: one(t.eyeExamHistory, {
        fields: [t.appointments.id],
        references: [t.eyeExamHistory.appointmentId]
    }),
}));

export const customersRelations = relations(t.customers, ({ many }) => ({
    appointments: many(t.appointments),
    eyeExams: many(t.eyeExamHistory),
    orders: many(t.orders),
}));

export const eyeExamHistoryRelations = relations(t.eyeExamHistory, ({ one }) => ({
    customer: one(t.customers, {
        fields: [t.eyeExamHistory.customerId],
        references: [t.customers.id],
    }),
    appointment: one(t.appointments, {
        fields: [t.eyeExamHistory.appointmentId],
        references: [t.appointments.id],
    }),
    optometrist: one(t.optometrists, {
        fields: [t.eyeExamHistory.optometristId],
        references: [t.optometrists.id],
    }),
}));

export const ordersRelations = relations(t.orders, ({ one }) => ({
    customer: one(t.customers, {
        fields: [t.orders.customerId],
        references: [t.customers.id],
    }),
    product: one(t.products, {
        fields: [t.orders.productId],
        references: [t.products.id],
    }),
    variant: one(t.productVariants, {
        fields: [t.orders.productVariantId],
        references: [t.productVariants.id],
    }),
    lens: one(t.lenses, {
        fields: [t.orders.lensId],
        references: [t.lenses.id],
    }),
    appointment: one(t.appointments, {
        fields: [t.orders.appointmentId],
        references: [t.appointments.id],
    }),
    handledBy: one(t.users, {
        fields: [t.orders.handledBy],
        references: [t.users.id],
    }),
}));

export const reviewsRelations = relations(t.reviews, ({ one }) => ({
    product: one(t.products, {
        fields: [t.reviews.productId],
        references: [t.products.id],
    }),
}));

export const blogPostsRelations = relations(t.blogPosts, ({ one }) => ({
    author: one(t.users, {
        fields: [t.blogPosts.authorId],
        references: [t.users.id],
    }),
}));
