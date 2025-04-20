import { sql, relations } from "drizzle-orm";
import {
    bigint,
    datetime,
    mysqlTable,
    serial,
    varchar,
} from "drizzle-orm/mysql-core";
import { usersTable } from "./users-table";

export const userContactsTable = mysqlTable("user_contacts", {
    id: serial("id").primaryKey(),
    userId: bigint("id_user", { mode: "number", unsigned: true }).references(
        () => usersTable.id,
    ),
    phone: varchar("phone", {length: 20}),
    relationship: varchar("relationship", { length: 100 }).notNull(),
    status: varchar("status", { length: 20 }).default("inactive"), // 'active' or 'inactive'
    createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").$onUpdate(() => new Date()),
});

export const userContactsRelations = relations(userContactsTable, ({ one }) => ({
        user: one(usersTable, {
            fields: [userContactsTable.userId],
            references: [usersTable.id],
        }),
    })
);