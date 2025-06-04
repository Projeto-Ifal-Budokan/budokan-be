import express from "express";
import {
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

// Rota principal para listar ausências diárias com filtros opcionais
// Pode ser usada sem parâmetros ou com filtros na query string
router.get("/", hasPrivilege("list_daily_absences"), listDailyAbsences);

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

// Rotas CRUD básicas
router.post("/", hasPrivilege("create_daily_absence"), createDailyAbsence);
router.get("/:id", hasPrivilege("view_daily_absence"), getDailyAbsence);
router.put("/:id", hasPrivilege("update_daily_absence"), updateDailyAbsence);
router.delete("/:id", hasPrivilege("delete_daily_absence"), deleteDailyAbsence);

export default router;
