import { sql, relations } from "drizzle-orm";
import {
	bigint,
	mysqlTable,
	serial,
	text,
	varchar,
	datetime
} from "drizzle-orm/mysql-core";
import { practitionersTable } from "./practitioners";

export const instructorsTable = mysqlTable("instructors", {
	id: serial("id").primaryKey(),
	practitionerId: bigint("practitioner_id", { mode: "number", unsigned: true }).notNull().references(
		() => practitionersTable.id
	),
	bio: text("bio"), // breve descrição do sensei
	// TODO: isso será com consulta em exams ?? 
	// rank: varchar("rank", { length: 50 }), // graduação, como faixa preta 2º dan
	createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: datetime("updated_at").$onUpdate(() => new Date()),
});

export const instructorsRelations = relations(instructorsTable, ({ one }) => ({
	user: one(practitionersTable, {
		fields: [instructorsTable.practitionerId],
		references: [practitionersTable.id],
	}),
}));
