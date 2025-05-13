import express from "express";
import {
	createPrivilege,
	deletePrivilege,
	getPrivilegeById,
	listPrivileges,
	updatePrivilege,
} from "../controllers/privilege-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = express.Router();

// Protected routes with privilege checks
router.get("/", hasPrivilege("list_privileges"), listPrivileges);
router.get("/:id", hasPrivilege("view_privilege"), getPrivilegeById);
router.post("/", hasPrivilege("create_privilege"), createPrivilege);
router.put("/:id", hasPrivilege("update_privilege"), updatePrivilege);
router.delete("/:id", hasPrivilege("delete_privilege"), deletePrivilege);

export default router;
