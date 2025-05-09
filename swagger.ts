import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "./package.json";

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Budokan API",
			version,
			description: "Documentação da API do sistema Budokan",
		},
		servers: [
			{
				url: "http://localhost:8000",
				description: "Servidor de Desenvolvimento",
			},
			{
				url: "https://budokanryu.com.br",
				description: "Servidor de Produção",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: ["./src/routes/*.ts", "./src/schemas/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express,  port: number) {
	app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	app.get("/docs.json", (req, res) => {
		res.setHeader("Content-Type", "application/json");
		res.send(swaggerSpec);
	});

	console.log(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
