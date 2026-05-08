import { create } from 'zustand';

import { Task } from '@/types/task';

type TasksState = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
};

// Store burro: só guarda o que vem do Firestore via subscribeTasks.
// Mutações são feitas direto pelos helpers em lib/tasks-firestore.ts.
export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
}));
