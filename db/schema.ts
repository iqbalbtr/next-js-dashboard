import { relations } from "drizzle-orm";
import { integer, pgTable, varchar, timestamp, boolean } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }),
});

export const authTable = pgTable("auth", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().notNull().references(() => userTable.id),
    token: varchar({ length: 255 }),
    lastLogged: timestamp(),
    isVerify: boolean().default(false),
});

export const userRelation = relations(userTable, ({ one }) => ({
    auth: one(authTable),
}));

