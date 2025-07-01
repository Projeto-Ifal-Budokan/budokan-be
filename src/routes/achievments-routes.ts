import express from "express";
import {
    createAchievment,
    getAchievmentById,
    listAchievments,
    updateAchievment,
    deleteAchievment,
} from "../controllers/achievments-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = express.Router();

// Rotas protegidas
router.get("/", hasPrivilege("list_achievments"), listAchievments);
router.get("/:id", hasPrivilege("view_achievment"), getAchievmentById);
router.post("/", hasPrivilege("create_achievment"), createAchievment);
router.put("/:id", hasPrivilege("update_achievment"), updateAchievment);
router.delete("/:id", hasPrivilege("delete_achievment"), deleteAchievment);

export default router; 