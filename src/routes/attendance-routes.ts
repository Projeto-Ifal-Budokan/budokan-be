import express from "express";
import {
    createAttendance,
    deleteAttendance,
    deleteDailyAttendance,
    listAttendances,
    listDailyAttendances,
    listAttendancesByMatriculation,
    updateAttendance,
    justifyAttendance,
    // viewMatriculationAttendances
} from "../controllers/attendances-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = express.Router();

// Protected routes
router.get("/", hasPrivilege("list_attendances"), listAttendances);
router.get("/daily/", hasPrivilege("list_attendances"), listDailyAttendances);
router.get("/:id", hasPrivilege("list_attendances"), listAttendancesByMatriculation);
router.post("/", hasPrivilege("create_attendance"), createAttendance);
router.put("/:id", hasPrivilege("update_attendance"), updateAttendance);
router.put("/justification/:id", hasPrivilege("justify_attendance"), justifyAttendance);
router.delete("/:id", hasPrivilege("delete_attendance"), deleteAttendance);
router.delete("/daily/:id", hasPrivilege("delete_attendance"), deleteDailyAttendance);
// router.get("/matriculation/:idMatriculation", hasPrivilege("view_matriculation_sessions"), viewMatriculationAttendances);

export default router;
