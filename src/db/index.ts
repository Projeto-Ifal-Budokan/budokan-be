import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is not set");
}

// Create the MySQL connection
const connection = mysql.createPool(process.env.DATABASE_URL);

// Create the typed database instance
export const db = drizzle(connection, {
	schema,
	mode: "default",
});
