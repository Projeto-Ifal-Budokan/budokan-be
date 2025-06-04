import express from "express";
import {
	countAbsenceDays,
	createDailyAbsence,
	deleteDailyAbsence,
	getDailyAbsence,
	listDailyAbsences,
	processAbsencesForDate,
	processAbsencesForDateRange,
	updateDailyAbsence,
} from "../controllers/daily-absence-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = express.Router();

// Protected routes
router.get(
	"/matriculation/:idMatriculation",
	hasPrivilege("list_daily_absences"),
	listDailyAbsences,
);
router.get("/:id", hasPrivilege("view_daily_absence"), getDailyAbsence);
router.post("/", hasPrivilege("create_daily_absence"), createDailyAbsence);
router.put("/:id", hasPrivilege("update_daily_absence"), updateDailyAbsence);
router.delete("/:id", hasPrivilege("delete_daily_absence"), deleteDailyAbsence);
router.get(
	"/count/:idMatriculation",
	hasPrivilege("count_absence_days"),
	countAbsenceDays,
);

// Rotas para processamento automático
router.post(
	"/process-date",
	hasPrivilege("process_daily_absences"),
	processAbsencesForDate,
);
router.post(
	"/process-date-range",
	hasPrivilege("process_daily_absences"),
	processAbsencesForDateRange,
);

export default router;
