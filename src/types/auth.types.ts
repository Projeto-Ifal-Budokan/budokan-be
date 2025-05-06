import type { Request } from "express";

export interface User {
	id: number;
	email: string;
	name: string;
	status: string;
}

export interface AuthenticatedRequest extends Request {
	user?: User;
}
