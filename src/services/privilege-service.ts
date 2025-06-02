import { eq } from "drizzle-orm";
import { db } from "../db";
import { privilegesTable } from "../db/schema/user-schemas/privileges";
import { ConflictError, NotFoundError } from "../errors/app-errors";
import type {
	CreatePrivilegeInput,
	UpdatePrivilegeInput,
} from "../schemas/privilege.schemas";

export class PrivilegeService {
	async listPrivileges() {
		const privileges = await db
			.select({
				id: privilegesTable.id,
				name: privilegesTable.name,
				description: privilegesTable.description,
				createdAt: privilegesTable.createdAt,
				updatedAt: privilegesTable.updatedAt,
			})
			.from(privilegesTable);

		return privileges;
	}

	async getPrivilegeById(id: number) {
		const privilege = await db
			.select({
				id: privilegesTable.id,
				name: privilegesTable.name,
				description: privilegesTable.description,
				createdAt: privilegesTable.createdAt,
				updatedAt: privilegesTable.updatedAt,
			})
			.from(privilegesTable)
			.where(eq(privilegesTable.id, id));

		if (privilege.length === 0) {
			throw new NotFoundError("Privilégio não encontrado");
		}

		return privilege[0];
	}

	async createPrivilege(data: CreatePrivilegeInput) {
		const existingPrivilege = await db
			.select()
			.from(privilegesTable)
			.where(eq(privilegesTable.name, data.name));

		if (existingPrivilege.length > 0) {
			throw new ConflictError("Já existe um privilégio com este nome");
		}

		await db.insert(privilegesTable).values(data);
		return { message: "Privilégio criado com sucesso" };
	}

	async updatePrivilege(id: number, data: UpdatePrivilegeInput) {
		const existingPrivilege = await db
			.select()
			.from(privilegesTable)
			.where(eq(privilegesTable.id, id));

		if (existingPrivilege.length === 0) {
			throw new NotFoundError("Privilégio não encontrado");
		}

		if (data.name) {
			const privilegeWithSameName = await db
				.select()
				.from(privilegesTable)
				.where(eq(privilegesTable.name, data.name));

			if (
				privilegeWithSameName.length > 0 &&
				privilegeWithSameName[0].id !== id
			) {
				throw new ConflictError("Já existe um privilégio com este nome");
			}
		}

		await db
			.update(privilegesTable)
			.set(data)
			.where(eq(privilegesTable.id, id));

		return { message: "Privilégio atualizado com sucesso" };
	}

	async deletePrivilege(id: number) {
		const existingPrivilege = await db
			.select()
			.from(privilegesTable)
			.where(eq(privilegesTable.id, id));

		if (existingPrivilege.length === 0) {
			throw new NotFoundError("Privilégio não encontrado");
		}

		await db.delete(privilegesTable).where(eq(privilegesTable.id, id));
		return { message: "Privilégio excluído com sucesso" };
	}
}
