interface Todo {
	id: number;
	title: string;
	description: string;
	createdAt: string;
	status: string;
}
enum Status {
	TODO = "Сделать",
	IN_PROGRESS = "Выполняется",
	DONE = "Выполнено",
}

interface TodoState {
	todo: Todo[];
	isLoading: boolean;
	error: string | null;
	getTodos: () => Promise<void>;
	deleteTodo: (id: number) => Promise<void>;
	updateTodo: (
		id: number,
		title: string,
		description: string,
		status: Status
	) => Promise<void>;
	createTodo: (
		title: string,
		description: string,
		status: Status
	) => Promise<void>;
}
export type { TodoState, Todo };
