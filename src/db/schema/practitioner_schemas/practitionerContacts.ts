import { relations } from "drizzle-orm";
import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { practitionersTable } from "./practitioners.ts";
import { foreignKey } from "drizzle-orm/mysql-core";

export const practitionerContactsTable = mysqlTable(
	"tb_practitioner_contacts",
	{
		id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
		idPractitioner: bigint("id_practitioner", {
			mode: "number",
			unsigned: true,
		}).notNull(),
		phone: varchar("phone", { length: 20 }),
		relationship: varchar("relationship", { length: 100 }).notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
	}, (table) => [
		foreignKey({
			columns: [table.idPractitioner],
			foreignColumns: [practitionersTable.idUser],
			name: "fk_tb_practitioner_contacts_id_practitioner"
		})
	]);

export const practitionerContactsRelations = relations(
	practitionerContactsTable,
	({ one }) => ({
		user: one(practitionersTable, {
			fields: [practitionerContactsTable.idPractitioner],
			references: [practitionersTable.idUser],
		}),
	}),
);
