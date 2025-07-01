import app from "./server.ts";
const port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log(`🚀 Server is listening at port ${port}`);
	if (process.env.NODE_ENV !== "production") {
		console.log(`📚 Swagger documentation available at: http://localhost:${port}/api-docs`);
	} else {
		console.log(`🔒 Swagger documentation disabled in production`);
	}
});
