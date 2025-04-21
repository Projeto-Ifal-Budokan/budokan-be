import { sql } from "drizzle-orm";
import {
	bigint,
	datetime,
	mysqlTable,
	serial,
	varchar,
} from "drizzle-orm/mysql-core";
import { disciplinesTable } from "./disciplines.ts";

export const ranksTable = mysqlTable("ranks", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	idDiscipline: bigint("id_discipline", {
		mode: "number",
		unsigned: true,
	}).references(() => disciplinesTable.id),
	name: varchar("name", { length: 100 }).notNull(),
	description: varchar("description", { length: 100 }).notNull(),
});
