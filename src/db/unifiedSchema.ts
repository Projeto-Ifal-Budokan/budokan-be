import { relations, sql } from "drizzle-orm";
import {
	bigint,
	datetime,
	mysqlEnum,
	mysqlTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";

// Users table
export const usersTable = mysqlTable("tb_users", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	firstName: varchar("first_name", { length: 100 }).notNull(),
	surname: varchar("surname", { length: 100 }).notNull(),
	phone: varchar("phone", { length: 20 }),
	birthDate: datetime("birth_date"),
	email: varchar("email", { length: 150 }).notNull().unique(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	role: varchar("role", { length: 20 }).notNull(), // 'student', 'instructor', 'admin'
	status: mysqlEnum("status", ["active", "inactive", "suspended"])
		.notNull()
		.default("inactive"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

// Practitioners table
export const practitionersTable = mysqlTable("tb_practitioners", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	idUser: bigint("id_user", { mode: "number", unsigned: true }).references(
		() => usersTable.id,
	),
	healthObservations: varchar("health_observations", { length: 255 }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const practitionersRelations = relations(
	practitionersTable,
	({ one, many }) => ({
		user: one(usersTable, {
			fields: [practitionersTable.idUser],
			references: [usersTable.id],
		}),
		practitionerContacts: many(practitionerContactsTable),
	}),
);

// Practitioner Contacts table
export const practitionerContactsTable = mysqlTable(
	"tb_practitioner_contacts",
	{
		id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
		idPractitioner: bigint("id_practitioner", {
			mode: "number",
			unsigned: true,
		}).references(() => practitionersTable.id),
		phone: varchar("phone", { length: 20 }),
		relationship: varchar("relationship", { length: 100 }).notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
	},
);

export const practitionerContactsRelations = relations(
	practitionerContactsTable,
	({ one }) => ({
		user: one(practitionersTable, {
			fields: [practitionerContactsTable.idPractitioner],
			references: [practitionersTable.id],
		}),
	}),
);

// Students table
export const studentsTable = mysqlTable("tb_students", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	idPractitioner: bigint("id_practitioner", { mode: "number", unsigned: true })
		.notNull()
		.references(() => practitionersTable.id),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const studentsRelations = relations(studentsTable, ({ one, many }) => ({
	user: one(practitionersTable, {
		fields: [studentsTable.idPractitioner],
		references: [practitionersTable.id],
	}),
	matriculation: many(matriculationsTable),
}));

// Instructors table
export const instructorsTable = mysqlTable("tb_instructors", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	idPractitioner: bigint("id_practitioner", { mode: "number", unsigned: true })
		.notNull()
		.references(() => practitionersTable.id),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const instructorsRelations = relations(
	instructorsTable,
	({ one, many }) => ({
		user: one(practitionersTable, {
			fields: [instructorsTable.idPractitioner],
			references: [practitionersTable.id],
		}),
		pixKeys: many(pixKeysTable),
	}),
);

// Pix Keys table
export const pixKeysTable = mysqlTable("tb_pix_keys", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	idInstructor: bigint("id_instructor", { mode: "number", unsigned: true })
		.notNull()
		.references(() => instructorsTable.id),
	type: mysqlEnum("type", ["email", "cpf", "phone", "randomKey"]).notNull(),
	description: varchar("description", { length: 100 }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const pixKeysRelations = relations(pixKeysTable, ({ one }) => ({
	user: one(instructorsTable, {
		fields: [pixKeysTable.idInstructor],
		references: [instructorsTable.id],
	}),
}));

// Disciplines table
export const disciplinesTable = mysqlTable("tb_disciplines", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
	description: varchar("description", { length: 100 }).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const disciplinesRelations = relations(disciplinesTable, ({ many }) => ({
	instructors: many(instructorDisciplinesTable),
	matriculations: many(matriculationsTable),
}));

// Instructor Disciplines table
export const instructorDisciplinesTable = mysqlTable(
	"tb_instructor_disciplines",
	{
		id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
		idInstructor: bigint("id_instructor", {
			mode: "number",
			unsigned: true,
		}).references(() => instructorsTable.id),
		idDiscipline: bigint("id_discipline", {
			mode: "number",
			unsigned: true,
		}).references(() => disciplinesTable.id),
		status: mysqlEnum("status", ["active", "inactive", "suspended"])
			.notNull()
			.default("active"),
		activatedBy: bigint("activated_by", { mode: "number", unsigned: true })
			.references(() => usersTable.id)
			.default(sql`null`),
		inactivatedBy: bigint("inactivated_by", { mode: "number", unsigned: true })
			.references(() => usersTable.id)
			.default(sql`null`),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
	},
);

export const instructorDisciplinesRelations = relations(
	instructorDisciplinesTable,
	({ one }) => ({
		instructor: one(instructorsTable, {
			fields: [instructorDisciplinesTable.idInstructor],
			references: [instructorsTable.id],
		}),
		discipline: one(disciplinesTable, {
			fields: [instructorDisciplinesTable.idDiscipline],
			references: [disciplinesTable.id],
		}),
		activatedByUser: one(usersTable, {
			fields: [instructorDisciplinesTable.activatedBy],
			references: [usersTable.id],
		}),
		inactivatedByUser: one(usersTable, {
			fields: [instructorDisciplinesTable.inactivatedBy],
			references: [usersTable.id],
		}),
	}),
);

// Ranks table
export const ranksTable = mysqlTable("tb_ranks", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	idDiscipline: bigint("id_discipline", {
		mode: "number",
		unsigned: true,
	}).references(() => disciplinesTable.id),
	name: varchar("name", { length: 100 }).notNull(),
	description: varchar("description", { length: 100 }).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const rankRelations = relations(ranksTable, ({ one }) => ({
	user: one(disciplinesTable, {
		fields: [ranksTable.idDiscipline],
		references: [disciplinesTable.id],
	}),
}));

// Matriculations table
export const matriculationsTable = mysqlTable("tb_matriculations", {
	id: bigint("id", { mode: "number", unsigned: true }).primaryKey(),
	idStudent: bigint("id_student", {
		mode: "number",
		unsigned: true,
	}).references(() => studentsTable.id),
	idDiscipline: bigint("id_discipline", {
		mode: "number",
		unsigned: true,
	}).references(() => disciplinesTable.id),
	status: mysqlEnum("status", ["active", "inactive", "suspended"])
		.notNull()
		.default("active"),
	activatedBy: bigint("activated_by", { mode: "number", unsigned: true })
		.references(() => usersTable.id)
		.default(sql`null`),
	inactivatedBy: bigint("inactivated_by", { mode: "number", unsigned: true })
		.references(() => usersTable.id)
		.default(sql`null`),
	isPaymentExempt: varchar("is_payment_exempt", { length: 1 })
		.notNull()
		.default(sql`N`), // Y = yes, N = no
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const matriculationsRelations = relations(
	matriculationsTable,
	({ one }) => ({
		student: one(studentsTable, {
			fields: [matriculationsTable.idStudent],
			references: [studentsTable.id],
		}),
		discipline: one(disciplinesTable, {
			fields: [matriculationsTable.idDiscipline],
			references: [disciplinesTable.id],
		}),
		activatedByUser: one(usersTable, {
			fields: [matriculationsTable.activatedBy],
			references: [usersTable.id],
		}),
		inactivatedByUser: one(usersTable, {
			fields: [matriculationsTable.inactivatedBy],
			references: [usersTable.id],
		}),
	}),
);
