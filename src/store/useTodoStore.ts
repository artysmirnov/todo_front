import { create } from "zustand";
import axios from "axios";
import { TodoState } from "../types/todo";

const api = "http://localhost:8000/api/";
const accessToken = localStorage.getItem("accessToken");
// Enum для удобства работы в коде
enum Status {
	TODO = "Сделать",
	IN_PROGRESS = "Выполняется",
	DONE = "Выполнено",
}

const mapStatusToServer = (status: Status): string => {
	switch (status) {
		case Status.TODO:
			return "TODO";
		case Status.IN_PROGRESS:
			return "IN_PROGRESS";
		case Status.DONE:
			return "DONE";
		default:
			return "TODO";
	}
};

const mapStatusFromServer = (status: string): Status => {
	switch (status) {
		case "TODO":
			return Status.TODO;
		case "IN_PROGRESS":
			return Status.IN_PROGRESS;
		case "DONE":
			return Status.DONE;
		default:
			return Status.TODO;
	}
};

const useTodoStore = create<TodoState>((set, get) => ({
	todo: [],
	isLoading: false,
	error: null,

	// Получение задач (преобразуем статусы из серверных в русские)
	getTodos: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.get(api + "todo", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const todosWithMappedStatus = response.data.map((todo) => ({
				...todo,
				status: mapStatusFromServer(todo.status),
			}));

			set({ todo: todosWithMappedStatus, isLoading: false });
		} catch (error) {
			set({ error: error.message, isLoading: false });
		}
	},

	// Создание задачи (преобразуем русский статус в серверный)
	createTodo: async (title, description, status: Status) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(
				api + `todo`,
				{
					title,
					description,
					status: mapStatusToServer(status), // Отправляем серверу "TODO", "IN_PROGRESS", "DONE"
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			// Преобразуем ответ сервера обратно в русский статус
			const newTodo = {
				...response.data,
				status: mapStatusFromServer(response.data.status),
			};

			set((state) => ({
				todo: [newTodo, ...state.todo],
				isLoading: false,
			}));
		} catch (error) {
			set({ error: error.message, isLoading: false });
		}
	},

	// Удаление задачи (остаётся без изменений)
	deleteTodo: async (id: number) => {
		set({ isLoading: true, error: null });
		try {
			await axios.delete(api + `todo/${id}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			set((state) => ({
				todo: state.todo.filter((item) => item.id !== id),
				isLoading: false,
			}));
		} catch (error) {
			set({ error: error.message, isLoading: false });
		}
	},

	updateTodo: async (id, title, description, status: Status) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.put(
				api + `todo/${id}`,
				{
					title,
					description,
					status: mapStatusToServer(status),
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			// Преобразуем ответ сервера обратно в русский статус
			const updatedTodo = {
				...response.data,
				status: mapStatusFromServer(response.data.status),
			};

			set((state) => ({
				todo: state.todo.map((item) => (item.id === id ? updatedTodo : item)),
				isLoading: false,
			}));
		} catch (error) {
			set({ error: error.message, isLoading: false });
		}
	},
}));

export default useTodoStore;
