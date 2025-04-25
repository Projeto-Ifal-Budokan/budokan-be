import { relations } from "drizzle-orm";
import {
    bigint,
    date,
    mysqlEnum,
    mysqlTable,
    timestamp,
} from "drizzle-orm/mysql-core";
import { billingCyclesTable } from "./billingCycles.ts";
import { matriculationsTable } from "../practitioner_schemas/matriculations.ts";

export const paymentsTable = mysqlTable("tb_payments", {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
    idBillingCycle: bigint("id_billing_cycle", {
        mode: "number",
        unsigned: true,
    })
        .notNull()
        .references(() => billingCyclesTable.id),
    idMatriculation: bigint("id_matriculation", {
        mode: "number",
        unsigned: true,
    })
        .notNull()
        .references(() => matriculationsTable.id),
    paymentDate: date("payment_date").notNull(),
    status: mysqlEnum("status", ["paid", "pending", "late"])
        .notNull()
        .default("pending"),
    method: mysqlEnum("method", ["pix", "cash", "credit", "debit"]),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const paymentsRelations = relations(
    paymentsTable,
    ({ one }) => ({
        billingCycle: one(billingCyclesTable, {
            fields: [paymentsTable.idBillingCycle],
            references: [billingCyclesTable.id],
        }),
        matriculation: one(matriculationsTable, {
            fields: [paymentsTable.idMatriculation],
            references: [matriculationsTable.id],
        }),
    }),
);
