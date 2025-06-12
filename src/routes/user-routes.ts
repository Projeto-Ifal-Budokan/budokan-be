import { Router } from "express";
import {
	deleteUser,
	getUserById,
	listUsers,
	updateUser,
} from "../controllers/user-controller";
import { isOwnerOrHasPrivilege } from "../middlewares/auth/check-owner-or-admin.middleware";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = Router();

router.get("/", hasPrivilege("list_users"), listUsers);
router.get(
	"/:id",
	hasPrivilege("view_user"),
	isOwnerOrHasPrivilege(),
	getUserById,
);
router.put(
	"/:id",
	// hasPrivilege("update_user"),
	isOwnerOrHasPrivilege(),
	updateUser,
);
router.delete(
	"/:id",
	hasPrivilege("delete_user"),
	isOwnerOrHasPrivilege(),
	deleteUser,
);

export default router;
