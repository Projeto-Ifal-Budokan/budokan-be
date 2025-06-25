import express from "express";
import {
	createAttendance,
	deleteAttendance,
	listAttendances,
	updateAttendance,
} from "../controllers/attendances-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = express.Router();

// Protected routes
router.get("/", hasPrivilege("list_attendances"), listAttendances);
router.post("/", hasPrivilege("create_attendance"), createAttendance);
router.put(
	"/session/:idSession",
	hasPrivilege("update_attendance"),
	updateAttendance,
);
router.delete(
	"/session/:idSession",
	hasPrivilege("delete_attendance"),
	deleteAttendance,
);

export default router;
