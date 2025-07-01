import type { RequestHandler } from "express";
import {
    createAchievmentSchema,
    updateAchievmentSchema,
    listAchievmentSchema,
} from "../schemas/achievments.schemas";
import { AchievmentsService } from "../services/achievments-service";
import { getPaginationParams } from "../utils/pagination";

const achievmentsService = new AchievmentsService();

export const listAchievments: RequestHandler = async (req, res, next) => {
    try {
        const filtersData = listAchievmentSchema.parse(req.query);
        const { page_size, page, offset } = getPaginationParams(req.query);
        const { items, count } = await achievmentsService.listAchievments(filtersData, {
            limit: page_size,
            offset,
        });
        res.status(200).json({ page_size, page, count, items });
    } catch (error) {
        next(error);
    }
};

export const getAchievmentById: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const achievment = await achievmentsService.getAchievmentById(Number(id));
        res.status(200).json(achievment);
    } catch (error) {
        next(error);
    }
};

export const createAchievment: RequestHandler = async (req, res, next) => {
    try {
        const validatedData = createAchievmentSchema.parse(req.body);
        const result = await achievmentsService.createAchievment(validatedData);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateAchievment: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const validatedData = updateAchievmentSchema.parse(req.body);
        const result = await achievmentsService.updateAchievment(
            Number(id),
            validatedData,
        );
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteAchievment: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await achievmentsService.deleteAchievment(Number(id));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}; 