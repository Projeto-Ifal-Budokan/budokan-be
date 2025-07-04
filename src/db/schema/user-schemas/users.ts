import { bigint, timestamp } from "drizzle-orm/mysql-core";
import {
	datetime,
	mysqlEnum,
	mysqlTable,
	varchar,
} from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("tb_users", {
	id: bigint("id", { mode: "number", unsigned: true })
		.autoincrement()
		.primaryKey(),
	firstName: varchar("first_name", { length: 100 }).notNull(),
	surname: varchar("surname", { length: 100 }).notNull(),
	phone: varchar("phone", { length: 20 }).notNull(),
	birthDate: datetime("birth_date").notNull(),
	email: varchar("email", { length: 150 }).notNull().unique(),
	password: varchar("password", { length: 255 }).notNull(),
	profileImageUrl: varchar("profile_image_url", { length: 500 }),
	status: mysqlEnum("status", ["active", "inactive", "suspended"])
		.notNull()
		.default("inactive"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
