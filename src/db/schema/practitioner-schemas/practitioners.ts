import { relations } from "drizzle-orm";
import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { usersTable } from "../user-schemas/users.ts";
import { practitionerContactsTable } from "./practitioner-contacts.ts";

export const practitionersTable = mysqlTable("tb_practitioners", {
	idUser: bigint("id_user", { mode: "number", unsigned: true })
		.notNull()
		.references(() => usersTable.id)
		.autoincrement()
		.primaryKey(),
	healthObservations: varchar("health_observations", { length: 255 }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const practitionersRelations = relations(
	practitionersTable,
	({ one, many }) => ({
		user: one(usersTable, {
			fields: [practitionersTable.idUser],
			references: [usersTable.id],
		}),
		practitionerContacts: many(practitionerContactsTable),
	}),
);
