import { useState, useCallback } from 'react';
import { createPlan } from '../api/plan';
import { Task, PlanEntry } from '../types/task';

interface UsePlanResult {
  loading: boolean;
  error: string | null;
  generate: (goal: string, horizon: 'today' | 'week') => Promise<Task[]>;
  deletePlan: (planId: string) => void;
}

export default function usePlan(setPlans: React.Dispatch<React.SetStateAction<PlanEntry[]>>): UsePlanResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (goal: string, horizon: 'today' | 'week') => {
    setLoading(true);
    setError(null);
    try {
      if (!goal || goal.trim().length < 3) throw new Error('Please provide a longer goal.');

      const data = await createPlan(goal.trim(), horizon);

      // Normalize response to Task[] according to types/task.ts
      let tasksArray: Task[] | undefined;
      if (Array.isArray(data)) {
        tasksArray = data;
      } else if (data && Array.isArray((data as any).tasks)) {
        tasksArray = (data as any).tasks;
      } else if (data && Array.isArray((data as any).tasks?.tasks)) {
        tasksArray = (data as any).tasks.tasks;
      }

      if (!tasksArray) throw new Error('Unexpected plan format from server');

      const normalized: Task[] = tasksArray.map((t: any, i: number) => ({
        id: t.id ? String(t.id) : `${Date.now().toString(36)}-${i}`,
        title: String(t.title || `Task ${i + 1}`),
        dueDate: String(t.dueDate || new Date().toISOString().slice(0, 10)),
        priority: (t.priority === 'high' || t.priority === 'medium' || t.priority === 'low') ? t.priority : 'medium',
        notes: t.notes ? String(t.notes) : undefined,
        emoji: t.emoji ? String(t.emoji) : undefined,
        completed: false,
      }));

      return normalized;
    } catch (err: any) {
      const msg = err?.message || String(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePlan = useCallback((planId: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== planId));
  }, [setPlans]);

  return { loading, error, generate, deletePlan };
}
