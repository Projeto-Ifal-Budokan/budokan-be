import express from "express";
import {
	deleteUser,
	getUserById,
	listUsers,
	updateUser,
} from "../controllers/user-controller";

const router = express.Router();

// Protected routes
router.get("/", listUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
