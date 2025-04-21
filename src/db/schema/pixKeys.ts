import { relations, sql } from "drizzle-orm";
import {
	bigint,
	datetime,
	mysqlEnum,
	mysqlTable,
	varchar,
} from "drizzle-orm/mysql-core";
import { instructorsTable } from "./instructors.ts";

export const pixKeysTable = mysqlTable("instructors", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	instructorId: bigint("instructor_id", { mode: "number", unsigned: true })
		.notNull()
		.references(() => instructorsTable.id),
	type: mysqlEnum("type", ["email", "cpf", "phone", "randomKey"]).notNull(),
	description: varchar("description", { length: 100 }),
	createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: datetime("updated_at").$onUpdate(() => new Date()),
});

export const instructorsRelations = relations(instructorsTable, ({ one }) => ({
	user: one(instructorsTable, {
		fields: [instructorsTable.practitionerId],
		references: [instructorsTable.id],
	}),
}));
