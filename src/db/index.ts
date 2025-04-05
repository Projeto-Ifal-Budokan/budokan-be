import "dotenv/config";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { usersTable } from "./schema/users-table";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const db = drizzle(process.env.DATABASE_URL!);

async function main() {
	const user: typeof usersTable.$inferInsert = {
		id: 1,
		name: "John",
		age: 30,
		email: "john@example.com",
		passwordHash: "asdasd",
		role: "student",
	};

	await db.insert(usersTable).values(user);
	console.log("New user created!");

	const users = await db.select().from(usersTable);
	console.log("Getting all users from the database: ", users);
	/*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

	await db
		.update(usersTable)
		.set({
			age: 31,
		})
		.where(eq(usersTable.email, user.email));
	console.log("User info updated!");

	await db.delete(usersTable).where(eq(usersTable.email, user.email));
	console.log("User deleted!");
}

main();
