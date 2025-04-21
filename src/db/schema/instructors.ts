import { relations, sql } from "drizzle-orm";
import { bigint, mysqlTable, text, timestamp } from "drizzle-orm/mysql-core";
import { pixKeysTable } from "./pixKeys.ts";
import { practitionersTable } from "./practitioners.ts";

export const instructorsTable = mysqlTable("instructors", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	practitionerId: bigint("practitioner_id", { mode: "number", unsigned: true })
		.notNull()
		.references(() => practitionersTable.id),
	bio: text("bio"), // breve descrição do sensei
	// TODO: isso será com consulta em exams ??
	// rank: varchar("rank", { length: 50 }), // graduação, como faixa preta 2º dan
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const instructorsRelations = relations(
	instructorsTable,
	({ one, many }) => ({
		user: one(practitionersTable, {
			fields: [instructorsTable.practitionerId],
			references: [practitionersTable.id],
		}),
		pixKeys: many(pixKeysTable),
	}),
);
