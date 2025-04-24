import { relations } from "drizzle-orm";
import {
    bigint,
    date,
    decimal,
    int,
    mysqlTable,
    timestamp,
    varchar,
} from "drizzle-orm/mysql-core";
import { disciplinesTable } from "./disciplines.ts";
import { instructorsTable } from "./instructors.ts";
import { paymentsTable } from "./payments.ts";

export const billingCyclesTable = mysqlTable("tb_billing_cycles", {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
    idInstructor: bigint("id_instructor", {
        mode: "number",
        unsigned: true,
    })
        .notNull()
        .references(() => instructorsTable.idPractitioner),
    idDiscipline: bigint("id_discipline", {
        mode: "number",
        unsigned: true,
    })
        .notNull()
        .references(() => disciplinesTable.id),
    month: int("month").notNull().$type<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12>(),
    year: int("year").notNull(),
    dueDate: date("due_date").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    description: varchar("description", {length: 255}),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const billingCyclesRelations = relations(
    billingCyclesTable,
    ({ one, many }) => ({
        instructor: one(instructorsTable, {
            fields: [billingCyclesTable.idInstructor],
            references: [instructorsTable.idPractitioner],
        }),
        discipline: one(disciplinesTable, {
            fields: [billingCyclesTable.idDiscipline],
            references: [disciplinesTable.id],
        }),
        payments: many(paymentsTable),
    }),
);
