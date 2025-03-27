import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, toggleTaskComplete } from '../redux/todoSlice';
import { format, parseISO, isBefore } from 'date-fns';

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, weatherData, loading, error } = useSelector((state) => state.todos);


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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-6 space-y-3">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-100 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600 font-medium">Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <div className="text-red-800">
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-blue-800">
              <p>No tasks found. Add a new task above.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-lg shadow-sm border-l-4 ${task.completed ? 'border-gray-200 opacity-75' :
                  task.priority === 'High' ? 'border-red-500' :
                    task.priority === 'Medium' ? 'border-yellow-500' :
                      'border-green-500'} transition-all duration-200 hover:shadow-md`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start space-x-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleTaskComplete(task.id)}
                          id={`task-${task.id}`}
                          className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`task-${task.id}`}
                          className={`ml-3 block ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                        >
                          <div className="flex items-center">
                            <span className="mr-2">{getCategoryIcon(task.category)}</span>
                            <span>{task.text}</span>
                          </div>
                        </label>
                      </div>

                      <div className="ml-7 mt-2 space-y-1">
                        {task.location && weatherData[task.location] && (
                          <div className="flex items-center text-sm text-gray-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                              />
                            </svg>
                            <span className="font-medium">{task.location}:</span>
                            <span className="ml-1">{weatherData[task.location].temp}°F,</span>
                            <span className="ml-1">{weatherData[task.location].condition}</span>
                          </div>
                        )}

                        {task.dueDate && (
                          <div className={`flex items-center text-sm ${isTaskOverdue(task.dueDate) && !task.completed ? 'text-red-600' : 'text-gray-500'}`}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>Due: {format(parseISO(task.dueDate), 'MMM d, yyyy')}</span>
                            {isTaskOverdue(task.dueDate) && !task.completed && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                Overdue
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <button
                        onClick={() => dispatch(deleteTask(task.id))}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200"
                        title="Delete task"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${task.priority === 'High' ? 'bg-red-100 text-red-800' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                        }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;