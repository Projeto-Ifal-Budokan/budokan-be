import { Router } from "express";
import {
	assignRole,
	listUserRoles,
	removeRole,
} from "../controllers/user-role-controller";
import { isOwnerOrHasPrivileges } from "../middlewares/auth/check-owner-or-privileges.middleware";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = Router();
router.post("/assign", hasPrivilege("update_user_roles"), assignRole);
router.post("/remove", hasPrivilege("update_user_roles"), removeRole);
router.get(
	"/:id",
	hasPrivilege("view_user_roles"),
	isOwnerOrHasPrivileges(),
	listUserRoles,
);

export default router;
