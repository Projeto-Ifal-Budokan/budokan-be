import { Router } from "express";
import {
	deleteUser,
	getUserById,
	listUsers,
	toggleUserStatus,
	updateUser,
	uploadProfileImageHandler,
} from "../controllers/user-controller";
import { isOwnerOrHasPrivileges } from "../middlewares/auth/check-owner-or-privileges.middleware";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";
import { uploadProfileImage } from "../utils/file-upload";

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

// New route for activating/deactivating users - admin only
router.patch("/:id/status", hasPrivilege("admin"), toggleUserStatus);

// Rota para upload de foto de perfil
router.patch(
	"/:id/profile-image",
	hasPrivilege("update_user"),
	isOwnerOrHasPrivileges(["update_user", "admin"]),
	uploadProfileImage.single("profileImage"),
	uploadProfileImageHandler,
);

export default router;
