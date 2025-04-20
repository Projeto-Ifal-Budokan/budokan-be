import { sql, relations } from "drizzle-orm";
import {
    bigint,
    datetime,
    mysqlTable,
    serial,
    varchar,
} from "drizzle-orm/mysql-core";
import { practitionersTable } from "./practitioners.ts";

export const practitionerContactsTable = mysqlTable("user_contacts", {
    id: serial("id").primaryKey(),
    userId: bigint("id_practitioner", { mode: "number", unsigned: true }).references(
        () => practitionersTable.id,
    ),
    phone: varchar("phone", {length: 20}),
    relationship: varchar("relationship", { length: 100 }).notNull(),
    status: varchar("status", { length: 20 }).default("inactive"), // 'active' or 'inactive'
    createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").$onUpdate(() => new Date()),
});

export const userContactsRelations = relations(practitionerContactsTable, ({ one }) => ({
        user: one(practitionersTable, {
            fields: [practitionerContactsTable.userId],
            references: [practitionersTable.id],
        }),
    })
);