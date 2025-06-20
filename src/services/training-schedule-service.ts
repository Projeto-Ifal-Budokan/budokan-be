import { and, count, eq } from "drizzle-orm";
import { db } from "../db";
import { disciplinesTable } from "../db/schema/discipline-schemas/disciplines";
import { trainingSchedulesTable } from "../db/schema/discipline-schemas/training-schedules";
import { ConflictError, NotFoundError } from "../errors/app-errors";
import type {
	CreateTrainingScheduleInput,
	UpdateTrainingScheduleInput,
} from "../schemas/training-schedule.schemas";

export class TrainingScheduleService {
	async list(
		filters?: { idDiscipline?: number },
		pagination?: { limit: number; offset: number },
	) {
		const { limit, offset } = pagination || { limit: 10, offset: 0 };

		const where = filters?.idDiscipline
			? eq(trainingSchedulesTable.idDiscipline, filters.idDiscipline)
			: undefined;

		const [trainingSchedules, [{ count: total }]] = await Promise.all([
			db
				.select({
					id: trainingSchedulesTable.id,
					idDiscipline: trainingSchedulesTable.idDiscipline,
					disciplineName: disciplinesTable.name,
					weekday: trainingSchedulesTable.weekday,
					startTime: trainingSchedulesTable.startTime,
					endTime: trainingSchedulesTable.endTime,
					createdAt: trainingSchedulesTable.createdAt,
					updatedAt: trainingSchedulesTable.updatedAt,
				})
				.from(trainingSchedulesTable)
				.leftJoin(
					disciplinesTable,
					eq(trainingSchedulesTable.idDiscipline, disciplinesTable.id),
				)
				.where(where)
				.limit(limit)
				.offset(offset),
			db.select({ count: count() }).from(trainingSchedulesTable).where(where),
		]);

		return { items: trainingSchedules, count: Number(total) };
	}

	async getTrainingScheduleById(id: number) {
		const trainingSchedule = await db
			.select({
				id: trainingSchedulesTable.id,
				idDiscipline: trainingSchedulesTable.idDiscipline,
				disciplineName: disciplinesTable.name,
				weekday: trainingSchedulesTable.weekday,
				startTime: trainingSchedulesTable.startTime,
				endTime: trainingSchedulesTable.endTime,
				createdAt: trainingSchedulesTable.createdAt,
				updatedAt: trainingSchedulesTable.updatedAt,
			})
			.from(trainingSchedulesTable)
			.leftJoin(
				disciplinesTable,
				eq(trainingSchedulesTable.idDiscipline, disciplinesTable.id),
			)
			.where(eq(trainingSchedulesTable.id, id));

		if (trainingSchedule.length === 0) {
			throw new NotFoundError("Horário de treino não encontrado");
		}

		return trainingSchedule[0];
	}

	async createTrainingSchedule(data: CreateTrainingScheduleInput) {
		// Verificar se a disciplina existe
		const discipline = await db
			.select()
			.from(disciplinesTable)
			.where(eq(disciplinesTable.id, data.idDiscipline));

		if (discipline.length === 0) {
			throw new NotFoundError("Disciplina não encontrada");
		}

		// Verificar se o horário de início é anterior ao horário de fim
		const startTime = this.timeStringToMinutes(data.startTime);
		const endTime = this.timeStringToMinutes(data.endTime);

		if (startTime >= endTime) {
			throw new ConflictError(
				"O horário de início deve ser anterior ao horário de fim",
			);
		}

		// Buscar todos os horários existentes para a mesma disciplina e dia da semana
		const existingSchedules = await db
			.select()
			.from(trainingSchedulesTable)
			.where(
				and(
					eq(trainingSchedulesTable.idDiscipline, data.idDiscipline),
					eq(trainingSchedulesTable.weekday, data.weekday),
				),
			);

		// Verificar se há sobreposição de horários
		const hasOverlap = existingSchedules.some((schedule) => {
			const existingStartTime = this.timeStringToMinutes(schedule.startTime);
			const existingEndTime = this.timeStringToMinutes(schedule.endTime);

			// Verificar se há sobreposição
			return (
				(startTime >= existingStartTime && startTime < existingEndTime) || // Início do novo horário está dentro de um horário existente
				(endTime > existingStartTime && endTime <= existingEndTime) || // Fim do novo horário está dentro de um horário existente
				(startTime <= existingStartTime && endTime >= existingEndTime) // Novo horário engloba um horário existente
			);
		});

		if (hasOverlap) {
			throw new ConflictError(
				"Há sobreposição com outro horário de treino para esta disciplina neste dia",
			);
		}

		await db.insert(trainingSchedulesTable).values(data);
		return { message: "Horário de treino criado com sucesso" };
	}

