import React from 'react';

const TaskSummary = ({ tasks, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Loading task data...</span>
      </div>
    );
  }

  // Calculate completion percentage
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Determine progress color
  let progressColor = 'bg-blue-500';
  let strokeColor = 'stroke-blue-500';
  
  if (completionPercentage >= 75) {
    progressColor = 'bg-green-500';
    strokeColor = 'stroke-green-500';
  } else if (completionPercentage >= 50) {
    progressColor = 'bg-blue-500';
    strokeColor = 'stroke-blue-500';
  } else if (completionPercentage >= 25) {
    progressColor = 'bg-yellow-500';
    strokeColor = 'stroke-yellow-500';
  } else if (completionPercentage > 0) {
    progressColor = 'bg-red-500';
    strokeColor = 'stroke-red-500';
  }

  return (
    <div className="text-center">
      {totalTasks > 0 ? (
        <>
          <div className="flex justify-center items-center mb-6">
            <div className="relative w-32 h-32">
              {/* Background circle */}
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle 
                  cx="18" 
                  cy="18" 
                  r="16" 
                  fill="none" 
                  stroke="#e5e7eb" 
                  strokeWidth="3"
                />
                {/* Progress circle */}
                <circle 
                  cx="18" 
                  cy="18" 
                  r="16" 
                  fill="none" 
                  className={strokeColor}
                  strokeWidth="3" 
                  strokeDasharray={`${completionPercentage} 100`}
                  strokeDashoffset="25"
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
              </svg>
              {/* Percentage display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{completionPercentage}%</span>
              </div>
            </div>
          </div>

          <div className="relative pt-1 px-2 mb-6">
            <div className="overflow-hidden h-6 text-xs flex rounded-full bg-gray-200">
              <div 
                style={{ width: `${completionPercentage}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${progressColor} transition-all duration-300 ease-in-out`}
              >
                <span className="px-2 py-1 text-xs font-bold">{completionPercentage}%</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-gray-700 text-center text-lg">
              <span className="font-semibold">{completedTasks}</span> of <span className="font-semibold">{totalTasks}</span> tasks completed
            </p>
            <p className="mt-4 font-medium text-gray-800 text-lg">
              {completionPercentage === 100 
                ? 'Amazing job! You completed all tasks! 🎉' 
                : completionPercentage >= 75
                  ? 'Great progress! Almost there! 👏'
                  : completionPercentage >= 50
                    ? 'Halfway there! Keep it up! 💪'
                    : completionPercentage >= 25
                      ? 'Good start! Keep going! ✨'
                      : 'You can do it! Start completing tasks! 🚀'
              }
            </p>
          </div>
        </>
      ) : (
        <div className="py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks added yet</h3>
          <p className="mt-1 text-sm text-gray-500">Start by adding some tasks to track your progress!</p>
        </div>
      )}
    </div>
  );
};

export default TaskSummary;
