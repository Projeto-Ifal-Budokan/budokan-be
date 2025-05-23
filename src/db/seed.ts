import bcrypt from "bcrypt";
import { and, eq } from "drizzle-orm";
import { db } from "./index";
import { disciplinesTable } from "./schema/discipline-schemas/disciplines";
import { ranksTable } from "./schema/discipline-schemas/ranks";
import { instructorDisciplinesTable } from "./schema/practitioner-schemas/instructor-disciplines";
import { instructorsTable } from "./schema/practitioner-schemas/instructors";
import { matriculationsTable } from "./schema/practitioner-schemas/matriculations";
import { practitionersTable } from "./schema/practitioner-schemas/practitioners";
import { studentsTable } from "./schema/practitioner-schemas/students";
import { privilegesTable } from "./schema/user-schemas/privileges";
import { rolePrivilegesTable } from "./schema/user-schemas/role-privileges";
import { rolesTable } from "./schema/user-schemas/roles";
import { userRolesTable } from "./schema/user-schemas/user-roles";
import { usersTable } from "./schema/user-schemas/users";

// Definindo interfaces para os tipos
interface User {
	id: number;
	email: string;
	firstName: string;
	surname: string;
	[key: string]: unknown;
}

interface Practitioner {
	idUser: number;
	[key: string]: unknown;
}

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
			{ name: "delete_discipline", description: "Excluir disciplina" },

			// Rank management
			{ name: "list_ranks", description: "Listar todos os ranks" },
			{ name: "view_rank", description: "Visualizar detalhes do rank" },
			{ name: "create_rank", description: "Criar novo rank" },
			{ name: "update_rank", description: "Atualizar rank" },
			{ name: "delete_rank", description: "Excluir rank" },

			// Matriculation management
			{
				name: "list_matriculations",
				description: "Listar todas as matrículas",
			},
			{
				name: "view_matriculation",
				description: "Visualizar detalhes da matrícula",
			},
			{ name: "create_matriculation", description: "Criar nova matrícula" },
			{ name: "update_matriculation", description: "Atualizar matrícula" },
			{ name: "delete_matriculation", description: "Excluir matrícula" },

			// Instructor-Discipline management
			{
				name: "list_instructor_disciplines",
				description: "Listar todos os vínculos instrutor-disciplina",
			},
			{
				name: "view_instructor_discipline",
				description: "Visualizar detalhes do vínculo instrutor-disciplina",
			},
			{
				name: "create_instructor_discipline",
				description: "Criar novo vínculo instrutor-disciplina",
			},
			{
				name: "update_instructor_discipline",
				description: "Atualizar vínculo instrutor-disciplina",
			},
			{
				name: "delete_instructor_discipline",
				description: "Excluir vínculo instrutor-disciplina",
			},

			// Session management
			{
				name: "list_sessions",
				description: "Listar todas as aulas",
			},
			{
				name: "view_session",
				description: "Visualizar detalhes da aula do id informado",
			},
			{
				name: "create_session",
				description: "Criar uma nova aula",
			},
			{
				name: "update_session",
				description: "Atualizar uma aula",
			},
			{
				name: "delete_session",
				description: "Exclui uma aula",
			},
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
			{
				name: "student",
				description: "Estudante com acesso básico",
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
			instructor: [
				"list_users",
				"view_user",
				"list_disciplines",
				"view_discipline",
				"list_ranks",
				"view_rank",
				"list_matriculations",
				"view_matriculation",
				"list_instructor_disciplines",
				"view_instructor_discipline",
				"list_sessions",
				"view_session",
				"create_session",
				"update_session",
				"delete_session",
			], // Instructor gets limited privileges
			student: [
				"view_user",
				"list_disciplines",
				"view_discipline",
				"list_ranks",
				"view_rank",
				"view_matriculation",
			], // Student gets basic privileges
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
		const newDisciplines = disciplines.filter(
			(r) => !existingDisciplineNames.includes(r.name),
		);

		if (newDisciplines.length === 0) {
			console.log("Nenhuma nova disciplina para adicionar");
			return existingDisciplines;
		}

		// Add only new disciplines
		await db.insert(disciplinesTable).values(newDisciplines);
		console.log(
			`${newDisciplines.length} novas disciplinas criadas com sucesso`,
		);

		// Return all disciplines (existing + new)
		const allDisciplines = await db.select().from(disciplinesTable);
		return allDisciplines;
	} catch (error) {
		console.error("Erro ao criar disciplinas:", error);
		throw error;
	}
}

