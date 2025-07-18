import { relations } from "drizzle-orm";
import {
	bigint,
	mysqlEnum,
	mysqlTable,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";
import { instructorsTable } from "./instructors.ts";

export const pixKeysTable = mysqlTable("tb_pix_keys", {
	id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
	idInstructor: bigint("id_instructor", { mode: "number", unsigned: true })
		.notNull()
		.references(() => instructorsTable.idPractitioner),
	type: mysqlEnum("type", ["email", "cpf", "phone", "randomKey"]).notNull(),
	key: varchar("key", { length: 100 }).notNull().unique(),
	description: varchar("description", { length: 100 }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const pixKeysRelations = relations(pixKeysTable, ({ one }) => ({
	user: one(instructorsTable, {
		fields: [pixKeysTable.idInstructor],
		references: [instructorsTable.idPractitioner],
	}),
}));
