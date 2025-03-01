import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();
  
  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col className="text-center">
          <h1>Welcome to Study Planner</h1>
          <p className="lead">
            Organize your learning, boost productivity, and achieve your academic goals.
          </p>
          {!user && (
            <div className="mt-4">
              <Button 
                as={Link} 
                to="/signup" 
                variant="primary" 
                size="lg" 
                className="me-3"
              >
                Get Started
              </Button>
              <Button 
                as={Link} 
                to="/login" 
                variant="outline-primary" 
                size="lg"
              >
                Login
              </Button>
            </div>
          )}
        </Col>
      </Row>
      
      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i className="bi bi-check-circle-fill" style={{ fontSize: '2rem', color: '#28a745' }}></i>
              </div>
              <Card.Title>Track Tasks</Card.Title>
              <Card.Text>
                Create, organize, and complete study tasks with ease.
                Monitor your progress and stay on top of deadlines.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i className="bi bi-calendar-week" style={{ fontSize: '2rem', color: '#007bff' }}></i>
              </div>
              <Card.Title>Plan Your Schedule</Card.Title>
              <Card.Text>
                Create a personalized weekly study schedule. 
                Allocate time efficiently across different subjects.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i className="bi bi-graph-up" style={{ fontSize: '2rem', color: '#6f42c1' }}></i>
              </div>
              <Card.Title>Track Progress</Card.Title>
              <Card.Text>
                Visualize your progress with interactive charts.
                Stay motivated by seeing your accomplishments.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
