import express from "express";
import {
    createPixKey,
    deletePixKey,
    getPixKeyById,
    getPixKeyByIdInstructor,
    listPixKeys,
    updatePixKey,
} from "../controllers/pix-key-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = express.Router();

// Protected routes
router.get("/", hasPrivilege("list_pix_keys"), listPixKeys);
router.get("/:id", hasPrivilege("view_pix_key"), getPixKeyById);
router.get("/instructor/:id", hasPrivilege("view_pix_key"), getPixKeyByIdInstructor);
router.post("/", hasPrivilege("create_pix_key"), createPixKey);
router.put("/:id", hasPrivilege("update_pix_key"), updatePixKey);
router.delete(
    "/:id",
    hasPrivilege("delete_pix_key"),
    deletePixKey,
);

export default router;
