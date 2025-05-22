import express from "express";
import {
	createMatriculation,
	deleteMatriculation,
	getMatriculationById,
	getMatriculationsByStudent,
	listMatriculations,
	updateMatriculation,
} from "../controllers/matriculation-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = express.Router();

// Protected routes
router.get("/", hasPrivilege("list_matriculations"), listMatriculations);
router.get("/:id", hasPrivilege("view_matriculation"), getMatriculationById);
router.get(
	"/student/:studentId",
	hasPrivilege("view_matriculation"),
	getMatriculationsByStudent,
);
router.post("/", hasPrivilege("create_matriculation"), createMatriculation);
router.put("/:id", hasPrivilege("update_matriculation"), updateMatriculation);
router.delete(
	"/:id",
	hasPrivilege("delete_matriculation"),
	deleteMatriculation,
);

export default router;
