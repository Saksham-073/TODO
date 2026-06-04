import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "../redux/todoSlice";
import { selectAuth } from "../redux/authSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Plus, AlertCircle, X, Loader2 } from "lucide-react";

const TaskInput = () => {
  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [location, setLocation] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [category, setCategory] = useState("Personal");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(selectAuth);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskText.trim() || !isAuthenticated) {
      setError("Task text is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newTask = {
        text: taskText.trim(),
        priority,
        location: location.trim(),
        dueDate: dueDate ? dueDate.toISOString() : null,
        category,
      };

      // addTask creates the task on the server and fetches its weather.
      await dispatch(addTask(newTask)).unwrap();

      setTaskText("");
      setLocation("");
      setDueDate(null);
    } catch (err) {
      setError(err.message || "Failed to add task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="card-organic overflow-hidden animate-fade-in-up">
      <div className="p-6 sm:p-7">
        <div className="flex items-center mb-5">
          <div className="p-2.5 bg-clay-soft rounded-2xl mr-3">
            <Plus className="h-5 w-5 text-clay" strokeWidth={2.4} />
          </div>
          <h3 className="font-display text-2xl font-semibold text-ink">Add a task</h3>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-clay-soft/70 rounded-xl flex justify-between items-center">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-clay-dark mr-2 flex-shrink-0" />
              <span className="text-clay-dark text-sm">{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-clay-dark/70 hover:text-clay-dark"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="taskText" className="block text-sm font-medium text-ink mb-1.5">
              What needs doing? <span className="text-clay">*</span>
            </label>
            <input
              id="taskText"
              type="text"
              className="field-organic"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="e.g., Water the plants"
              maxLength="200"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-ink mb-1.5">
                Priority
              </label>
              <select
                id="priority"
                className="field-organic"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="High">🔥 High</option>
                <option value="Medium">🔄 Medium</option>
                <option value="Low">🌱 Low</option>
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-ink mb-1.5">
                Category
              </label>
              <select
                id="category"
                className="field-organic"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Personal">👤 Personal</option>
                <option value="Work">💼 Work</option>
                <option value="Shopping">🛒 Shopping</option>
                <option value="Health">🏥 Health</option>
                <option value="Other">✨ Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-ink mb-1.5">
                Location <span className="text-muted font-normal">(for weather)</span>
              </label>
              <input
                id="location"
                type="text"
                className="field-organic"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., New York"
              />
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-ink mb-1.5">
                Due date
              </label>
              <DatePicker
                id="dueDate"
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                minDate={new Date()}
                className="field-organic"
                placeholderText="Select a date"
                dateFormat="MMMM d, yyyy"
                isClearable
              />
            </div>
          </div>

          <button type="submit" className="btn-clay w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Adding…
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Add task
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskInput;
