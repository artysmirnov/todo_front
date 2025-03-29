export enum Status {
	TODO = "Сделать",
	IN_PROGRESS = "Выполняется",
	DONE = "Выполнено",
}

export interface TaskType {
	id: number;
	title: string;
	description: string;
	status: Status;
	createdAt: string;
	updatedAt: string;
}
