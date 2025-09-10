const { filterAndSortTasks } = require('../src/utils/taskUtils');

describe('taskUtils.filterAndSortTasks', () => {
  const tasks = [
    { id: '1', title: 'A', dueDate: '2025-09-12', priority: 'high', completed: false },
    { id: '2', title: 'B', dueDate: '2025-09-10', priority: 'medium', completed: true },
    { id: '3', title: 'C', dueDate: '2025-09-11', priority: 'high', completed: false },
    { id: '4', title: 'D', dueDate: '2025-09-09', priority: 'low', completed: false },
    { id: '5', title: 'E', dueDate: '2025-09-08', priority: 'medium', completed: false },
  ];

  test('filters by priority', () => {
    const high = filterAndSortTasks(tasks, 'high');
    expect(high.length).toBe(2);
    expect(high.map(t => t.id)).toEqual(['3', '1']); // sorted by due date ascending among incompletes
  });

  test('returns all when priority=all and sorts completed last', () => {
    const all = filterAndSortTasks(tasks, 'all');
    // completed task with id '2' should appear after incompletes
    const ids = all.map(t => t.id);
    expect(ids.indexOf('2')).toBeGreaterThan(ids.indexOf('3'));
    // earliest due date among incompletes is id '5' (2025-09-08)
    expect(ids[0]).toBe('5');
  });
});
