interface User {
	username: string;
	email: string;
	role: "user" | "admin";
}

interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	isLoading: boolean;
	error: string | null;
	isAuthenticated: boolean;
	register: (
		username: string,
		email: string,
		password: string
	) => Promise<void>;
	login: (emailOrUsername: string, password: string) => Promise<void>;
	logout: () => void;
	refreshTokens: () => Promise<string>;
	fetchUserData: () => Promise<void>;
	initializeAuth: () => Promise<void>;
}
export type { AuthState, User };
