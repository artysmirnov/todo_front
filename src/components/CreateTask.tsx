import React, { useState } from "react";
import useTodoStore from "../store/useTodoStore";

enum Status {
	TODO = "Сделать",
	IN_PROGRESS = "Выполняется",
	DONE = "Выполнено",
}

function CreateTask() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState<Status>(Status.TODO);
	const { createTodo } = useTodoStore();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		createTodo(title, description, status);
		setTitle("");
		setDescription("");
		console.log({ title, description, status });
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
			<div>
				<label
					htmlFor="title"
					className="block text-sm font-medium text-gray-700"
				>
					Название задачи
				</label>
				<input
					id="title"
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
					required
				/>
			</div>

			<div>
				<label
					htmlFor="description"
					className="block text-sm font-medium text-gray-700"
				>
					Описание
				</label>
				<textarea
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
					rows={3}
				/>
			</div>

			<div>
				<label
					htmlFor="status"
					className="block text-sm font-medium text-gray-700"
				>
					Статус
				</label>
				<select
					id="status"
					value={status}
					onChange={(e) => setStatus(e.target.value as Status)}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
				>
					{Object.values(Status).map((statusValue) => (
						<option key={statusValue} value={statusValue}>
							{statusValue}
						</option>
					))}
				</select>
			</div>

			<button
				type="submit"
				className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
			>
				Создать задачу
			</button>
		</form>
	);
}

export default CreateTask;
