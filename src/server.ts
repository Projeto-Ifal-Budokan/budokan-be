import cookieParser from "cookie-parser";
import express, { urlencoded, json } from "express";
import passport from "../passport.ts";
import { error } from "./middlewares/error.ts";
import { notFound } from "./middlewares/not-found.ts";

import authRoutes from "./routes/auth-routes.ts";

import cors from "cors";

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());

app.use(cookieParser());

app.use(passport.initialize());

const allowedOrigins = [
	"https://budokanryu.netlify.app",
	"http://localhost:3000",
];

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

// Default route
app.get("/", (req, res) => {
	res.json({
		message: "Bem-vindo à API do Portal Budokan",
		status: "online",
		version: "1.0.0",
	});
});

app.use("/auth", authRoutes);

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
