import React from 'react';
import { Container } from 'react-bootstrap';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const Tasks = () => {
  return (
    <Container className="py-4">
      <h1 className="mb-4">Task Management</h1>
      <TaskForm />
      <TaskList />
    </Container>
  );
};

export default Tasks;
