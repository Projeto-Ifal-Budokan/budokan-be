import { Request, Response, Router } from "express";
import passport from "../../passport.ts";

import authRoutes from "./auth-routes.ts";
import privilegeRoutes from "./privilege-routes.ts";
import rolePrivilegeRoutes from "./role-privilege-routes.ts";
import roleRoutes from "./role-routes.ts";
import userRoleRoutes from "./user-role-routes.ts";
import userRoutes from "./user-routes.ts";

const router = Router();

router.use("/auth", authRoutes);
router.use(
	"/users",
	passport.authenticate("jwt", { session: false }),
	userRoutes,
);
router.use(
	"/roles",
	passport.authenticate("jwt", { session: false }),
	roleRoutes,
);
router.use(
	"/privileges",
	passport.authenticate("jwt", { session: false }),
	privilegeRoutes,
);
router.use(
	"/user-roles",
	passport.authenticate("jwt", { session: false }),
	userRoleRoutes,
);
router.use(
	"/role-privileges",
	passport.authenticate("jwt", { session: false }),
	rolePrivilegeRoutes,
);

export default router;
