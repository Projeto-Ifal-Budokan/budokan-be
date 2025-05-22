import { Router } from "express";
import passport from "passport";
import {
	forgotPassword,
	login,
	me,
	register,
	resetPassword,
} from "../controllers/auth-controller";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", passport.authenticate("jwt", { session: false }), me);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
