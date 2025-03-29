import React, { useState } from "react";
import useTodoStore from "../store/useTodoStore";

enum Status {
	TODO = "Сделать",
	IN_PROGRESS = "Выполняется",
	DONE = "Выполнено",
}

function Task({ task }) {
	const { deleteTodo, updateTodo } = useTodoStore();
	const [isEditing, setIsEditing] = useState(false);
	const [editedTitle, setEditedTitle] = useState(task.title);
	const [editedDescription, setEditedDescription] = useState(task.description);
	const [editedStatus, setEditedStatus] = useState<Status>(task.status);

	const handleDelete = (e) => {
		e.preventDefault();
		deleteTodo(task.id);
	};

	const handleEdit = (e) => {
		e.preventDefault();
		setIsEditing(true);
	};

	const handleCancel = (e) => {
		e.preventDefault();
		setIsEditing(false);
		setEditedTitle(task.title);
		setEditedDescription(task.description);
		setEditedStatus(task.status);
	};

	const handleSave = async (e) => {
		e.preventDefault();
		await updateTodo(task.id, editedTitle, editedDescription, editedStatus);
		setIsEditing(false);
	};

	return (
		<li
			key={task.id}
			className="bg-white list-none rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow relative"
		>
			{!isEditing ? (
				<>
					<h3 className="text-xl font-semibold overflow-hidden text-gray-800 mb-2">
						{task.title}
					</h3>
					<p className="text-gray-600 overflow-hidden mb-4">
						{task.description}
					</p>

					<div className="flex items-center mb-3">
						<span
							className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
								task.status === Status.TODO
									? "bg-gray-100 text-gray-800"
									: task.status === Status.IN_PROGRESS
									? "bg-blue-100 text-blue-800"
									: "bg-green-100 text-green-800"
							}`}
						>
							{task.status}
						</span>
					</div>

					<div className="flex justify-between items-center text-sm text-gray-500 mb-4">
						<small>
							Создано: {new Date(task.createdAt).toLocaleString("ru-RU")}
						</small>
						<small>
							Обновлено: {new Date(task.updatedAt).toLocaleString("ru-RU")}
						</small>
					</div>

					<div className="flex justify-end space-x-2">
						<button
							onClick={handleEdit}
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
						>
							Редактировать
						</button>
						<button
							onClick={handleDelete}
							className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
						>
							Удалить
						</button>
					</div>
				</>
			) : (
				<>
					<div className="mb-4">
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Название
						</label>
						<input
							type="text"
							id="title"
							value={editedTitle}
							onChange={(e) => setEditedTitle(e.target.value)}
							className="w-full p-2 border border-gray-300 rounded-md"
						/>
					</div>

					<div className="mb-4">
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Описание
						</label>
						<textarea
							id="description"
							value={editedDescription}
							onChange={(e) => setEditedDescription(e.target.value)}
							className="w-full p-2 border border-gray-300 rounded-md"
							rows={3}
						/>
					</div>

					<div className="mb-4">
						<label
							htmlFor="status"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Статус
						</label>
						<select
							id="status"
							value={editedStatus}
							onChange={(e) => setEditedStatus(e.target.value as Status)}
							className="w-full p-2 border border-gray-300 rounded-md"
						>
							{Object.values(Status).map((statusValue) => (
								<option key={statusValue} value={statusValue}>
									{statusValue}
								</option>
							))}
						</select>
					</div>

					<div className="flex justify-end space-x-2">
						<button
							onClick={handleCancel}
							className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
						>
							Отменить
						</button>
						<button
							onClick={handleSave}
							className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
						>
							Применить
						</button>
					</div>
				</>
			)}
		</li>
	);
}

export default Task;
