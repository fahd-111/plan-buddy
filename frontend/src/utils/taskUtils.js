
function filterAndSortTasks(tasks, priority) {
  let filtered = tasks;
  if (priority !== 'all') filtered = tasks.filter((t) => t.priority === priority);

  const sorted = filtered.slice().sort((a, b) => {
    
    if ((a.completed ? 1 : 0) !== (b.completed ? 1 : 0)) return (a.completed ? 1 : 0) - (b.completed ? 1 : 0);
    
    return a.dueDate.localeCompare(b.dueDate);
  });

  return sorted;
}

module.exports = { filterAndSortTasks };
