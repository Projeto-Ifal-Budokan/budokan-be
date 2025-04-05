// dbml.ts
import schema from "./unifiedSchema.ts";

import { mysqlGenerate } from "drizzle-dbml-generator";

const out = "./unified-schema.dbml";
const relational = true;

mysqlGenerate({ schema, out, relational });
