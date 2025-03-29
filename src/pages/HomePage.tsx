import React, { useEffect } from "react";
import useTodoStore from "../store/useTodoStore";
import Task from "../components/Task";
import CreateTask from "../components/CreateTask";

function HomePage() {
	const { getTodos, todo, isLoading, error } = useTodoStore();
	useEffect(() => {
		getTodos();
	}, []);
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
			<div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
				<h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
					TODOS
				</h1>
				<CreateTask />
				{isLoading ? (
					<p>Loading...</p>
				) : (
					<div>
						{todo.map((task) => (
							<Task task={task} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default HomePage;
