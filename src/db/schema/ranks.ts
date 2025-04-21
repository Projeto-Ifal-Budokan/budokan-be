import { relations } from "drizzle-orm";
import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { disciplinesTable } from "./disciplines.ts";

export const ranksTable = mysqlTable("tb_ranks", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	idDiscipline: bigint("id_discipline", {
		mode: "number",
		unsigned: true,
	}).references(() => disciplinesTable.id),
	name: varchar("name", { length: 100 }).notNull(),
	description: varchar("description", { length: 100 }).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const rankRelations = relations(ranksTable, ({ one }) => ({
	user: one(disciplinesTable, {
		fields: [ranksTable.idDiscipline],
		references: [disciplinesTable.id],
	}),
}));
