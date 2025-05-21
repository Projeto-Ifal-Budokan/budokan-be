import cookieParser from "cookie-parser";
import express, { urlencoded, json } from "express";
import passport from "../passport.ts";
import { error } from "./middlewares/error.ts";
import { notFound } from "./middlewares/not-found.ts";

import routes from "./routes";

import cors from "cors";

const app = express();

/* MIDDLEWARES */
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());
app.use(passport.initialize());

/* CORS */
const allowedOrigins = [
	"https://budokanryu.com.br",
	"http://localhost:3000",
	"http://localhost:8000",
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

/* ROUTES */
app.use(routes);

// Error handlers should be last
app.use(notFound);
app.use(error);

export default app;
