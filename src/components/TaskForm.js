import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';

const TaskForm = () => {
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { user } = useAuth();
  const { addTask, error: taskError } = useTasks(user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    setIsLoading(true);

    // Form validation
    if (!taskName.trim()) {
      setFormError('Task name is required');
      setIsLoading(false);
      return;
    }

    if (!dueDate) {
      setFormError('Due date is required');
      setIsLoading(false);
      return;
    }

    // Check if due date is not in the past
    const selectedDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to beginning of day

    if (selectedDate < today) {
      setFormError('Due date cannot be in the past');
      setIsLoading(false);
      return;
    }

    // Add the task to Supabase
    const { error } = await addTask(taskName.trim(), new Date(dueDate).toISOString());

    if (error) {
      setFormError(error);
      setIsLoading(false);
      return;
    }

    // Success - clear form and show message
    setTaskName('');
    setDueDate('');
    setSuccessMessage('Task added successfully!');
    setIsLoading(false);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Format today's date for the min attribute of the date input
  const today = new Date().toISOString().split('T')[0];

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Add New Task</Card.Title>
        
        {(formError || taskError) && (
          <Alert variant="danger">{formError || taskError}</Alert>
        )}
        
        {successMessage && (
          <Alert variant="success">{successMessage}</Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="taskName">
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter task name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="dueDate">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              min={today}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isLoading}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Task'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default TaskForm;
