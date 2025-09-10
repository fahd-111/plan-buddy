export type Priority = 'high' | 'medium' | 'low';

export type Task = {
  id: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  notes?: string;
  emoji?: string;
  completed?: boolean;
};

export type Plan = { tasks: Task[] };

export type PlanEntry = {
  id: string;
  name: string;
  tasks: Task[];
  createdAt: string;
};

export type PlansStore = PlanEntry[];