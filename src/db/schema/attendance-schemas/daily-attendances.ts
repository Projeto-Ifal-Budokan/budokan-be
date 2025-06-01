import { relations } from "drizzle-orm";
import {
    bigint,
    mysqlEnum,
    mysqlTable,
    timestamp,
    varchar,
} from "drizzle-orm/mysql-core";
import { sessionsTable } from "./sessions";
import { dailySessionsTable } from "./daily-sessions";
import { matriculationsTable } from "../practitioner-schemas/matriculations";

export const dailyAttendancesTable = mysqlTable("tb_daily_attendances", {
    id: bigint("id", { mode: "number", unsigned: true })
        .autoincrement()
        .primaryKey(),
    idMatriculation: bigint("id_matriculation", {
        mode: "number",
        unsigned: true,
    })
        .notNull()
        .references(() => matriculationsTable.id),
    idDailySession: bigint("id_daily_session", { mode: "number", unsigned: true })
        .notNull()
        .references(() => dailySessionsTable.id),
    idSession: bigint("id_session", { mode: "number", unsigned: true })
        .references(() => sessionsTable.id),
    status: mysqlEnum("status", ["present", "absent"])
        .notNull()
        .default("absent"),
    justification: mysqlEnum("justification", [
        "medical",
        "personal",
        "professional",
        "weather",
        "transport",
        "family",
        "academic",
        "technical",
        "emergency",
        "other",
    ]),
    justificationDescription: varchar("justification_description", {
        length: 255,
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const dailyAttendancesRelations = relations(dailyAttendancesTable, ({ one }) => ({
    matriculation: one(matriculationsTable, {
        fields: [dailyAttendancesTable.idMatriculation],
        references: [matriculationsTable.id],
    }),
    dailySession: one(dailySessionsTable, {
        fields: [dailyAttendancesTable.idDailySession],
        references: [dailySessionsTable.id],
    }),
    session: one(sessionsTable, {
        fields: [dailyAttendancesTable.idSession],
        references: [sessionsTable.id],
    }),
}));
