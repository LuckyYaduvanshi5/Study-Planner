import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import ProgressBar from '../components/ProgressBar';
import TaskSummary from '../components/TaskSummary';

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, loading, error } = useTasks(user);
  
  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Get tasks due today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueTodayTasks = tasks.filter(task => {
    const dueDate = new Date(task.due_date);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime() && !task.completed;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold gradient-heading">
          Study Planner Dashboard
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          {user?.email ? (
            <>
              Hello, <span className="font-medium bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">{user.email}</span>! Here's your study progress at a glance.
            </>
          ) : (
            'Hello! Here\'s your study progress at a glance.'
          )}
        </p>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded shadow">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Total Tasks Card */}
        <div className="dashboard-card bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200">
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-3 shadow-md">
              <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Total Tasks</h2>
            <p className="text-4xl font-extrabold text-gray-700 mb-2">
              {loading ? '...' : totalTasks}
            </p>
            <div className="mt-1">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                All Tasks
              </span>
            </div>
          </div>
        </div>

        {/* Completed Tasks Card */}
        <div className="dashboard-card bg-gradient-to-br from-green-400 to-green-600 text-white">
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white mb-3 shadow-md">
              <svg className="w-8 h-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-1">Completed</h2>
            <p className="text-4xl font-extrabold mb-2">
              {loading ? '...' : completedTasks}
            </p>
            <div className="mt-1">
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-medium text-green-700 border border-green-100">
                Finished Tasks
              </span>
            </div>
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div className="dashboard-card bg-gradient-to-br from-yellow-300 to-yellow-500 text-gray-900">
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white mb-3 shadow-md">
              <svg className="w-8 h-8 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-1">Pending</h2>
            <p className="text-4xl font-extrabold mb-2">
              {loading ? '...' : pendingTasks}
            </p>
            <div className="mt-1">
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-medium text-yellow-700 border border-yellow-100">
                In Progress
              </span>
            </div>
          </div>
        </div>

        {/* Completion Rate Card */}
        <div className="dashboard-card bg-gradient-to-br from-cyan-400 to-blue-500 text-white">
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white mb-3 shadow-md">
              <svg className="w-8 h-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-1">Completion Rate</h2>
            <p className="text-4xl font-extrabold mb-2">
              {loading ? '...' : `${completionRate}%`}
            </p>
            <div className="mt-1">
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-medium text-blue-700 border border-blue-100">
                Success Rate
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-white shadow-lg overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Task Progress</h3>
          </div>
          <div className="p-6">
            <ProgressBar tasks={tasks} loading={loading} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Due Today Tasks */}
        <div className="bg-white shadow-lg overflow-hidden rounded-lg mb-6 lg:mb-0">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Tasks Due Today</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-600">Loading tasks...</span>
              </div>
            ) : dueTodayTasks.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {dueTodayTasks.map(task => (
                  <li key={task.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{task.task_name}</p>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Due Today
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">All caught up!</h3>
                <p className="mt-1 text-gray-600">No tasks due today! 🎉</p>
              </div>
            )}
          </div>
        </div>

        {/* Task Summary */}
        <div className="bg-white shadow-lg overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Task Summary</h3>
          </div>
          <div className="p-6">
            <TaskSummary tasks={tasks} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
