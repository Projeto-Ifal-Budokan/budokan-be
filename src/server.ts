import express, { urlencoded, json } from "express";
import passport from "passport";
import { error } from "./middlewares/error.ts";
import { notFound } from "./middlewares/not-found.ts";

import authRoutes from "./routes/auth-routes.ts";

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());

app.use(passport.initialize());

// ... other middlewares and routes ...

app.use(notFound);
app.use(error);

app.use("/api/auth", authRoutes);

// Exemplo de rota protegida:
app.get(
	"/api/protected",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		res.json({ message: "Você acessou uma rota protegida!", user: req.user });
	},
);

export default app;
