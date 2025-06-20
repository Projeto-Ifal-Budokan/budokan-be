import { Router } from "express";
import {
	create,
	deleteContact,
	getById,
	listContacts,
	update,
} from "../controllers/practitioner-contact-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = Router();

// Rota para listar contatos (com filtro opcional por practitionerId)
router.get("/", hasPrivilege("list_practitioner_contacts"), listContacts);

router.get("/:id", hasPrivilege("view_practitioner_contact"), getById);

router.post(
	"/practitioner/:id",
	hasPrivilege("create_practitioner_contact"),
	create,
);

router.put("/:id", hasPrivilege("update_practitioner_contact"), update);

router.delete(
	"/:id",
	hasPrivilege("delete_practitioner_contact"),
	deleteContact,
);

export default router;
