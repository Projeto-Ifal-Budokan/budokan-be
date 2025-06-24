import { Router } from "express";
import {
	createPixKey,
	deletePixKey,
	getPixKeyById,
	listPixKeys,
	updatePixKey,
} from "../controllers/pix-key-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = Router();

router.get("/", hasPrivilege("list_pix_keys"), listPixKeys);
router.get("/:id", hasPrivilege("view_pix_key"), getPixKeyById);
router.post("/", hasPrivilege("create_pix_key"), createPixKey);
router.put("/:id", hasPrivilege("update_pix_key"), updatePixKey);
router.delete("/:id", hasPrivilege("delete_pix_key"), deletePixKey);

export default router;
