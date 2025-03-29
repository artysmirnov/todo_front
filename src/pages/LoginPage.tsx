import React, { useActionState, useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

function LoginPage() {
	const navigate = useNavigate();
	const { login, error } = useAuthStore();

	const auth = async (prevState, formData) => {
		const email = formData.get("email");
		const password = formData.get("password");

		try {
			await login(email, password);

			if (localStorage.getItem("accessToken")) {
				navigate("/");
			}
		} catch (e) {
			return { ...prevState, error };
		}
	};
	const [state, submitAction] = useActionState(auth, {
		data: null,
	});
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
				<h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
					Login
				</h1>

				<form className="space-y-4" action={submitAction}>
					<div>
						<input
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
							name="email"
							id="email"
							type="email"
							placeholder="Email address"
							autoComplete="email"
						/>
					</div>

					<div>
						<input
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
							name="password"
							id="password"
							type="password"
							placeholder="Password"
							autoComplete="current-password"
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200"
					>
						Sign In
					</button>
				</form>

				<div className="mt-6 text-center">
					<a
						href="/register"
						className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
					>
						Don't have an account? Register now
					</a>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
