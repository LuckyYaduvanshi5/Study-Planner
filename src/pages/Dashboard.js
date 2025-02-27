import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
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
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dueTodayTasks = tasks.filter(task => {
    const dueDate = new Date(task.due_date);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime() && !task.completed;
  });

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Welcome to Your Study Planner</h1>
          <p className="lead">
            {user?.email ? `Hello, ${user.email}!` : 'Hello!'} Here's your study progress at a glance.
          </p>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <div className="alert alert-danger">{error}</div>
          </Col>
        </Row>
      )}

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Total Tasks</Card.Title>
              <h2>{loading ? '...' : totalTasks}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 bg-success text-white">
            <Card.Body>
              <Card.Title>Completed</Card.Title>
              <h2>{loading ? '...' : completedTasks}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 bg-warning">
            <Card.Body>
              <Card.Title>Pending</Card.Title>
              <h2>{loading ? '...' : pendingTasks}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 bg-info text-white">
            <Card.Body>
              <Card.Title>Completion Rate</Card.Title>
              <h2>{loading ? '...' : `${completionRate}%`}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={12}>
          <ProgressBar tasks={tasks} loading={loading} />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header as="h5">Tasks Due Today</Card.Header>
            <Card.Body>
              {loading ? (
                <p>Loading tasks...</p>
              ) : dueTodayTasks.length > 0 ? (
                <ul className="list-group">
                  {dueTodayTasks.map(task => (
                    <li key={task.id} className="list-group-item">
                      {task.task_name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tasks due today! 🎉</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <TaskSummary tasks={tasks} loading={loading} />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
