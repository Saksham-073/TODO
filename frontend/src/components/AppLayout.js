import React, { useEffect } from 'react';
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import { fetchTasks } from '../redux/todoSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Sun, Leaf } from 'lucide-react';
import Auth from './Auth';

const AppLayout = () => {
    const dispatch = useDispatch();
    const { error } = useSelector((state) => state.todos);
    const { error: authError, isAuthenticated } = useSelector((state) => state.auth);

    // Restore a saved session (token + user) on first load.
    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (storedUser && token) {
        dispatch(loginSuccess(JSON.parse(storedUser)));
      }
    }, [dispatch]);

    // Load tasks from the API whenever the user becomes authenticated.
    useEffect(() => {
      if (isAuthenticated) {
        dispatch(fetchTasks());
      }
    }, [isAuthenticated, dispatch]);

    useEffect(() => {
      if (error) {
        toast.error(error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }, [error]);
  
    useEffect(() => {
      if (authError) {
        toast.error(authError, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }, [authError]);
  
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 w-full px-4 py-10 sm:py-14">
          <div className="max-w-2xl mx-auto">

            <header className="text-center mb-10 animate-fade-in-up">
              <div className="inline-flex items-center justify-center mb-5">
                <div className="relative">
                  <div className="p-4 bg-clay-soft rounded-3xl shadow-[0_18px_40px_-20px_rgba(184,95,56,0.55)] animate-float-soft">
                    <Sun className="h-8 w-8 text-clay" strokeWidth={2.2} />
                  </div>
                  <span className="absolute -bottom-2 -right-2 p-1.5 bg-sage-soft rounded-full border border-paper">
                    <Leaf className="h-4 w-4 text-sage-dark" strokeWidth={2.2} />
                  </span>
                </div>
              </div>
              <h1 className="font-display text-5xl sm:text-6xl font-semibold text-ink mb-3">
                TaskMaster
              </h1>
              <p className="text-base text-muted max-w-md mx-auto leading-relaxed">
                A calmer way to plan your day — tasks, priorities, and a peek at the weather.
              </p>
            </header>

            <div className="space-y-6">
              <Auth />

              {isAuthenticated && (
                <>
                  <TaskInput />
                  <TaskList />
                </>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-12 py-7 border-t border-line">
          <div className="px-4 text-center">
            <p className="text-sm text-muted">
              Made with care · © {new Date().getFullYear()} TaskMaster Pro
            </p>
          </div>
        </footer>

        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastClassName="!rounded-2xl !bg-paper !text-ink !shadow-lg !border !border-line"
          progressClassName="!bg-clay"
        />
      </div>
    )
  }

export default AppLayout