import { relations } from "drizzle-orm";
import { bigint, date, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { practitionersTable } from "../practitioner-schemas/practitioners";

export const achievmentsTable = mysqlTable("tb_achievments", {
    id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
    idPractitioner: bigint("id_practitioner", {
        mode: "number",
        unsigned: true 
    })
        .references(() => practitionersTable.idUser),
    title: varchar("title", {length: 100}).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    achievementDate: date("achievement_date").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const achievmentsRelations = relations(achievmentsTable, ({ one }) => ({
    practitioner: one(practitionersTable, {
        fields: [achievmentsTable.idPractitioner],
        references: [practitionersTable.idUser],
    })
}));
