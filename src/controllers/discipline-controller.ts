import type { RequestHandler } from "express";
import { ZodError } from "zod";
import { createDisciplineSchema, updateDisciplineSchema } from "../schemas/discipline.schemas";
import { DisciplineService } from "../services/discipline-service";

const disciplineService = new DisciplineService();

export const listDisciplines: RequestHandler = async (req, res) => {
    try {
        const Disciplines = await disciplineService.listDisciplines();
        res.status(200).json(Disciplines);
    } catch (error) {
        console.error("Erro ao listar disciplinas:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
};

export const getDisciplineById: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const discipline = await disciplineService.getDisciplineById(Number(id));
        res.status(200).json(discipline);
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "Disciplina não encontrada"
        ) {
            res.status(404).json({ message: error.message });
            return;
        }
        console.error("Erro ao buscar disciplina:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
};

export const createDiscipline: RequestHandler = async (req, res) => {
    try {
        const validatedData = createDisciplineSchema.parse(req.body);
        const result = await disciplineService.createDiscipline(validatedData);
        res.status(201).json(result);
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                message: "Dados inválidos",
                errors: error.errors,
            });
            return;
        }
        if (
            error instanceof Error &&
            error.message === "Já existe uma disciplina com este nome"
        ) {
            res.status(409).json({ message: error.message });
            return;
        }
        console.error("Erro ao criar disciplina:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
};

export const updateDiscipline: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = updateDisciplineSchema.parse(req.body);
        const result = await disciplineService.updateDiscipline(Number(id), validatedData);
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                message: "Dados inválidos",
                errors: error.errors,
            });
            return;
        }
        if (error instanceof Error) {
            if (error.message === "Disciplina não encontrada") {
                res.status(404).json({ message: error.message });
                return;
            }
            if (error.message === "Já existe uma disciplina com este nome") {
                res.status(409).json({ message: error.message });
                return;
            }
        }
        console.error("Erro ao atualizar disciplina:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
};
