import cookieParser from "cookie-parser";
import express, { urlencoded, json } from "express";
// import swaggerUi from "swagger-ui-express";
import passport from "../passport.ts";
// import swaggerFile from "../swagger-output.json";
import { error } from "./middlewares/error.ts";
import { notFound } from "./middlewares/not-found.ts";

import routes from "./routes";

import cors from "cors";

import swaggerDocs from "../swagger.ts";

const port = process.env.PORT || 8000;

const app = express();

/* MIDDLEWARES */
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());
app.use(passport.initialize());

/* SWAGGER */
swaggerDocs(app, Number(port));

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
