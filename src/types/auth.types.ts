import type { Request } from "express";

export interface Role {
	id: number;
	name: string;
	description: string;
}

export interface Privilege {
	id: number;
	name: string;
	description: string;
}

export interface User {
	id: number;
	email: string;
	firstName: string;
	surname: string;
	status: string;
	phone: string;
	birthDate: Date;
	profileImageUrl?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface AuthenticatedRequest extends Request {
	user?: User;
}
