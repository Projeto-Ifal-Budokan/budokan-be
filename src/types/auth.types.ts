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
}

export interface AuthenticatedRequest extends Request {
	user?: User;
}
