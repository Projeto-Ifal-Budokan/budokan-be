import { Request, Response, Router } from "express";
import passport from "../../passport.ts";

import attendanceRoutes from "./attendance-routes.ts";
import authRoutes from "./auth-routes.ts";
import dailyAbsenceRoutes from "./daily-absence-routes.ts";
import disciplinesRoutes from "./discipline-routes.ts";
import instructorDisciplineRoutes from "./instructor-discipline-routes.ts";
import matriculationRoutes from "./matriculation-routes.ts";
import pixKeyRoutes from "./pix-key-routes.ts";
import practitionerContactRoutes from "./practitioner-contact.routes.ts";
import privilegeRoutes from "./privilege-routes.ts";
import rankRoutes from "./rank-routes.ts";
import rolePrivilegeRoutes from "./role-privilege-routes.ts";
import roleRoutes from "./role-routes.ts";
import sessionRoutes from "./session-routes.ts";
import trainingScheduleRoutes from "./training-schedule-routes.ts";
import userRoleRoutes from "./user-role-routes.ts";
import userRoutes from "./user-routes.ts";
import achievmentsRoutes from "./achievments-routes";

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
router.use(
	"/disciplines",
	passport.authenticate("jwt", { session: false }),
	disciplinesRoutes,
);
router.use(
	"/ranks",
	passport.authenticate("jwt", { session: false }),
	rankRoutes,
);
router.use(
	"/matriculations",
	passport.authenticate("jwt", { session: false }),
	matriculationRoutes,
);
router.use(
	"/instructor-disciplines",
	passport.authenticate("jwt", { session: false }),
	instructorDisciplineRoutes,
);
router.use("/training-schedules", trainingScheduleRoutes);
router.use(
	"/practitioner-contacts",
	passport.authenticate("jwt", { session: false }),
	practitionerContactRoutes,
);

router.use(
	"/sessions",
	passport.authenticate("jwt", { session: false }),
	sessionRoutes,
);
router.use(
	"/attendances",
	passport.authenticate("jwt", { session: false }),
	attendanceRoutes,
);
router.use(
	"/daily-absences",
	passport.authenticate("jwt", { session: false }),
	dailyAbsenceRoutes,
);
router.use(
	"/pix-keys",
	passport.authenticate("jwt", { session: false }),
	pixKeyRoutes,
);
router.use("/achievments", passport.authenticate("jwt", { session: false }), achievmentsRoutes);
export default router;
