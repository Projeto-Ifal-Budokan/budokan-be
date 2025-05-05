import { relations } from "drizzle-orm";
import { bigint, mysqlEnum, mysqlTable, timestamp } from "drizzle-orm/mysql-core";
import { sessionsTable } from "./sessions";
import { matriculationsTable } from "../practitioner-schemas/matriculations";

export const attendancesTable = mysqlTable("tb_attendances", {
    id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
    idMatriculation: bigint("id_matriculation", { mode: "number", unsigned: true })
        .notNull()
        .references(() => matriculationsTable.id),
    idSession: bigint("id_session", { mode: "number", unsigned: true })
        .notNull()
        .references(() => sessionsTable.id),
    status: mysqlEnum("status", ["present", "absent"]).notNull().default("absent"), 
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const attendancesRelations = relations(
    attendancesTable,
    ({ one }) => ({
        matriculation: one(matriculationsTable, {
            fields: [attendancesTable.idMatriculation],
            references: [matriculationsTable.id],
        }),
        session: one(sessionsTable, {
            fields: [attendancesTable.idSession],
            references: [sessionsTable.id],
        }),
    }),
);
