import { sql, relations } from "drizzle-orm";
import {
    bigint,
    mysqlTable,
    serial,
    varchar,
    datetime
} from "drizzle-orm/mysql-core";
import { studentsTable } from "./students.ts";
import { disciplinesTable } from "./disciplines.ts";
import { usersTable } from "../unifiedSchema.ts";

export const matriculationsTable = mysqlTable("matriculations", {
    id: serial("id").primaryKey(),
    studentId: bigint("student_id", { mode: "number", unsigned: true }).references(
        () => studentsTable.id),
    disciplineId: bigint("discipline_id", { mode: "number", unsigned: true }).references(
        () => disciplinesTable.id),
    status: varchar("status", { length: 100 }).notNull().default("active"), // 'active' or 'inactive'
    activatedBy: bigint("activated_by", { mode: "number", unsigned: true }).references(
        () => usersTable.id).default(sql`null`),
    inactivatedBy: bigint("inactivated_by", { mode: "number", unsigned: true }).references(
        () => usersTable.id).default(sql`null`),
    isPaymentExempt: varchar("is_payment_exempt", {length : 1}).notNull().default(sql`N`), // Y = yes, N = no
    createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").$onUpdate(() => new Date()),
});

export const matriculationsRelations = relations(matriculationsTable, ({ one }) => ({
    student: one(studentsTable, {
        fields: [matriculationsTable.studentId],
        references: [studentsTable.id],
    }),
    discipline: one(disciplinesTable, {
        fields: [matriculationsTable.disciplineId],
        references: [disciplinesTable.id],
    }),
    activatedByUser: one(usersTable, {
        fields: [matriculationsTable.activatedBy],
        references: [usersTable.id],
    }),
    inactivatedByUser: one(usersTable, {
        fields: [matriculationsTable.inactivatedBy],
        references: [usersTable.id],
    }),
}));