import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, toggleTaskComplete } from '../redux/todoSlice';
import { format, parseISO, isBefore } from 'date-fns';
import { AlertCircle, Cloud, Calendar, Trash2, ListTodo } from 'lucide-react';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Done' },
];

const SORTS = [
  { key: 'created', label: 'Newest first' },
  { key: 'priority', label: 'Priority' },
  { key: 'dueDate', label: 'Due date' },
];

const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 };

// Warm priority styling: clay (high) · ochre (medium) · sage (low)
const PRIORITY_STYLES = {
  High: { bar: 'bg-clay', badge: 'bg-clay-soft text-clay-dark' },
  Medium: { bar: 'bg-ochre', badge: 'bg-ochre-soft text-[#9a6a1e]' },
  Low: { bar: 'bg-sage', badge: 'bg-sage-soft text-sage-dark' },
};

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, weatherData, loading, error } = useSelector((state) => state.todos);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created');

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Work': return '💼';
      case 'Shopping': return '🛒';
      case 'Health': return '🏥';
      case 'Other': return '✨';
      default: return '👤';
    }
  };

  const handleTaskComplete = (taskId) => {
    dispatch(toggleTaskComplete(taskId));
  };

  const isTaskOverdue = (dueDate) => {
    if (!dueDate) return false;
    return isBefore(parseISO(dueDate), new Date());
  };

  const activeCount = useMemo(
    () => tasks.filter((t) => !t.completed).length,
    [tasks]
  );

  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'priority') {
        return (PRIORITY_RANK[a.priority] ?? 3) - (PRIORITY_RANK[b.priority] ?? 3);
      }
      if (sortBy === 'dueDate') {
        // Tasks without a due date sink to the bottom.
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return parseISO(a.dueDate) - parseISO(b.dueDate);
      }
      // Newest first by creation time (id is a timestamp fallback).
      const aTime = a.createdAt ? parseISO(a.createdAt).getTime() : a.id;
      const bTime = b.createdAt ? parseISO(b.createdAt).getTime() : b.id;
      return bTime - aTime;
    });

    return sorted;
  }, [tasks, filter, sortBy]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-sand"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-clay border-r-clay border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <p className="text-muted font-medium">Fetching the forecast…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-organic p-4 flex items-start gap-2">
        <AlertCircle className="h-5 w-5 text-clay-dark flex-shrink-0 mt-0.5" />
        <p className="text-clay-dark font-medium">{error}</p>
      </div>
    );
  }

  const emptyState = (message) => (
    <div className="card-organic px-6 py-12 text-center animate-fade-in-up">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-sage-soft flex items-center justify-center mb-4">
        <ListTodo className="h-7 w-7 text-sage-dark" strokeWidth={2} />
      </div>
      <p className="font-display text-xl text-ink mb-1">{message.title}</p>
      <p className="text-muted text-sm">{message.subtitle}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {tasks.length > 0 && (
        <div className="card-organic p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-up">
          <div className="inline-flex p-1 bg-cream rounded-2xl">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-1.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  filter === f.key
                    ? 'bg-paper text-clay shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {f.label}
                {f.key === 'active' && activeCount > 0 && (
                  <span className="ml-1.5 text-xs text-clay/70">{activeCount}</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 px-1">
            <label htmlFor="sortBy" className="text-sm text-muted">Sort</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm bg-cream border border-line rounded-xl px-3 py-1.5 text-ink focus:outline-none focus:border-clay focus:ring-2 focus:ring-clay/15 transition-all duration-200"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        emptyState({ title: 'Nothing here yet', subtitle: 'Add your first task above to get going.' })
      ) : visibleTasks.length === 0 ? (
        emptyState({ title: `No ${filter} tasks`, subtitle: 'Try a different filter.' })
      ) : (
        <div className="space-y-3">
          {visibleTasks.map((task, index) => {
            const styles = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Low;
            const overdue = isTaskOverdue(task.dueDate) && !task.completed;
            return (
              <div
                key={task.id}
                className={`card-organic overflow-hidden animate-fade-in-up ${task.completed ? 'opacity-70' : ''}`}
                style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
              >
                <div className="flex">
                  <span className={`w-1.5 flex-shrink-0 ${task.completed ? 'bg-line' : styles.bar}`} />
                  <div className="flex-1 p-4 sm:p-5">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleTaskComplete(task.id)}
                            id={`task-${task.id}`}
                            className="mt-1 h-4.5 w-4.5 accent-sage rounded cursor-pointer"
                            style={{ accentColor: '#7e9572' }}
                          />
                          <label
                            htmlFor={`task-${task.id}`}
                            className={`block cursor-pointer ${task.completed ? 'line-through text-muted' : 'text-ink'}`}
                          >
                            <span className="mr-2">{getCategoryIcon(task.category)}</span>
                            <span className="font-medium">{task.text}</span>
                          </label>
                        </div>

                        <div className="ml-7 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                          {task.location && weatherData[task.location] && (
                            <span className="inline-flex items-center text-sm text-muted">
                              <Cloud className="h-4 w-4 mr-1 text-sage-dark" />
                              <span className="font-medium text-ink/80">{task.location}</span>
                              <span className="ml-1">{weatherData[task.location].temp}°F · {weatherData[task.location].condition}</span>
                            </span>
                          )}

                          {task.dueDate && (
                            <span className={`inline-flex items-center text-sm ${overdue ? 'text-clay-dark' : 'text-muted'}`}>
                              <Calendar className="h-4 w-4 mr-1" />
                              {format(parseISO(task.dueDate), 'MMM d, yyyy')}
                              {overdue && (
                                <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-clay-soft text-clay-dark rounded-full">
                                  Overdue
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <button
                          onClick={() => dispatch(deleteTask(task.id))}
                          className="p-2 text-muted hover:text-clay-dark hover:bg-clay-soft/60 rounded-xl transition-colors duration-200"
                          title="Delete task"
                          aria-label="Delete task"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles.badge}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskList;
