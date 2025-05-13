import { Router } from "express";
import {
	assignPrivilege,
	listRolePrivileges,
	removePrivilege,
} from "../controllers/role-privilege-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = Router();
router.post("/assign", hasPrivilege("update_role_privileges"), assignPrivilege);
router.post("/remove", hasPrivilege("update_role_privileges"), removePrivilege);
router.get("/:id", hasPrivilege("view_role_privileges"), listRolePrivileges);

export default router;
