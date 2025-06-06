import { Router } from "express";
import {
	createPrivilege,
	deletePrivilege,
	listPrivileges,
	listUserPrivileges,
	updatePrivilege,
} from "../controllers/privilege-controller";
import { isOwnerOrHasPrivilege } from "../middlewares/auth/check-owner-or-admin.middleware";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = Router();
router.get("/", hasPrivilege("list_privileges"), listPrivileges);
router.get(
	"/user/:id",
	hasPrivilege("list_privileges"),
	isOwnerOrHasPrivilege(),
	listUserPrivileges,
);
router.post("/", hasPrivilege("create_privilege"), createPrivilege);
router.put("/:id", hasPrivilege("update_privilege"), updatePrivilege);
router.delete("/:id", hasPrivilege("delete_privilege"), deletePrivilege);

export default router;
