import React, { useEffect } from 'react';
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from '../redux/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Auth from './Auth';

const AppLayout = () => {
    const dispatch = useDispatch();
    const { error } = useSelector((state) => state.todos);
    const { error: authError, isAuthenticated } = useSelector((state) => state.auth);
  
    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        dispatch(loginSuccess(JSON.parse(storedUser)));
      }
    }, [dispatch]);
  
    useEffect(() => {
      localStorage.removeItem('user');
      dispatch(logout());
    }, [dispatch]);
  
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
           
            <header className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="p-3 bg-indigo-600 rounded-full shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" style={{height:"25px"}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-indigo-800 mb-2">TaskMaster Pro</h1>
              <p className="text-lg text-indigo-600">
                Your ultimate task management solution with weather integration
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
        <footer className="mt-12 py-6 bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600">
              © {new Date().getFullYear()} TaskMaster Pro - Advanced React Todo App
            </p>
          </div>
        </footer>
  
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastClassName="rounded-lg shadow-md"
          progressClassName="bg-indigo-600"
        />
      </div>
    )
  }

export default AppLayout