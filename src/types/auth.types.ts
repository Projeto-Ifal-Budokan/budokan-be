import type { Request } from "express";

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
