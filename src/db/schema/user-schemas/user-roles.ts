import { relations } from "drizzle-orm";
import {
    bigint,
    mysqlTable,
    timestamp,
} from "drizzle-orm/mysql-core";
import { usersTable } from "./users.ts";
import { rolesTable } from "./roles.ts";

export const userRolesTable = mysqlTable("tb_user_roles", {
    id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
    idRole: bigint("id_role", {
        mode: "number",
        unsigned: true,
    })
        .notNull()
        .references(() => rolesTable.id),
    idUser: bigint("id_user", {
        mode: "number",
        unsigned: true,
    })
        .notNull()
        .references(() => usersTable.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const userRolesRelations = relations(
    userRolesTable,
    ({ one }) => ({
        role: one(rolesTable, {
            fields: [userRolesTable.idRole],
            references: [rolesTable.id],
        }),
        user: one(usersTable, {
            fields: [userRolesTable.idUser],
            references: [usersTable.id],
        }),
    }),
);
