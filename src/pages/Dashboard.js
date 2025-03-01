import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import ProgressBar from '../components/ProgressBar';
import TaskSummary from '../components/TaskSummary';
import { motion } from 'framer-motion';
import RadialTaskProgress from '../components/ProgressBar';
import PomodoroTimer from '../components/PomodoroTimer';

const DashboardCard = ({ title, value, color, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.03 }}
    className={`p-6 rounded-xl shadow-lg ${color} relative overflow-hidden`}
  >
    <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full opacity-20 bg-white"></div>
    <div className="relative z-10">
      <div className="flex items-center">
        {icon}
        <h3 className="text-lg font-semibold ml-2">{title}</h3>
      </div>
      <p className="text-4xl font-bold mt-4">{value}</p>
    </div>
  </motion.div>
);

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
        <DashboardCard
          title="Total Tasks"
          value={loading ? '...' : totalTasks}
          color="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />

        {/* Completed Tasks Card */}
        <DashboardCard
          title="Completed"
          value={loading ? '...' : completedTasks}
          color="bg-gradient-to-br from-green-500 to-green-600 text-white"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        {/* Pending Tasks Card */}
        <DashboardCard
          title="Pending"
          value={loading ? '...' : pendingTasks}
          color="bg-gradient-to-br from-amber-500 to-amber-600 text-white"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        {/* Completion Rate Card */}
        <DashboardCard
          title="Completion Rate"
          value={loading ? '...' : `${completionRate}%`}
          color="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>

      {/* Progress and Pomodoro Section - Changed to grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pomodoro Timer */}
        <div className="bg-white shadow-lg overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Focus Timer</h3>
            <p className="mt-1 text-sm text-gray-500">
              Stay productive with Pomodoro technique
            </p>
          </div>
          <div className="p-6">
            <PomodoroTimer />
          </div>
        </div>

        {/* Task Progress */}
        <div className="bg-white shadow-lg overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Task Progress</h3>
            <p className="mt-1 text-sm text-gray-500">
              Overall task completion status
            </p>
          </div>
          <div className="p-6">
            <RadialTaskProgress tasks={tasks} />
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
