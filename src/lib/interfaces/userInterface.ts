export interface Token {
	refresh?: string;
	access?: string;
}

export interface User {
	id?: string;
	email?: string;
	username?: string;
	website?: string;
	avatar_url?: string;
	password?: string;
	tokens?: Token;
	bio?: string;
	full_name?: string;
	birth_date?: string;
}

export interface UserResponse {
	user?: User;
}