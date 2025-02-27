import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useSchedule } from '../hooks/useSchedule';
import ScheduleTable from '../components/ScheduleTable';

const Schedule = () => {
  const { user } = useAuth();
  const { addScheduleItem } = useSchedule(user);
  const [day, setDay] = useState('Monday');
  const [subject, setSubject] = useState('');
  const [hours, setHours] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Days of the week array
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setFormError('');
    setSuccessMessage('');
    setIsLoading(true);
    
    // Validation
    if (!subject.trim()) {
      setFormError('Please enter a subject');
      setIsLoading(false);
      return;
    }
    
    if (!hours || isNaN(hours) || parseFloat(hours) <= 0) {
      setFormError('Please enter valid study hours (greater than 0)');
      setIsLoading(false);
      return;
    }

    if (parseFloat(hours) > 24) {
      setFormError('Hours cannot exceed 24 per subject');
      setIsLoading(false);
      return;
    }
    
    // Add to schedule in database
    const { error } = await addScheduleItem(day, subject.trim(), parseFloat(hours));
    
    if (error) {
      setFormError(error);
      setIsLoading(false);
      return;
    }
    
    // Success - clear form and show message
    setSubject('');
    setHours('');
    setSuccessMessage('Schedule item added successfully!');
    setIsLoading(false);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div>
      <h1 className="mb-4">Weekly Study Schedule</h1>
      
      <Row>
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Header as="h5">Add Study Time</Card.Header>
            <Card.Body>
              {formError && <Alert variant="danger">{formError}</Alert>}
              {successMessage && <Alert variant="success">{successMessage}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Day of Week</Form.Label>
                  <Form.Select 
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    disabled={isLoading}
                  >
                    {daysOfWeek.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter subject name"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={isLoading}
                    maxLength={50}
                    required
                  />
                  <Form.Text className="text-muted">
                    Example: Mathematics, Physics, History
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Study Hours</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.5"
                    placeholder="Enter study hours"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    disabled={isLoading}
                    required
                    min="0.5"
                    max="24"
                  />
                  <Form.Text className="text-muted">
                    Hours dedicated to this subject (0.5 to 24)
                  </Form.Text>
                </Form.Group>
                
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Adding...' : 'Add to Schedule'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <ScheduleTable />
        </Col>
      </Row>
    </div>
  );
};

export default Schedule;
