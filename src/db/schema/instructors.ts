import { relations } from "drizzle-orm";
import {
	bigint,
	mysqlTable,
	serial,
	text,
	varchar,
} from "drizzle-orm/mysql-core";
import { usersTable } from "./users-table";

export const instructorsTable = mysqlTable("instructors", {
	id: serial("id").primaryKey(),
	userId: bigint("user_id", { mode: "number", unsigned: true })
		.notNull()
		.references(() => usersTable.id),
	bio: text("bio"), // breve descrição do sensei
	rank: varchar("rank", { length: 50 }), // graduação, como faixa preta 2º dan
});

export const instructorsRelations = relations(instructorsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [instructorsTable.userId],
		references: [usersTable.id],
	}),
}));
