import express from "express";
import {
	createSession,
	deleteSession,
	listSessions,
	updateSession,
} from "../controllers/session-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = express.Router();

// Protected routes
router.get("/", hasPrivilege("list_sessions"), listSessions);
router.post("/", hasPrivilege("create_session"), createSession);
router.put("/:id", hasPrivilege("update_session"), updateSession);
router.delete("/:id", hasPrivilege("delete_session"), deleteSession);

export default router;
