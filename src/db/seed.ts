import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { privilegesTable } from "./schema/user-schemas/privileges";
import { rolePrivilegesTable } from "./schema/user-schemas/role-privileges";
import { rolesTable } from "./schema/user-schemas/roles";
import { userRolesTable } from "./schema/user-schemas/user-roles";
import { usersTable } from "./schema/user-schemas/users";
import { disciplinesTable } from "./schema/discipline-schemas/disciplines";

async function seedPrivileges() {
	try {
		// Get existing privileges
		const existingPrivileges = await db.select().from(privilegesTable);

		// Define all privileges that should exist
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

			// User Roles management
			{
				name: "update_user_roles",
				description: "Atualizer papéis de um usuário",
			},
			{
				name: "view_user_roles",
				description: "Visualizar papéis de um usuário",
			},

			// Role privileges management
			{
				name: "update_role_privileges",
				description: "Atualizer privilégios de um papel",
			},
			{
				name: "view_role_privileges",
				description: "Visualizar privilégios de um papel",
			},

			// Discipline management
			{ name: "list_disciplines", description: "Listar todas as disciplinas" },
			{
				name: "view_discipline",
				description: "Visualizar detalhes da disciplina",
			},
			{ name: "create_discipline", description: "Criar nova disciplina" },
			{ name: "update_discipline", description: "Atualizar disciplina" },
		];

		// Find privileges that don't exist yet
		const existingPrivilegeNames = existingPrivileges.map((p) => p.name);
		const newPrivileges = privileges.filter(
			(p) => !existingPrivilegeNames.includes(p.name),
		);

		if (newPrivileges.length === 0) {
			console.log("Nenhum novo privilégio para adicionar");
			return existingPrivileges;
		}

		// Add only new privileges
		await db.insert(privilegesTable).values(newPrivileges);
		console.log(
			`${newPrivileges.length} novos privilégios criados com sucesso`,
		);

		// Return all privileges (existing + new)
		const allPrivileges = await db.select().from(privilegesTable);
		return allPrivileges;
	} catch (error) {
		console.error("Erro ao criar privilégios:", error);
		throw error;
	}
}

async function seedRoles() {
	try {
		// Get existing roles
		const existingRoles = await db.select().from(rolesTable);

		// Define all roles that should exist
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

		// Find roles that don't exist yet
		const existingRoleNames = existingRoles.map((r) => r.name);
		const newRoles = roles.filter((r) => !existingRoleNames.includes(r.name));

		if (newRoles.length === 0) {
			console.log("Nenhum novo papel para adicionar");
			return existingRoles;
		}

		// Add only new roles
		await db.insert(rolesTable).values(newRoles);
		console.log(`${newRoles.length} novos papéis criados com sucesso`);

		// Return all roles (existing + new)
		const allRoles = await db.select().from(rolesTable);
		return allRoles;
	} catch (error) {
		console.error("Erro ao criar papéis:", error);
		throw error;
	}
}

async function seedRolePrivileges() {
	try {
		// Get all privileges and roles
		const allPrivileges = await db.select().from(privilegesTable);
		const allRoles = await db.select().from(rolesTable);

		// Define role-privilege mappings
		const rolePrivilegeMappings = {
			admin: allPrivileges.map((p) => p.name), // Admin gets all privileges
			instructor: ["list_users", "view_user"], // Instructor gets limited privileges
		};

		// Process each role
		for (const role of allRoles) {
			const privilegeNames =
				rolePrivilegeMappings[role.name as keyof typeof rolePrivilegeMappings];
			if (!privilegeNames) continue;

			// Get existing privileges for this role
			const existingPrivileges = await db
				.select()
				.from(rolePrivilegesTable)
				.where(eq(rolePrivilegesTable.idRole, role.id));

			// Find privileges to add
			const privilegesToAdd = allPrivileges
				.filter((p) => privilegeNames.includes(p.name))
				.filter(
					(p) => !existingPrivileges.some((ep) => ep.idPrivilege === p.id),
				)
				.map((p) => ({
					idRole: role.id,
					idPrivilege: p.id,
				}));

			if (privilegesToAdd.length > 0) {
				await db.insert(rolePrivilegesTable).values(privilegesToAdd);
				console.log(
					`${privilegesToAdd.length} novos privilégios atribuídos ao papel ${role.name}`,
				);
			} else {
				console.log(
					`Nenhum novo privilégio para atribuir ao papel ${role.name}`,
				);
			}
		}
	} catch (error) {
		console.error("Erro ao mapear privilégios dos papéis:", error);
		throw error;
	}
}

async function seedDisciplines() {
	try {
		// Get existing disciplines
		const existingDisciplines = await db.select().from(disciplinesTable);

		// Define all disciplines that should exist
		const disciplines = [
			{
				name: "Karate-Do",
				description: "Modalidade de Karate-Do",
			},
			{
				name: "Kendo",
				description: "Modalidade de Kendo",
			},
			{
				name: "Arqueria",
				description: "Modalidade de Arqueria",
			},
		];

		// Find disciplines that don't exist yet
		const existingDisciplineNames = existingDisciplines.map((r) => r.name);
		const newDisciplines = disciplines.filter((r) => !existingDisciplineNames.includes(r.name));

		if (newDisciplines.length === 0) {
			console.log("Nenhuma nova disciplina para adicionar");
			return existingDisciplines;
		}

		// Add only new disciplines
		await db.insert(disciplinesTable).values(newDisciplines);
		console.log(`${newDisciplines.length} novas disciplinas criadas com sucesso`);

		// Return all disciplines (existing + new)
		const allDisciplines = await db.select().from(disciplinesTable);
		return allDisciplines;
	} catch (error) {
		console.error("Erro ao criar disciplinas:", error);
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
		await seedRolePrivileges();
		await seedDisciplines();
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
