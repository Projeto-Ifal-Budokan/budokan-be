import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
export const db = drizzle(process.env.DATABASE_URL!);
