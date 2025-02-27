import React, { useMemo } from 'react';
import { Table, Button, Badge, Spinner, Card } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useSchedule } from '../hooks/useSchedule';

const ScheduleTable = () => {
  const { user } = useAuth();
  const { schedules, loading, error, deleteScheduleItem } = useSchedule(user);
  
  // Days of the week in order - wrapped in useMemo to prevent recreation on each render
  const daysOfWeek = useMemo(() => 
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  []);

  // Reorganize schedules by day for easier rendering
  const scheduleByDay = useMemo(() => {
    const organized = {};
    
    // Initialize with empty arrays for each day
    daysOfWeek.forEach(day => {
      organized[day] = [];
    });
    
    // Add schedules to their respective days
    schedules.forEach(schedule => {
      if (organized[schedule.day]) {
        organized[schedule.day].push(schedule);
      }
    });
    
    return organized;
  }, [schedules, daysOfWeek]); // Added daysOfWeek dependency

  // Calculate total hours per day
  const dailyTotals = useMemo(() => {
    const totals = {};
    
    daysOfWeek.forEach(day => {
      totals[day] = scheduleByDay[day].reduce((sum, item) => sum + parseFloat(item.study_hours), 0);
    });
    
    return totals;
  }, [scheduleByDay, daysOfWeek]); // Added daysOfWeek dependency

  // Calculate total hours for the week
  const weeklyTotal = useMemo(() => {
    return Object.values(dailyTotals).reduce((sum, hours) => sum + hours, 0);
  }, [dailyTotals]);

  // Handle delete button click
  const handleDelete = async (scheduleId) => {
    await deleteScheduleItem(scheduleId);
  };

  // Render a loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading schedule...</span>
        </Spinner>
        <p>Loading schedule...</p>
      </div>
    );
  }

  // Render error message if there was a problem
  if (error) {
    return <div className="alert alert-danger">Error loading schedule: {error}</div>;
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Weekly Schedule</h5>
        <Badge bg="info">Total: {weeklyTotal} hours/week</Badge>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive className="schedule-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Subjects</th>
              <th style={{ width: '100px' }}>Hours</th>
              <th style={{ width: '100px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {daysOfWeek.map(day => (
              <tr key={day}>
                <td className="fw-bold">{day}</td>
                <td>
                  {scheduleByDay[day].length > 0 ? (
                    <ul className="list-unstyled mb-0">
                      {scheduleByDay[day].map(item => (
                        <li key={item.id} className="mb-2">
                          <Badge 
                            bg="secondary" 
                            className="me-2"
                          >
                            {item.subject}
                          </Badge>
                          <small>{item.study_hours} hours</small>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted">No subjects scheduled</span>
                  )}
                </td>
                <td className="text-center">
                  <Badge 
                    bg={dailyTotals[day] > 0 ? 'primary' : 'secondary'}
                    className="px-3 py-2"
                  >
                    {dailyTotals[day]} hrs
                  </Badge>
                </td>
                <td>
                  {scheduleByDay[day].length > 0 && (
                    <div className="d-grid gap-2">
                      {scheduleByDay[day].map(item => (
                        <Button 
                          key={item.id}
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          Remove
                        </Button>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="table-primary">
              <th colSpan="2" className="text-end">Weekly Total:</th>
              <th className="text-center">{weeklyTotal} hrs</th>
              <th></th>
            </tr>
          </tfoot>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default ScheduleTable;
