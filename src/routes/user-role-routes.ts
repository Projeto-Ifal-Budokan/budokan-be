import { Router } from "express";
import {
	assignRole,
	listUserRoles,
	removeRole,
} from "../controllers/user-role-controller";
import { isOwnerOrHasPrivilege } from "../middlewares/auth/check-owner-or-admin.middleware";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = Router();
router.post("/assign", hasPrivilege("update_user_roles"), assignRole);
router.post("/remove", hasPrivilege("update_user_roles"), removeRole);
router.get(
	"/:id",
	hasPrivilege("view_user_roles"),
	isOwnerOrHasPrivilege(),
	listUserRoles,
);

export default router;
