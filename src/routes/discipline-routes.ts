import express from "express";
import {
	createDiscipline,
	getDisciplineById,
	listDisciplines,
	updateDiscipline,
} from "../controllers/discipline-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = express.Router();

// Protected routes
router.get("/", hasPrivilege("list_disciplines"), listDisciplines);
router.get("/:id", hasPrivilege("view_discipline"), getDisciplineById);
router.post("/", hasPrivilege("create_discipline"), createDiscipline);
router.put("/:id", hasPrivilege("update_discipline"), updateDiscipline);

export default router;
