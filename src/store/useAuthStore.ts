import { create } from "zustand";
import axios from "axios";
import { AuthState } from "../types/auth";

const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	accessToken: null,
	refreshToken: null,
	isLoading: false,
	error: null,
	isAuthenticated: false,

	register: async (username, email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(
				"http://localhost:8000/api/users/register",
				{ email, password, username }
			);
			const { accessToken, refreshToken, user } = response.data;
			set({
				accessToken,
				refreshToken,
				user,
				isAuthenticated: true,
				isLoading: false,
			});
			localStorage.setItem("accessToken", accessToken);
			localStorage.setItem("refreshToken", refreshToken);
			set({ isLoading: false });
		} catch (error) {
			let errorMessage = "Registration failed";
			if (axios.isAxiosError(error)) {
				errorMessage = error.response?.data?.error || error.message;
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw new Error(errorMessage);
		}
	},

	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(
				"http://localhost:8000/api/users/login",
				{ email, password }
			);
			const { accessToken, refreshToken, user } = response.data;
			set({
				accessToken,
				refreshToken,
				user,
				isAuthenticated: true,
				isLoading: false,
			});
			localStorage.setItem("accessToken", accessToken);
			localStorage.setItem("refreshToken", refreshToken);
		} catch (error) {
			let errorMessage = "Login failed";
			if (axios.isAxiosError(error)) {
				errorMessage = error.response?.data?.error || error.message;
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw new Error(errorMessage);
		}
	},

	logout: () => {
		set({
			user: null,
			accessToken: null,
			refreshToken: null,
			isAuthenticated: false,
		});
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
	},

	refreshTokens: async () => {
		const refreshToken =
			get().refreshToken || localStorage.getItem("refreshToken");
		if (!refreshToken) {
			throw new Error("No refresh token available");
		}
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(
				"http://localhost:8000/api/users/refresh",
				{ refreshToken }
			);
			const { accessToken } = response.data;
			set({ accessToken, isLoading: false });
			localStorage.setItem("accessToken", accessToken);
			return accessToken;
		} catch (error) {
			let errorMessage = "Token refresh failed";
			if (axios.isAxiosError(error)) {
				errorMessage = error.response?.data?.error || error.message;
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw new Error(errorMessage);
		}
	},

	fetchUserData: async () => {
		const accessToken =
			get().accessToken || localStorage.getItem("accessToken");
		if (!accessToken) {
			throw new Error("No access token available");
		}
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(
				"http://localhost:8000/api/users/current",
				{
					headers: { Authorization: `Bearer ${accessToken}` },
				}
			);
			set({ user: response.data, isAuthenticated: true, isLoading: false });
		} catch (error) {
			let errorMessage = "Failed to fetch user data";
			if (axios.isAxiosError(error)) {
				errorMessage = error.response?.data?.error || error.message;
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}
			set({ error: errorMessage, isLoading: false });
			throw new Error(errorMessage);
		}
	},

	initializeAuth: async () => {
		const accessToken = localStorage.getItem("accessToken");
		const refreshToken = localStorage.getItem("refreshToken");

		if (accessToken && refreshToken) {
			set({ accessToken, refreshToken, isAuthenticated: true });
			try {
				await get().fetchUserData();
			} catch (error) {
				try {
					const newAccessToken = await get().refreshTokens();
					set({ accessToken: newAccessToken, isAuthenticated: true });
					await get().fetchUserData();
					console.log(error);
				} catch (refreshError) {
					set({
						user: null,
						accessToken: null,
						refreshToken: null,
						isAuthenticated: false,
					});
					localStorage.removeItem("accessToken");
					localStorage.removeItem("refreshToken");
					console.log(refreshError);
				}
			}
		}
	},
}));

export default useAuthStore;
