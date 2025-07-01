import cookieParser from "cookie-parser";
import express, { json, urlencoded } from "express";
import swaggerUi from "swagger-ui-express";
import passport from "../passport.ts";
import { errorHandler } from "./middlewares/error-handler";
import { notFound } from "./middlewares/not-found";
import swaggerSpec from "./swagger";

import routes from "./routes";

import cors from "cors";

const app = express();

/* CORS - Deve vir primeiro */
const allowedOrigins = [
	"https://budokanryu.com.br",
	"https://dev.budokanryu.com.br",
	"http://localhost:3000",
	"http://localhost:8000",
	"http://localhost:8001",
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

/* MIDDLEWARES */
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());
app.use(passport.initialize());

// Expor a pasta uploads como estática
app.use("/uploads", express.static("uploads"));

/* ROUTES */
app.use(routes);

/* SWAGGER - Apenas em desenvolvimento */
if (process.env.NODE_ENV !== "production") {
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Error handlers should be last
app.use(notFound);
// Registrando o middleware de erro
app.use(errorHandler);

export default app;