async function seedRanks() {
	try {
		// Get existing disciplines
		const disciplines = await db.select().from(disciplinesTable);
		if (disciplines.length === 0) {
			console.log("Nenhuma disciplina encontrada para adicionar ranks");
			return [];
		}

		// Define ranks for each discipline
		const ranksByDiscipline = {
			"Karate-Do": [
				{ name: "7º Kyu", description: "Faixa Branca" },
				{ name: "6º Kyu", description: "Faixa Amarela" },
				{ name: "5º Kyu", description: "Faixa Laranja" },
				{ name: "4º Kyu", description: "Faixa Verde" },
				{ name: "3º Kyu", description: "Faixa Roxa" },
				{ name: "2º Kyu", description: "Faixa Marrom" },
				{ name: "1º Kyu", description: "Faixa Marrom" },
				{ name: "1º Dan", description: "Faixa Preta" },
				{ name: "2º Dan", description: "Faixa Preta" },
				{ name: "3º Dan", description: "Faixa Preta" },
			],
			Kendo: [
				{ name: "Kyu", description: "Nível iniciante" },
				{ name: "Shodan", description: "1º Dan" },
				{ name: "Nidan", description: "2º Dan" },
				{ name: "Sandan", description: "3º Dan" },
				{ name: "Yondan", description: "4º Dan" },
				{ name: "Godan", description: "5º Dan" },
			],
			Arqueria: [
				{ name: "Iniciante", description: "Nível iniciante" },
				{ name: "Intermediário", description: "Nível intermediário" },
				{ name: "Avançado", description: "Nível avançado" },
				{ name: "Mestre", description: "Nível mestre" },
			],
		};

		// Keep track of newly added ranks
		let addedRanksCount = 0;

		// Add ranks for each discipline
		for (const discipline of disciplines) {
			const ranksForDiscipline =
				ranksByDiscipline[discipline.name as keyof typeof ranksByDiscipline];

			if (!ranksForDiscipline) {
				console.log(
					`Nenhum rank definido para a disciplina ${discipline.name}`,
				);
				continue;
			}

			// Get existing ranks for this discipline
			const existingRanks = await db
				.select()
				.from(ranksTable)
				.where(eq(ranksTable.idDiscipline, discipline.id));

			// Find ranks that don't exist yet
			const existingRankNames = existingRanks.map((r) => r.name);
			const newRanks = ranksForDiscipline
				.filter((r) => !existingRankNames.includes(r.name))
				.map((r) => ({
					idDiscipline: discipline.id,
					name: r.name,
					description: r.description,
				}));

			if (newRanks.length === 0) {
				console.log(
					`Nenhum novo rank para adicionar à disciplina ${discipline.name}`,
				);
				continue;
			}

			// Add new ranks
			await db.insert(ranksTable).values(newRanks);
			addedRanksCount += newRanks.length;
			console.log(
				`${newRanks.length} novos ranks adicionados à disciplina ${discipline.name}`,
			);
		}

		console.log(`Total de ${addedRanksCount} novos ranks criados`);
		return await db.select().from(ranksTable);
	} catch (error) {
		console.error("Erro ao criar ranks:", error);
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

async function seedTestUsers() {
	try {
		// Create test instructor user
		let instructorUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, "instructor@budokan.com"));

		if (instructorUser.length === 0) {
			const hashedPassword = await bcrypt.hash("instructor123", 10);
			await db.insert(usersTable).values({
				firstName: "Sensei",
				surname: "Miyagi",
				email: "instructor@budokan.com",
				password: hashedPassword,
				phone: "11999998888",
				birthDate: new Date("1970-01-01"),
				status: "active" as const,
			});

			instructorUser = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.email, "instructor@budokan.com"));

			console.log("Usuário instrutor criado com sucesso");
		}

		// Create test student user
		let studentUser = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, "student@budokan.com"));

		if (studentUser.length === 0) {
			const hashedPassword = await bcrypt.hash("student123", 10);
			await db.insert(usersTable).values({
				firstName: "Aluno",
				surname: "Silva",
				email: "student@budokan.com",
				password: hashedPassword,
				phone: "11988887777",
				birthDate: new Date("1995-05-15"),
				status: "active" as const,
			});

			studentUser = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.email, "student@budokan.com"));

			console.log("Usuário estudante criado com sucesso");
		}

		// Assign roles to users
		if (instructorUser.length > 0) {
			const instructorRole = await db
				.select()
				.from(rolesTable)
				.where(eq(rolesTable.name, "instructor"));

			if (instructorRole.length > 0) {
				const existingRole = await db
					.select()
					.from(userRolesTable)
					.where(
						eq(userRolesTable.idUser, instructorUser[0].id) &&
							eq(userRolesTable.idRole, instructorRole[0].id),
					);

				if (existingRole.length === 0) {
					await db.insert(userRolesTable).values({
						idUser: instructorUser[0].id,
						idRole: instructorRole[0].id,
					});
					console.log("Papel instrutor atribuído ao usuário instrutor");
				}
			}
		}

		if (studentUser.length > 0) {
			const studentRole = await db
				.select()
				.from(rolesTable)
				.where(eq(rolesTable.name, "student"));

			if (studentRole.length > 0) {
				const existingRole = await db
					.select()
					.from(userRolesTable)
					.where(
						eq(userRolesTable.idUser, studentUser[0].id) &&
							eq(userRolesTable.idRole, studentRole[0].id),
					);

				if (existingRole.length === 0) {
					await db.insert(userRolesTable).values({
						idUser: studentUser[0].id,
						idRole: studentRole[0].id,
					});
					console.log("Papel estudante atribuído ao usuário estudante");
				}
			}
		}

		return { instructor: instructorUser[0], student: studentUser[0] };
	} catch (error) {
		console.error("Erro ao criar usuários de teste:", error);
		throw error;
	}
}

