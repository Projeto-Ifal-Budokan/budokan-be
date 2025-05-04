import { relations } from "drizzle-orm";
import { bigint, mysqlTable, timestamp } from "drizzle-orm/mysql-core";
import { practitionersTable } from "./practitioners.ts";
import { pixKeysTable } from "./pix-keys.ts";

export const instructorsTable = mysqlTable("tb_instructors", {
	// id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
	idPractitioner: bigint("id_practitioner", { mode: "number", unsigned: true })
		.notNull()
		.references(() => practitionersTable.idUser).autoincrement().primaryKey(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const instructorsRelations = relations(
	instructorsTable,
	({ one, many }) => ({
		user: one(practitionersTable, {
			fields: [instructorsTable.idPractitioner],
			references: [practitionersTable.idUser],
		}),
		pixKeys: many(pixKeysTable),
	}),
);
