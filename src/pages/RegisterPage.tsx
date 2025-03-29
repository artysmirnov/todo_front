import React, { useActionState, useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
	const navigate = useNavigate();
	const { register, error } = useAuthStore();

	const auth = async (prevState, formData) => {
		const email = formData.get("email");
		const username = formData.get("username");
		const password = formData.get("password");

		try {
			await register(username, email, password);
			if (localStorage.getItem("accessToken")) {
				navigate("/");
			}
		} catch (e) {
			return { ...prevState, error };
		}
	};

	const [state, submitAction] = useActionState(auth, {
		data: null,
		error: null,
	});
	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-6 w-full p-4">
			<h1 className="text-2xl font-bold text-gray-800">Register</h1>
			<form
				className="flex flex-col gap-4 w-full max-w-md"
				action={submitAction}
			>
				<input
					className="px-4 w-full py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
					name="email"
					id="email"
					type="email"
					placeholder="Email"
				/>
				<input
					className="px-4 w-full py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
					name="username"
					id="username"
					type="text"
					placeholder="Username"
				/>
				<input
					className="px-4 w-full py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
					name="password"
					id="password"
					type="password"
					placeholder="Password"
				/>

				<button
					type="submit"
					className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 font-medium"
				>
					Register
				</button>
			</form>
			<a
				href="/login"
				className="text-blue-500 hover:text-blue-700 transition duration-200"
			>
				Already have an account? Login
			</a>
		</div>
	);
}

export default RegisterPage;
