import express from "express";
import {
	createRank,
	deleteRank,
	getRankById,
	listRanks,
	updateRank,
} from "../controllers/rank-controller";
import { hasPrivilege } from "../middlewares/auth/check-privilege.middleware";

const router = express.Router();

// Protected routes
router.get("/", hasPrivilege("list_ranks"), listRanks);
router.get("/:id", hasPrivilege("view_rank"), getRankById);
router.post("/", hasPrivilege("create_rank"), createRank);
router.put("/:id", hasPrivilege("update_rank"), updateRank);
router.delete("/:id", hasPrivilege("delete_rank"), deleteRank);

export default router;
