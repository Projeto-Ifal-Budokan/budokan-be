import { relations } from "drizzle-orm";
import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { rolePrivilegesTable } from "./role-privileges.ts";

export const privilegesTable = mysqlTable("tb_privileges", {
	id: bigint("id", { mode: "number", unsigned: true })
		.autoincrement()
		.primaryKey(),
	name: varchar("name", { length: 100 }).unique().notNull(),
	description: varchar("description", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const privilegesRelations = relations(privilegesTable, ({ many }) => ({
	rolePrivileges: many(rolePrivilegesTable, {
		relationName: "privileges",
	}),
}));
