import { bigint, timestamp } from "drizzle-orm/mysql-core";
import {
	datetime,
	mysqlEnum,
	mysqlTable,
	varchar,
} from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("tb_users", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	firstName: varchar("first_name", { length: 100 }).notNull(),
	surname: varchar("surname", { length: 100 }).notNull(),
	phone: varchar("phone", { length: 20 }),
	birthDate: datetime("birth_date"),
	email: varchar("email", { length: 150 }).notNull().unique(),
	password: varchar("password", { length: 255 }).notNull(),
	status: mysqlEnum("status", ["active", "inactive", "suspended"])
		.notNull()
		.default("inactive"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
