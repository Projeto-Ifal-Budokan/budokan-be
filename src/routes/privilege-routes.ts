import { Router } from "express";
import {
	createPrivilege,
	deletePrivilege,
	listPrivileges,
	updatePrivilege,
} from "../controllers/privilege-controller";
import { isOwnerOrHasPrivileges } from "../middlewares/auth/check-owner-or-privileges.middleware";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = Router();
router.get("/", hasPrivilege("list_privileges"), listPrivileges);
router.get(
	"/user/:id",
	// hasPrivilege("list_privileges"), // desabilitado pois o sistema precisa sempre ter acesso aos privilegios do usuario logado
	isOwnerOrHasPrivileges(),
	listPrivileges,
);
router.post("/", hasPrivilege("create_privilege"), createPrivilege);
router.put("/:id", hasPrivilege("update_privilege"), updatePrivilege);
router.delete("/:id", hasPrivilege("delete_privilege"), deletePrivilege);

export default router;
