import { z } from "zod";

export const updateUserSchema = z.object({
	firstName: z.string().min(2).optional(),
	surname: z.string().min(2).optional(),
	email: z.string().email().optional(),
	phone: z.string(),
	birthDate: z.string(),
	status: z.enum(["active", "inactive", "suspended"]).optional(),
});
