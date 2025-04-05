import { mysqlTable, varchar, datetime, serial } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";


export const usersTable = mysqlTable("users_table", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull(), // 'student', 'instructor', 'admin'
  status: varchar("status", { length: 20 }).default("inactive"), // 'active' or 'inactive'
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at"),
});