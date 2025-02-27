import React from 'react';
import { Card } from 'react-bootstrap';
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
    if (percent >= 75) return 'rgba(40, 167, 69, 0.8)'; // Green for good progress
    if (percent >= 50) return 'rgba(0, 123, 255, 0.8)'; // Blue for moderate progress
    if (percent >= 25) return 'rgba(255, 193, 7, 0.8)'; // Yellow for some progress
    return 'rgba(220, 53, 69, 0.8)'; // Red for little progress
  };

  // Chart data
  const data = {
    labels: ['Task Completion'],
    datasets: [
      {
        label: 'Completed',
        data: [percentage],
        backgroundColor: getBarColor(percentage),
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
      {
        label: 'Remaining',
        data: [100 - percentage],
        backgroundColor: 'rgba(200, 200, 200, 0.3)',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      }
    ]
  };

  // Chart options
  const options = {
    indexAxis: 'y', // Horizontal bar chart
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
      y: {
        stacked: true,
        display: false // Hide y-axis labels
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

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5">Task Progress</Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center py-3">Loading progress data...</div>
        ) : (
          <>
            <div style={{ height: '120px' }} className="mb-3">
              <Bar data={data} options={options} />
            </div>
            <div className="text-center">
              <h3 className="mb-2">{percentage}% Complete</h3>
              <p className="mb-0 text-muted">
                {completedTasks} of {totalTasks} tasks completed
              </p>
              <p className="mt-2 fw-bold">
                {getMotivationalMessage(percentage)}
              </p>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProgressBar;
