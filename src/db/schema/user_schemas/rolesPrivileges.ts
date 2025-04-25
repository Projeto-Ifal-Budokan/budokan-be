import { relations } from "drizzle-orm";
import {
    bigint,
    mysqlTable,
    timestamp,
} from "drizzle-orm/mysql-core";
import { rolesTable } from "./roles.ts";
import { privilegesTable } from "./privileges.ts";

export const rolesPrivilegesTable = mysqlTable("tb_roles_privileges", {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
    idRole: bigint("id_role", {
        mode: "number",
        unsigned: true,
    })
        .notNull()
        .references(() => rolesTable.id),
    idPrivilege: bigint("id_privilege", { 
        mode: "number", 
        unsigned: true,
    })
        .notNull()
        .references(() => privilegesTable.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const rolesPrivilegesRelations = relations(
    rolesPrivilegesTable,
    ({ one }) => ({
        role: one(rolesTable, {
            fields: [rolesPrivilegesTable.idRole],
            references: [rolesTable.id],
        }),
        privilege: one(privilegesTable, {
            fields: [rolesPrivilegesTable.idPrivilege],
            references: [privilegesTable.id],
        }),
    }),
);
