// dbml.ts
import schema from "./tempSchema.ts";

import { mysqlGenerate } from "drizzle-dbml-generator"; // Using Postgres for this example

const out = "./schema.dbml";
const relational = true;

mysqlGenerate({ schema, out, relational });