async function seedPractitioners(users: {
	instructor: User;
	student: User;
}): Promise<{ instructor: Practitioner; student: Practitioner }> {
	try {
		// Create practitioner records
		let instructorPractitioner = await db
			.select()
			.from(practitionersTable)
			.where(eq(practitionersTable.idUser, users.instructor.id));

		if (instructorPractitioner.length === 0) {
			await db.insert(practitionersTable).values({
				idUser: users.instructor.id,
			});

			instructorPractitioner = await db
				.select()
				.from(practitionersTable)
				.where(eq(practitionersTable.idUser, users.instructor.id));

			console.log("Praticante instrutor criado com sucesso");
		}

		let studentPractitioner = await db
			.select()
			.from(practitionersTable)
			.where(eq(practitionersTable.idUser, users.student.id));

		if (studentPractitioner.length === 0) {
			await db.insert(practitionersTable).values({
				idUser: users.student.id,
			});

			studentPractitioner = await db
				.select()
				.from(practitionersTable)
				.where(eq(practitionersTable.idUser, users.student.id));

			console.log("Praticante estudante criado com sucesso");
		}

		// Create instructor record
		if (instructorPractitioner.length > 0) {
			const existingInstructor = await db
				.select()
				.from(instructorsTable)
				.where(
					eq(instructorsTable.idPractitioner, instructorPractitioner[0].idUser),
				);

			if (existingInstructor.length === 0) {
				await db.insert(instructorsTable).values({
					idPractitioner: instructorPractitioner[0].idUser,
				});
				console.log("Instrutor criado com sucesso");
			}
		}

		// Create student record
		if (studentPractitioner.length > 0) {
			const existingStudent = await db
				.select()
				.from(studentsTable)
				.where(eq(studentsTable.idPractitioner, studentPractitioner[0].idUser));

			if (existingStudent.length === 0) {
				await db.insert(studentsTable).values({
					idPractitioner: studentPractitioner[0].idUser,
				});
				console.log("Estudante criado com sucesso");
			}
		}

		return {
			instructor: instructorPractitioner[0],
			student: studentPractitioner[0],
		};
	} catch (error) {
		console.error("Erro ao criar praticantes:", error);
		throw error;
	}
}

