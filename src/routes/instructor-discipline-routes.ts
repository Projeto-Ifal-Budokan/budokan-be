import express from "express";
import {
	createInstructorDiscipline,
	deleteInstructorDiscipline,
	getInstructorDisciplineById,
	getInstructorDisciplinesByInstructor,
	listInstructorDisciplines,
	updateInstructorDiscipline,
} from "../controllers/instructor-discipline-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = express.Router();

// Protected routes
router.get(
	"/",
	hasPrivilege("list_instructor_disciplines"),
	listInstructorDisciplines,
);
router.get(
	"/:id",
	hasPrivilege("view_instructor_discipline"),
	getInstructorDisciplineById,
);
router.get(
	"/instructor/:id",
	hasPrivilege("view_instructor_discipline"),
	getInstructorDisciplinesByInstructor,
);
router.post(
	"/",
	hasPrivilege("create_instructor_discipline"),
	createInstructorDiscipline,
);
router.put(
	"/:id",
	hasPrivilege("update_instructor_discipline"),
	updateInstructorDiscipline,
);
router.delete(
	"/:id",
	hasPrivilege("delete_instructor_discipline"),
	deleteInstructorDiscipline,
);

export default router;
