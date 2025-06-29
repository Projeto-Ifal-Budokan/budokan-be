import app from "./server.ts";
const port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log(`🚀 Server is listening at port ${port}`);
	console.log(`📚 Swagger documentation available at: http://localhost:${port}/api-docs`);
});
