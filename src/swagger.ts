import swaggerJSDoc from "swagger-jsdoc";

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Budokan API",
			version: "1.0.0",
			description: "Documentação da API Budokan",
		},
		servers: [
			{
				url: "http://localhost:8000", // ajuste conforme sua porta
			},
		],
	},
	apis: ["./src/routes/*.ts", "./src/controllers/*.ts", "./src/docs/*.ts"], // caminhos dos arquivos com JSDoc
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
