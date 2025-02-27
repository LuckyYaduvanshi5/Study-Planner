import React from 'react';
import { Table, Form, Button, Badge, Spinner } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';

const TaskList = () => {
  const { user } = useAuth();
  const { tasks, loading, error, toggleTaskCompletion, deleteTask } = useTasks(user);

  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">Error loading tasks: {error}</div>;
  }

  if (tasks.length === 0) {
    return <div className="text-center my-4">You don't have any tasks yet. Add one above!</div>;
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get badge color based on due date and completion status
  const getBadgeVariant = (dueDate, completed) => {
    if (completed) return 'success';
    
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    
    // Due date is today
    if (due.getTime() === today.getTime()) return 'warning';
    
    // Due date has passed
    if (due < today) return 'danger';
    
    // Due date is in the future
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    // Due in next 3 days
    return due <= threeDaysFromNow ? 'primary' : 'info';
  };

  return (
    <div className="my-4">
      <h3>Your Tasks</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Status</th>
            <th>Task</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className={task.completed ? 'table-success' : ''}>
              <td className="text-center align-middle" style={{ width: '60px' }}>
                <Form.Check
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id, task.completed)}
                  aria-label={`Mark ${task.task_name} as ${task.completed ? 'incomplete' : 'complete'}`}
                />
              </td>
              <td className="align-middle">
                {task.completed ? (
                  <span style={{ textDecoration: 'line-through' }}>{task.task_name}</span>
                ) : (
                  task.task_name
                )}
              </td>
              <td className="align-middle" style={{ width: '150px' }}>
                <Badge bg={getBadgeVariant(task.due_date, task.completed)}>
                  {formatDate(task.due_date)}
                </Badge>
              </td>
              <td className="text-center align-middle" style={{ width: '100px' }}>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TaskList;
