import cookieParser from "cookie-parser";
import express, { urlencoded, json } from "express";
import passport from "../passport.ts";
import { error } from "./middlewares/error.ts";
import { notFound } from "./middlewares/not-found.ts";

import authRoutes from "./routes/auth-routes.ts";
import privilegeRoutes from "./routes/privilege-routes.ts";
import roleRoutes from "./routes/role-routes.ts";
import userRoutes from "./routes/user-routes.ts";

import cors from "cors";

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());

app.use(cookieParser());

app.use(passport.initialize());

const allowedOrigins = ["https://budokanryu.com.br", "http://localhost:3000"];

// Cors
app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Não permitido por CORS"));
			}
		},
		credentials: true,
	}),
);

/* ROUTES */

// Default route
app.get("/", (req, res) => {
	res.json({
		message: "Bem-vindo à API do Portal Budokan",
		status: "online",
		version: "1.0.0",
	});
});

app.use("/auth", authRoutes);
app.use("/users", passport.authenticate("jwt", { session: false }), userRoutes);
app.use("/roles", passport.authenticate("jwt", { session: false }), roleRoutes);
app.use(
	"/privileges",
	passport.authenticate("jwt", { session: false }),
	privilegeRoutes,
);

// Exemplo de rota protegida:
app.get(
	"/protected",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		res
			.status(200)
			.json({ message: "Você acessou uma rota protegida!", user: req.user });
	},
);

// Error handlers should be last
app.use(notFound);
app.use(error);

export default app;
