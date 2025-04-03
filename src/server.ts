import express, { urlencoded, json } from "express";
import { notFound } from "./middlewares/not-found.ts";
import { error } from "./middlewares/error.ts";

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());

// ... other middlewares and routes ...

app.use(notFound);
app.use(error);

export default app;