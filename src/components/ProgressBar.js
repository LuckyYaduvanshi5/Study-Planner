import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProgressBar = ({ tasks, loading }) => {
  // Calculate completion percentage
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Determine progress bar color based on completion percentage
  const getBarColor = (percent) => {
    if (percent >= 75) return 'rgba(16, 185, 129, 0.8)'; // green-500
    if (percent >= 50) return 'rgba(14, 165, 233, 0.8)'; // sky-500
    if (percent >= 25) return 'rgba(234, 179, 8, 0.8)';  // yellow-500
    return 'rgba(239, 68, 68, 0.8)'; // red-500
  };

  // Chart data
  const data = {
    labels: ['Task Completion'],
    datasets: [
      {
        label: 'Completed',
        data: [percentage],
        backgroundColor: getBarColor(percentage),
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      },
      {
        label: 'Remaining',
        data: [100 - percentage],
        backgroundColor: 'rgba(209, 213, 219, 0.3)', // gray-300
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      }
    ]
  };

  // Chart options
  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
        max: 100,
        grid: {
          display: false
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
      y: {
        stacked: true,
        display: false
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}%`;
          }
        }
      },
      legend: {
        display: true,
        position: 'bottom'
      },
      title: {
        display: false
      }
    },
    maintainAspectRatio: false,
  };

  // Generate motivational message based on completion percentage
  const getMotivationalMessage = (percent) => {
    if (percent === 100) return "Amazing job! All tasks completed! 🎉";
    if (percent >= 75) return "Great progress! Keep it up! 👍";
    if (percent >= 50) return "Halfway there! You're doing well! 💪";
    if (percent >= 25) return "Good start! Keep working on those tasks! ✨";
    if (percent > 0) return "You've made a start! Keep going! 🌱";
    if (totalTasks === 0) return "Add some tasks to get started! ✅";
    return "Time to start working on your tasks! 📝";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
        <p className="mt-4 text-gray-500">Loading progress data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Chart */}
      <div className="h-32 mb-6">
        <Bar data={data} options={options} />
      </div>
      
      {/* Progress indicator and message */}
      <div className="flex flex-col items-center">
        <div className="mb-4">
          <div className={`
            inline-flex items-center justify-center h-16 w-16 rounded-full text-lg font-bold
            ${percentage >= 75 ? 'bg-green-100 text-green-800' : 
              percentage >= 50 ? 'bg-sky-100 text-sky-800' : 
              percentage >= 25 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'}
          `}>
            {percentage}%
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">
            {completedTasks} of {totalTasks} tasks completed
          </p>
          <p className={`text-base font-medium 
            ${percentage === 100 ? 'text-green-600' : 
             percentage >= 50 ? 'text-blue-600' : 
             percentage > 0 ? 'text-yellow-600' : 
             'text-gray-600'}`}>
            {getMotivationalMessage(percentage)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
