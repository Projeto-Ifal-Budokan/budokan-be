import { relations, sql } from "drizzle-orm";
import { bigint, mysqlEnum, mysqlTable, time, timestamp } from "drizzle-orm/mysql-core";
import { disciplinesTable } from "./disciplines";

export const trainingSchedulesTable = mysqlTable("tb_training_schedules", {
    id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
    idDiscipline: bigint("id_discipline", {
        mode: "number",
        unsigned: true,
    }).references(() => disciplinesTable.id),
    weekday: mysqlEnum("weekday", ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])
        .notNull(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const trainingSchedulesRelations = relations(
    trainingSchedulesTable,
    ({ one }) => ({
        disciplines: one(disciplinesTable, {
            fields: [trainingSchedulesTable.idDiscipline],
            references: [disciplinesTable.id],
        }),
    }),
);
