import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { usersTable } from "./schema/user-schemas/users";

async function seedAdminUser() {
	try {
		// Check if admin user already exists
		const existingAdmin = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, "admin@budokan.com"));

		if (existingAdmin.length > 0) {
			console.log("Admin user already exists");
			return;
		}

		// Create admin user
		const hashedPassword = await bcrypt.hash("admin123", 10);
		const adminUser = {
			id: 1, // Using 1 as the ID for the first admin user
			firstName: "Admin",
			surname: "System",
			email: "admin@budokan.com",
			password: hashedPassword,
			phone: "00000000000",
			birthDate: new Date(),
			status: "active" as const,
		};

		await db.insert(usersTable).values(adminUser);
		console.log("Admin user created successfully");
	} catch (error) {
		console.error("Error seeding admin user:", error);
		throw error;
	}
}

// Export the seed function to be called when needed
export const seed = async () => {
	try {
		await seedAdminUser();
		console.log("Database seeding completed");
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1);
	}
};

// If this file is run directly
if (require.main === module) {
	seed()
		.then(() => process.exit(0))
		.catch(() => process.exit(1));
}
