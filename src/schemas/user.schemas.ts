/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           minLength: 2
 *           example: "John"
 *         surname:
 *           type: string
 *           minLength: 2
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         phone:
 *           type: string
 *           example: "+55 82 99999-9999"
 *         birthDate:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *         status:
 *           type: string
 *           enum: ["active", "inactive", "suspended"]
 *           example: "active"
 */

import { z } from "zod";

export const updateUserSchema = z.object({
	firstName: z.string().min(2).optional(),
	surname: z.string().min(2).optional(),
	email: z.string().email().optional(),
	phone: z.string(),
	birthDate: z.string(),
	status: z.enum(["active", "inactive", "suspended"]).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
