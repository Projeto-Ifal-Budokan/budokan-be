import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { privilegesTable } from "./schema/user-schemas/privileges";
import { rolesTable } from "./schema/user-schemas/roles";
import { rolesPrivilegesTable } from "./schema/user-schemas/roles-privileges";
import { userRolesTable } from "./schema/user-schemas/user-roles";
import { usersTable } from "./schema/user-schemas/users";

async function seedPrivileges() {
	try {
		// Check if privileges already exist
		const existingPrivileges = await db.select().from(privilegesTable);
		if (existingPrivileges.length > 0) {
			console.log("Privilégios já existem");
			return;
		}

		// Define all privileges
		const privileges = [
			// User privileges
			{ name: "list_users", description: "Listar todos os usuários" },
			{ name: "view_user", description: "Visualizar detalhes do usuário" },
			{ name: "update_user", description: "Atualizar informações do usuário" },
			{ name: "delete_user", description: "Excluir usuário" },

			// Role privileges
			{ name: "list_roles", description: "Listar todos os papéis" },
			{ name: "view_role", description: "Visualizar detalhes do papel" },
			{ name: "create_role", description: "Criar novo papel" },
			{ name: "update_role", description: "Atualizar papel" },
			{ name: "delete_role", description: "Excluir papel" },

			// Privilege management
			{ name: "list_privileges", description: "Listar todos os privilégios" },
			{
				name: "view_privilege",
				description: "Visualizar detalhes do privilégio",
			},
			{ name: "create_privilege", description: "Criar novo privilégio" },
			{ name: "update_privilege", description: "Atualizar privilégio" },
			{ name: "delete_privilege", description: "Excluir privilégio" },
		];

		await db.insert(privilegesTable).values(privileges);
		console.log("Privilégios criados com sucesso");
		return privileges;
	} catch (error) {
		console.error("Erro ao criar privilégios:", error);
		throw error;
	}
}

async function seedRoles() {
	try {
		// Check if roles already exist
		const existingRoles = await db.select().from(rolesTable);
		if (existingRoles.length > 0) {
			console.log("Papéis já existem");
			return;
		}

		// Create admin and instructor roles
		const roles = [
			{
				name: "admin",
				description: "Administrador com acesso total ao sistema",
			},
			{
				name: "instructor",
				description: "Instrutor com acesso limitado",
			},
		];

		await db.insert(rolesTable).values(roles);
		console.log("Papéis criados com sucesso");

		// Get all privileges and roles for mapping
		const allPrivileges = await db.select().from(privilegesTable);
		const createdRoles = await db.select().from(rolesTable);

		const adminRole = createdRoles.find((role) => role.name === "admin");
		const instructorRole = createdRoles.find(
			(role) => role.name === "instructor",
		);

		if (adminRole) {
			// Give admin all privileges
			const adminPrivileges = allPrivileges.map((privilege) => ({
				idRole: adminRole.id,
				idPrivilege: privilege.id,
			}));
			await db.insert(rolesPrivilegesTable).values(adminPrivileges);
		}

		if (instructorRole) {
			// Give instructor only user-related privileges
			const instructorPrivilegeNames = ["list_users", "view_user"];
			const instructorPrivileges = allPrivileges
				.filter((p) => instructorPrivilegeNames.includes(p.name))
				.map((privilege) => ({
					idRole: instructorRole.id,
					idPrivilege: privilege.id,
				}));
			await db.insert(rolesPrivilegesTable).values(instructorPrivileges);
		}

		console.log("Privilégios dos papéis mapeados com sucesso");
	} catch (error) {
		console.error("Erro ao criar papéis:", error);
		throw error;
	}
}

async function seedAdminUser() {
	try {
		// Check if admin user already exists
		const existingAdmin = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, "admin@budokan.com"));

		if (existingAdmin.length > 0) {
			console.log("Usuário admin já existe");
			return existingAdmin[0];
		}

		// Create admin user
		const hashedPassword = await bcrypt.hash("admin123", 10);
		const adminUser = {
			firstName: "Admin",
			surname: "System",
			email: "admin@budokan.com",
			password: hashedPassword,
			phone: "00000000000",
			birthDate: new Date(),
			status: "active" as const,
		};

		await db.insert(usersTable).values(adminUser);
		console.log("Usuário admin criado com sucesso");

		// Get the created admin user
		const createdAdmin = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, "admin@budokan.com"));

		if (createdAdmin.length === 0) {
			throw new Error("Falha ao encontrar usuário admin criado");
		}

		return createdAdmin[0];
	} catch (error) {
		console.error("Erro ao criar usuário admin:", error);
		throw error;
	}
}

async function assignAdminRole(adminUser: { id: number }) {
	try {
		// Get admin role
		const adminRole = await db
			.select()
			.from(rolesTable)
			.where(eq(rolesTable.name, "admin"));

		if (adminRole.length === 0) {
			console.log("Papel admin não encontrado");
			return;
		}

		// Check if admin role is already assigned
		const existingUserRole = await db
			.select()
			.from(userRolesTable)
			.where(
				eq(userRolesTable.idUser, adminUser.id) &&
					eq(userRolesTable.idRole, adminRole[0].id),
			);

		if (existingUserRole.length === 0) {
			// Assign admin role to admin user
			await db.insert(userRolesTable).values({
				idUser: adminUser.id,
				idRole: adminRole[0].id,
			});
			console.log("Papel admin atribuído ao usuário admin");
		} else {
			console.log("Papel admin já atribuído ao usuário admin");
		}
	} catch (error) {
		console.error("Erro ao atribuir papel admin:", error);
		throw error;
	}
}

// Export the seed function to be called when needed
export const seed = async () => {
	try {
		await seedPrivileges();
		await seedRoles();
		const adminUser = await seedAdminUser();
		if (adminUser) {
			await assignAdminRole(adminUser);
		}
		console.log("População do banco de dados concluída");
	} catch (error) {
		console.error("Erro ao popular banco de dados:", error);
		process.exit(1);
	}
};

// If this file is run directly
if (require.main === module) {
	seed()
		.then(() => process.exit(0))
		.catch(() => process.exit(1));
}
