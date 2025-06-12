import { Router } from "express";
import {
	deleteUser,
	getUserById,
	listUsers,
	updateUser,
} from "../controllers/user-controller";
import { isOwnerOrHasPrivileges } from "../middlewares/auth/check-owner-or-privileges.middleware";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = Router();

router.get("/", hasPrivilege("list_users"), listUsers);
router.get(
	"/:id",
	hasPrivilege("view_user"),
	isOwnerOrHasPrivileges(),
	getUserById,
);
router.put(
	"/:id",
	// hasPrivilege("update_user"),
	isOwnerOrHasPrivileges(["update_user", "admin"]),
	updateUser,
);
router.delete(
	"/:id",
	hasPrivilege("delete_user"),
	isOwnerOrHasPrivileges(),
	deleteUser,
);

export default router;
