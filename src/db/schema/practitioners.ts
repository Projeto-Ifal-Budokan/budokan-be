import { sql, relations } from "drizzle-orm";
import {
    datetime,
    bigint,
    mysqlTable,
    serial,
    varchar,
} from "drizzle-orm/mysql-core";
import { usersTable } from "./users.ts";
// TODO: O ID do rank deve estar na matricula ja q um estudante pode ter rank no kendo e no karate
// import { ranksTable } from "./ranks.ts";

export const practitionersTable = mysqlTable("practitioners", {
    id: serial("id").primaryKey(),
    userId: bigint("id_user", { mode: "number", unsigned: true }).references(
        () => usersTable.id,
    ),
    // rankId: bigint("id_rank", { mode: "number", unsigned: true }).references(
    //     () => ranksTable.id,
    // ),
    healthObservations: varchar("health_observations", { length: 255 }),
    createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").$onUpdate(() => new Date()),
});

export const practitionersRelations = relations(practitionersTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [practitionersTable.userId],
        references: [usersTable.id],
    })
}));
