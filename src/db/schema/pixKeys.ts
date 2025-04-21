import { relations, sql } from "drizzle-orm";
import {
	bigint,
	mysqlEnum,
	mysqlTable,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";
import { instructorsTable } from "./instructors.ts";

export const pixKeysTable = mysqlTable("tb_pix_keys", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	instructorId: bigint("instructor_id", { mode: "number", unsigned: true })
		.notNull()
		.references(() => instructorsTable.id),
	type: mysqlEnum("type", ["email", "cpf", "phone", "randomKey"]).notNull(),
	description: varchar("description", { length: 100 }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const instructorsRelations = relations(instructorsTable, ({ one }) => ({
	user: one(instructorsTable, {
		fields: [instructorsTable.practitionerId],
		references: [instructorsTable.id],
	}),
}));
