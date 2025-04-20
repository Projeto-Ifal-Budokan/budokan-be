import { sql } from "drizzle-orm";
import {
    datetime,
    bigint,
    mysqlTable,
    serial,
    varchar,
} from "drizzle-orm/mysql-core";
import { disciplinesTable } from "./disciplines.ts";

export const ranksTable = mysqlTable("ranks", {
    id: serial("id").primaryKey(),
    idDiscipline: bigint("id_discipline", { mode: "number", unsigned: true }).references(
        () => disciplinesTable.id,
    ),
    name: varchar("name", { length: 100 }).notNull(),
    description: varchar("description", { length: 100 }).notNull(),
});
