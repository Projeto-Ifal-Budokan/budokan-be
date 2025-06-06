import express from "express";
import {
	createTrainingSchedule,
	deleteTrainingSchedule,
	getTrainingScheduleById,
	getTrainingSchedulesByDiscipline,
	listTrainingSchedules,
	updateTrainingSchedule,
} from "../controllers/training-schedule-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = express.Router();

// Protected routes
router.get("/", hasPrivilege("list_training_schedules"), listTrainingSchedules);
router.get(
	"/:id",
	hasPrivilege("view_training_schedule"),
	getTrainingScheduleById,
);
router.get(
	"/discipline/:id",
	hasPrivilege("view_training_schedule"),
	getTrainingSchedulesByDiscipline,
);
router.post(
	"/",
	hasPrivilege("create_training_schedule"),
	createTrainingSchedule,
);
router.put(
	"/:id",
	hasPrivilege("update_training_schedule"),
	updateTrainingSchedule,
);
router.delete(
	"/:id",
	hasPrivilege("delete_training_schedule"),
	deleteTrainingSchedule,
);

export default router;
