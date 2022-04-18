export interface Token {
	refresh?: string;
	access?: string;
	expires_at?: number;
}

export interface User {
	id: string;
	email?: string;
	username: string;
	website?: string;
	avatar_url?: string;
	password?: string;
	tokens?: Token;
	fullname?: string;
	birthdate?: string;
}

