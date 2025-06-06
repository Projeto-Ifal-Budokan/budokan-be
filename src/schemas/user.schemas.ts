import { z } from "zod";

export const updateUserSchema = z.object({
	firstName: z.string().min(2).optional(),
	surname: z.string().min(2).optional(),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	birthDate: z.string().optional(),
	status: z.enum(["active", "inactive", "suspended"]).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
