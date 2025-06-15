import { Router } from "express";
import {
	create,
	deleteContact,
	getAllByPractitionerId,
	getById,
	listAllContacts,
	update,
} from "../controllers/practitioner-contact-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = Router();

// Rota para listar todos os contatos (restrito a administradores)
router.get("/", hasPrivilege("list_practitioner_contacts"), listAllContacts);

// Rotas para gerenciar contatos de emergência de um praticante
router.get(
	"/practitioner/:id",
	hasPrivilege("view_practitioner_contact"),
	getAllByPractitionerId,
);

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
