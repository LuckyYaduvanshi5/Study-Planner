import React from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const Tasks = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold gradient-heading">
          Task Management
        </h1>
        <p className="mt-3 text-xl text-gray-600 max-w-3xl mx-auto">
          Add, track, and complete your study tasks efficiently
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Task Form */}
        <div className="mb-6 lg:mb-0 order-2 lg:order-1">
          <TaskForm />
        </div>
        
        {/* Task List */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
