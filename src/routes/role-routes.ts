import express from "express";
import {
	createRole,
	deleteRole,
	getRoleById,
	listRoles,
	updateRole,
} from "../controllers/role-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = express.Router();

// Protected routes with privilege checks
router.get("/", hasPrivilege("list_roles"), listRoles);
router.get("/:id", hasPrivilege("view_role"), getRoleById);
router.post("/", hasPrivilege("create_role"), createRole);
router.put("/:id", hasPrivilege("update_role"), updateRole);
router.delete("/:id", hasPrivilege("delete_role"), deleteRole);

export default router;
