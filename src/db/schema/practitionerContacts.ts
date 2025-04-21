import { relations, sql } from "drizzle-orm";
import {
	bigint,
	datetime,
	mysqlEnum,
	mysqlTable,
	varchar,
} from "drizzle-orm/mysql-core";
import { practitionersTable } from "./practitioners.ts";

export const practitionerContactsTable = mysqlTable("user_contacts", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	idPractitioner: bigint("id_practitioner", {
		mode: "number",
		unsigned: true,
	}).references(() => practitionersTable.id),
	phone: varchar("phone", { length: 20 }),
	relationship: varchar("relationship", { length: 100 }).notNull(),
	createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: datetime("updated_at").$onUpdate(() => new Date()),
});

export const userContactsRelations = relations(
	practitionerContactsTable,
	({ one }) => ({
		user: one(practitionersTable, {
			fields: [practitionerContactsTable.idPractitioner],
			references: [practitionersTable.id],
		}),
	}),
);
