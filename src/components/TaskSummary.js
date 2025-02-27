import React from 'react';
import { Card, ProgressBar } from 'react-bootstrap';

const TaskSummary = ({ tasks, loading }) => {
  if (loading) {
    return (
      <Card>
        <Card.Header as="h5">Task Progress</Card.Header>
        <Card.Body>
          <p>Loading task data...</p>
        </Card.Body>
      </Card>
    );
  }

  // Calculate completion percentage
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Determine progress color
  let progressVariant = 'info';
  if (completionPercentage >= 75) {
    progressVariant = 'success';
  } else if (completionPercentage >= 50) {
    progressVariant = 'primary';
  } else if (completionPercentage >= 25) {
    progressVariant = 'warning';
  } else if (completionPercentage > 0) {
    progressVariant = 'danger';
  }

  return (
    <Card>
      <Card.Header as="h5">Task Progress</Card.Header>
      <Card.Body>
        {totalTasks > 0 ? (
          <>
            <ProgressBar 
              now={completionPercentage} 
              label={`${completionPercentage}%`} 
              variant={progressVariant}
              className="mb-3"
            />
            <p>
              You've completed {completedTasks} out of {totalTasks} tasks.
              {completionPercentage === 100 
                ? ' Great job! 🎉' 
                : ` Keep it up! ${totalTasks - completedTasks} tasks to go.`}
            </p>
          </>
        ) : (
          <p>No tasks added yet. Start by adding some tasks to track your progress!</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default TaskSummary;
