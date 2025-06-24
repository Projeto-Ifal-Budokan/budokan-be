import e from "express";
import { z } from "zod";

export const updateUserSchema = z.object({
	firstName: z.string().min(2).optional(),
	surname: z.string().min(2).optional(),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	birthDate: z.string().optional(),
	status: z.enum(["active", "inactive", "suspended"]).optional(),
});

export const listUserSchema = z.object({
	firstName: z.string().min(2).optional(),
	surname: z.string().min(2).optional(),
	status: z.enum(["active", "inactive", "suspended"]).optional(),
	email: z.string().min(2).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const toggleUserStatusSchema = z.object({
	status: z.enum(["active", "inactive", "suspended"]),
});

export type ToggleUserStatusInput = z.infer<typeof toggleUserStatusSchema>;

export type ListUserInput = z.infer<typeof listUserSchema>;
