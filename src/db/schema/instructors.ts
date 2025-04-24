import { relations } from "drizzle-orm";
import { bigint, mysqlTable, timestamp } from "drizzle-orm/mysql-core";
import { pixKeysTable } from "./pixKeys.ts";
import { practitionersTable } from "./practitioners.ts";

export const instructorsTable = mysqlTable("tb_instructors", {
	// id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	idPractitioner: bigint("id_practitioner", { mode: "number", unsigned: true })
		.notNull()
		.references(() => practitionersTable.id).primaryKey(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const instructorsRelations = relations(
	instructorsTable,
	({ one, many }) => ({
		user: one(practitionersTable, {
			fields: [instructorsTable.idPractitioner],
			references: [practitionersTable.id],
		}),
		pixKeys: many(pixKeysTable),
	}),
);
