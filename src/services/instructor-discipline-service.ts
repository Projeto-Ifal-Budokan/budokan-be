import { and, count, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { disciplinesTable } from "../db/schema/discipline-schemas/disciplines";
import { ranksTable } from "../db/schema/discipline-schemas/ranks";
import { instructorDisciplinesTable } from "../db/schema/practitioner-schemas/instructor-disciplines";
import { instructorsTable } from "../db/schema/practitioner-schemas/instructors";
import { practitionersTable } from "../db/schema/practitioner-schemas/practitioners";
import { usersTable } from "../db/schema/user-schemas/users";
import { ConflictError, NotFoundError } from "../errors/app-errors";
import type {
	CreateInstructorDisciplineInput,
	UpdateInstructorDisciplineInput,
	ListInstructorDisciplineInput,
} from "../schemas/instructor-discipline.schemas";

export class InstructorDisciplineService {
	async list(
		filters?: ListInstructorDisciplineInput,
		pagination?: { limit: number; offset: number },
	) {
		const { limit, offset } = pagination || { limit: 10, offset: 0 };

		const where = [
			filters?.idInstructor
			? eq(instructorDisciplinesTable.idInstructor, filters.idInstructor)
			: undefined,
			filters?.idDiscipline
			? eq(instructorDisciplinesTable.idDiscipline, filters.idDiscipline)
			: undefined,
			filters?.status
			? eq(instructorDisciplinesTable.status, filters.status)
			: undefined,
		]

		const [instructorDisciplines, [{ count: total }]] = await Promise.all([
			db
				.select({
					id: instructorDisciplinesTable.id,
					idInstructor: instructorDisciplinesTable.idInstructor,
					instructorName: sql<string>`concat(${usersTable.firstName}, ' ', ${usersTable.surname})`,
					idDiscipline: instructorDisciplinesTable.idDiscipline,
					disciplineName: disciplinesTable.name,
					idRank: instructorDisciplinesTable.idRank,
					rankName: ranksTable.name,
					status: instructorDisciplinesTable.status,
					activatedBy: instructorDisciplinesTable.activatedBy,
					inactivatedBy: instructorDisciplinesTable.inactivatedBy,
					createdAt: instructorDisciplinesTable.createdAt,
					updatedAt: instructorDisciplinesTable.updatedAt,
				})
				.from(instructorDisciplinesTable)
				.leftJoin(
					disciplinesTable,
					eq(instructorDisciplinesTable.idDiscipline, disciplinesTable.id),
				)
				.leftJoin(
					ranksTable,
					eq(instructorDisciplinesTable.idRank, ranksTable.id),
				)
				.leftJoin(
					practitionersTable,
					eq(
						instructorDisciplinesTable.idInstructor,
						practitionersTable.idUser,
					),
				)
				.leftJoin(usersTable, eq(practitionersTable.idUser, usersTable.id))
				.where(and(...where))
				.limit(limit)
				.offset(offset),
			db
				.select({ count: count() })
				.from(instructorDisciplinesTable)
				.where(and(...where)),
		]);

		return { items: instructorDisciplines, count: Number(total) };
	}

	async getInstructorDisciplineById(id: number) {
		const instructorDiscipline = await db
			.select({
				id: instructorDisciplinesTable.id,
				idInstructor: instructorDisciplinesTable.idInstructor,
				idDiscipline: instructorDisciplinesTable.idDiscipline,
				idRank: instructorDisciplinesTable.idRank,
				status: instructorDisciplinesTable.status,
				activatedBy: instructorDisciplinesTable.activatedBy,
				inactivatedBy: instructorDisciplinesTable.inactivatedBy,
				createdAt: instructorDisciplinesTable.createdAt,
				updatedAt: instructorDisciplinesTable.updatedAt,
			})
			.from(instructorDisciplinesTable)
			.where(eq(instructorDisciplinesTable.id, id));

		if (instructorDiscipline.length === 0) {
			throw new NotFoundError("Vínculo de instrutor-disciplina não encontrado");
		}

		return instructorDiscipline[0];
	}

	async createInstructorDiscipline(data: CreateInstructorDisciplineInput) {
		// Verificar se o usuário existe como praticante
		const practitioner = await db
			.select()
			.from(practitionersTable)
			.where(eq(practitionersTable.idUser, data.idInstructor));

		if (practitioner.length === 0) {
			throw new NotFoundError("Usuário não encontrado como praticante");
		}

		// Verificar se o praticante já está registrado como instrutor, se não, criar
		let instructor = await db
			.select()
			.from(instructorsTable)
			.where(eq(instructorsTable.idPractitioner, data.idInstructor));

		if (instructor.length === 0) {
			// Criar automaticamente um registro de instrutor
			await db.insert(instructorsTable).values({
				idPractitioner: data.idInstructor,
			});

			console.log(
				`Registro de instrutor criado automaticamente para o praticante ${data.idInstructor}`,
			);

			instructor = await db
				.select()
				.from(instructorsTable)
				.where(eq(instructorsTable.idPractitioner, data.idInstructor));

			if (instructor.length === 0) {
				throw new NotFoundError("Falha ao criar registro de instrutor");
			}
		}

		// Verificar se a disciplina existe
		const discipline = await db
			.select()
			.from(disciplinesTable)
			.where(eq(disciplinesTable.id, data.idDiscipline));

		if (discipline.length === 0) {
			throw new NotFoundError("Disciplina não encontrada");
		}

		// Verificar se a graduação existe e pertence à disciplina selecionada
		const rank = await db
			.select()
			.from(ranksTable)
			.where(
				and(
					eq(ranksTable.id, data.idRank),
					eq(ranksTable.idDiscipline, data.idDiscipline),
				),
			);

		if (rank.length === 0) {
			throw new NotFoundError(
				"Graduação não encontrada ou não pertence à disciplina selecionada",
			);
		}

		// Verificar se já existe um vínculo ativo para este instrutor nesta disciplina
		const existingInstructorDiscipline = await db
			.select()
			.from(instructorDisciplinesTable)
			.where(
				and(
					eq(instructorDisciplinesTable.idInstructor, data.idInstructor),
					eq(instructorDisciplinesTable.idDiscipline, data.idDiscipline),
				),
			);

		if (existingInstructorDiscipline.length > 0) {
			throw new ConflictError(
				"Este instrutor já possui um vínculo com esta disciplina",
			);
		}

		await db.insert(instructorDisciplinesTable).values(data);
		return { message: "Vínculo instrutor-disciplina criado com sucesso" };
	}

	async updateInstructorDiscipline(
		id: number,
		data: UpdateInstructorDisciplineInput,
	) {
		const existingInstructorDiscipline = await db
			.select()
			.from(instructorDisciplinesTable)
			.where(eq(instructorDisciplinesTable.id, id));

		if (existingInstructorDiscipline.length === 0) {
			throw new NotFoundError("Vínculo instrutor-disciplina não encontrado");
		}

		// Verificar se a graduação existe e pertence à disciplina do vínculo
		if (data.idRank) {
			const instructorDisciplineDiscipline =
				existingInstructorDiscipline[0].idDiscipline;

			const rank = await db
				.select()
				.from(ranksTable)
				.where(
					and(
						eq(ranksTable.id, data.idRank),
						eq(ranksTable.idDiscipline, instructorDisciplineDiscipline),
					),
				);

			if (rank.length === 0) {
				throw new NotFoundError(
					"Graduação não encontrada ou não pertence à disciplina do vínculo",
				);
			}
		}

		await db
			.update(instructorDisciplinesTable)
			.set(data)
			.where(eq(instructorDisciplinesTable.id, id));

		return { message: "Vínculo instrutor-disciplina atualizado com sucesso" };
	}

	async deleteInstructorDiscipline(id: number) {
		const existingInstructorDiscipline = await db
			.select()
			.from(instructorDisciplinesTable)
			.where(eq(instructorDisciplinesTable.id, id));

		if (existingInstructorDiscipline.length === 0) {
			throw new NotFoundError("Vínculo instrutor-disciplina não encontrado");
		}

		await db
			.delete(instructorDisciplinesTable)
			.where(eq(instructorDisciplinesTable.id, id));

		return { message: "Vínculo instrutor-disciplina excluído com sucesso" };
	}
}