async function seedInstructorDisciplines(instructor: Practitioner) {
	try {
		// Get disciplines
		const disciplines = await db.select().from(disciplinesTable);
		if (disciplines.length === 0) return;

		// Get karate discipline
		const karateDiscipline = disciplines.find((d) => d.name === "Karate-Do");
		if (!karateDiscipline) return;

		// Get a rank for the discipline
		const ranks = await db
			.select()
			.from(ranksTable)
			.where(eq(ranksTable.idDiscipline, karateDiscipline.id));

		const blackBeltRank =
			ranks.find((r) => r.name === "3º Dan") || ranks[ranks.length - 1];
		if (!blackBeltRank) return;

		// Check if instructor discipline already exists
		const existingInstructorDiscipline = await db
			.select()
			.from(instructorDisciplinesTable)
			.where(
				and(
					eq(instructorDisciplinesTable.idInstructor, instructor.idUser),
					eq(instructorDisciplinesTable.idDiscipline, karateDiscipline.id),
				),
			);

		if (existingInstructorDiscipline.length === 0) {
			await db.insert(instructorDisciplinesTable).values({
				idInstructor: instructor.idUser,
				idDiscipline: karateDiscipline.id,
				idRank: blackBeltRank.id,
				status: "active",
			});
			console.log("Vínculo instrutor-disciplina criado com sucesso");
		}
	} catch (error) {
		console.error("Erro ao criar vínculos instrutor-disciplina:", error);
		throw error;
	}
}

async function seedMatriculations(student: Practitioner) {
	try {
		// Get disciplines
		const disciplines = await db.select().from(disciplinesTable);
		if (disciplines.length === 0) return;

		// Get karate discipline
		const karateDiscipline = disciplines.find((d) => d.name === "Karate-Do");
		if (!karateDiscipline) return;

		// Get a rank for the discipline
		const ranks = await db
			.select()
			.from(ranksTable)
			.where(eq(ranksTable.idDiscipline, karateDiscipline.id));

		const beginnerRank = ranks.find((r) => r.name === "7º Kyu") || ranks[0];
		if (!beginnerRank) return;

		// Check if matriculation already exists
		const existingMatriculation = await db
			.select()
			.from(matriculationsTable)
			.where(
				and(
					eq(matriculationsTable.idStudent, student.idUser),
					eq(matriculationsTable.idDiscipline, karateDiscipline.id),
				),
			);

		if (existingMatriculation.length === 0) {
			await db.insert(matriculationsTable).values({
				idStudent: student.idUser,
				idDiscipline: karateDiscipline.id,
				idRank: beginnerRank.id,
				status: "active",
				isPaymentExempt: "N",
			});
			console.log("Matrícula criada com sucesso");
		}

		// Add another discipline if available
		const kendoDiscipline = disciplines.find((d) => d.name === "Kendo");
		if (kendoDiscipline) {
			const kendoRanks = await db
				.select()
				.from(ranksTable)
				.where(eq(ranksTable.idDiscipline, kendoDiscipline.id));

			const kendoBeginnerRank = kendoRanks[0];
			if (kendoBeginnerRank) {
				const existingKendoMatriculation = await db
					.select()
					.from(matriculationsTable)
					.where(
						and(
							eq(matriculationsTable.idStudent, student.idUser),
							eq(matriculationsTable.idDiscipline, kendoDiscipline.id),
						),
					);

				if (existingKendoMatriculation.length === 0) {
					await db.insert(matriculationsTable).values({
						idStudent: student.idUser,
						idDiscipline: kendoDiscipline.id,
						idRank: kendoBeginnerRank.id,
						status: "active",
						isPaymentExempt: "N",
					});
					console.log("Matrícula adicional criada com sucesso");
				}
			}
		}
	} catch (error) {
		console.error("Erro ao criar matrículas:", error);
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
		await seedRanks();
		const adminUser = await seedAdminUser();
		if (adminUser) {
			await assignAdminRole(adminUser);
		}

		// Seed test users and their relationships
		const users = await seedTestUsers();
		const practitioners = await seedPractitioners(users);
		await seedInstructorDisciplines(practitioners.instructor);
		await seedMatriculations(practitioners.student);

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
