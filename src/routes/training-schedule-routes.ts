import express from "express";
import passport from "passport";
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
router.get("/", listTrainingSchedules);
router.get("/:id", getTrainingScheduleById);
router.get("/discipline/:id", getTrainingSchedulesByDiscipline);
router.post(
	"/",
	passport.authenticate("jwt", { session: false }),
	hasPrivilege("create_training_schedule"),
	createTrainingSchedule,
);
router.put(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	hasPrivilege("update_training_schedule"),
	updateTrainingSchedule,
);
router.delete(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	hasPrivilege("delete_training_schedule"),
	deleteTrainingSchedule,
);

export default router;
