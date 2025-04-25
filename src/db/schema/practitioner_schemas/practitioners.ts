import { relations } from "drizzle-orm";
import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { practitionerContactsTable } from "./practitionerContacts.ts";
import { usersTable } from "../user_schemas/users.ts";

export const practitionersTable = mysqlTable("tb_practitioners", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	idUser: bigint("id_user", { mode: "number", unsigned: true })
		.notNull()
		.references(() => usersTable.id),
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
