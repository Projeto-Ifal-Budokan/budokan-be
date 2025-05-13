import express from "express";
import {
	deleteUser,
	getUserById,
	listUsers,
	updateUser,
} from "../controllers/user-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = express.Router();

// Protected routes
router.get("/", hasPrivilege("list_users"), listUsers);
router.get("/:id", hasPrivilege("view_user"), getUserById);
router.put("/:id", hasPrivilege("update_user"), updateUser);
router.delete("/:id", hasPrivilege("delete_user"), deleteUser);

export default router;
