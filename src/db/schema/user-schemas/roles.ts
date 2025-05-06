import { relations } from "drizzle-orm";
import { bigint, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { rolesPrivilegesTable } from "./roles-privileges.ts";
import { userRolesTable } from "./user-roles.ts";

export const rolesTable = mysqlTable("tb_roles", {
	id: bigint("id", { mode: "number", unsigned: true })
		.autoincrement()
		.primaryKey(),
	name: varchar("name", { length: 100 }).unique().notNull(),
	description: varchar("description", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const rolesRelations = relations(rolesTable, ({ many }) => ({
	userRoles: many(userRolesTable),
	rolePrivileges: many(rolesPrivilegesTable, { relationName: "roles" }),
}));
