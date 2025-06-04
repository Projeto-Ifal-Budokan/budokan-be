import express from "express";
import {
	createAttendance,
	deleteAttendance,
	listAttendances,
	listAttendancesByMatriculation,
	updateAttendance,
} from "../controllers/attendances-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = express.Router();

// Protected routes
router.get("/", hasPrivilege("list_attendances"), listAttendances);
router.get(
	"/matriculation/:id",
	hasPrivilege("list_attendances"),
	listAttendancesByMatriculation,
);
router.post("/", hasPrivilege("create_attendance"), createAttendance);
router.put("/:id", hasPrivilege("update_attendance"), updateAttendance);
router.delete("/:id", hasPrivilege("delete_attendance"), deleteAttendance);

export default router;