	async updateTrainingSchedule(id: number, data: UpdateTrainingScheduleInput) {
		const existingSchedule = await db
			.select()
			.from(trainingSchedulesTable)
			.where(eq(trainingSchedulesTable.id, id));

		if (existingSchedule.length === 0) {
			throw new NotFoundError("Horário de treino não encontrado");
		}

		// Se estiver atualizando a disciplina, verificar se ela existe
		if (data.idDiscipline) {
			const discipline = await db
				.select()
				.from(disciplinesTable)
				.where(eq(disciplinesTable.id, data.idDiscipline));

			if (discipline.length === 0) {
				throw new NotFoundError("Disciplina não encontrada");
			}
		}

		// Obter os valores atualizados ou manter os existentes
		const idDiscipline =
			data.idDiscipline !== undefined
				? data.idDiscipline
				: existingSchedule[0].idDiscipline;
		const weekday =
			data.weekday !== undefined ? data.weekday : existingSchedule[0].weekday;
		const startTime =
			data.startTime !== undefined
				? data.startTime
				: existingSchedule[0].startTime;
		const endTime =
			data.endTime !== undefined ? data.endTime : existingSchedule[0].endTime;

		// Verificar se o horário de início é anterior ao horário de fim
		const updatedStartTime = this.timeStringToMinutes(startTime);
		const updatedEndTime = this.timeStringToMinutes(endTime);

		if (updatedStartTime >= updatedEndTime) {
			throw new ConflictError(
				"O horário de início deve ser anterior ao horário de fim",
			);
		}

		// Buscar todos os horários para a mesma disciplina e dia da semana, exceto o atual
		const allSchedules = await db
			.select()
			.from(trainingSchedulesTable)
			.where(and(eq(trainingSchedulesTable.weekday, weekday)));

		// Filtrar manualmente para excluir o horário atual e filtrar pela disciplina
		const otherSchedules = allSchedules.filter(
			(schedule) =>
				schedule.id !== id && schedule.idDiscipline === idDiscipline,
		);

		// Verificar se há sobreposição de horários
		const hasOverlap = otherSchedules.some((schedule) => {
			const existingStartTime = this.timeStringToMinutes(schedule.startTime);
			const existingEndTime = this.timeStringToMinutes(schedule.endTime);

			// Verificar se há sobreposição
			return (
				(updatedStartTime >= existingStartTime &&
					updatedStartTime < existingEndTime) || // Início do horário atualizado está dentro de um horário existente
				(updatedEndTime > existingStartTime &&
					updatedEndTime <= existingEndTime) || // Fim do horário atualizado está dentro de um horário existente
				(updatedStartTime <= existingStartTime &&
					updatedEndTime >= existingEndTime) // Horário atualizado engloba um horário existente
			);
		});

		if (hasOverlap) {
			throw new ConflictError(
				"Há sobreposição com outro horário de treino para esta disciplina neste dia",
			);
		}

		await db
			.update(trainingSchedulesTable)
			.set(data)
			.where(eq(trainingSchedulesTable.id, id));

		return { message: "Horário de treino atualizado com sucesso" };
	}

	// Método auxiliar para converter string de tempo (HH:MM:SS) para minutos
	private timeStringToMinutes(timeString: string): number {
		const [hours, minutes] = timeString.split(":").map(Number);
		return hours * 60 + minutes;
	}

	async deleteTrainingSchedule(id: number) {
		const existingSchedule = await db
			.select()
			.from(trainingSchedulesTable)
			.where(eq(trainingSchedulesTable.id, id));

		if (existingSchedule.length === 0) {
			throw new NotFoundError("Horário de treino não encontrado");
		}

		await db
			.delete(trainingSchedulesTable)
			.where(eq(trainingSchedulesTable.id, id));

		return { message: "Horário de treino excluído com sucesso" };
	}
}
