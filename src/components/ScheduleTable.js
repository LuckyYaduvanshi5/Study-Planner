import React, { useMemo } from 'react';
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
  }, [schedules, daysOfWeek]);

  // Calculate total hours per day
  const dailyTotals = useMemo(() => {
    const totals = {};
    
    daysOfWeek.forEach(day => {
      totals[day] = scheduleByDay[day].reduce((sum, item) => sum + parseFloat(item.study_hours), 0);
    });
    
    return totals;
  }, [scheduleByDay, daysOfWeek]);

  // Calculate total hours for the week
  const weeklyTotal = useMemo(() => {
    return Object.values(dailyTotals).reduce((sum, hours) => sum + hours, 0);
  }, [dailyTotals]);

  // Render loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">Loading schedule...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-600">Error loading schedule: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (schedules.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Weekly Schedule</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Plan your study time throughout the week</p>
        </div>
        <div className="text-center py-12">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No schedule items yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding some study time slots.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Weekly Schedule</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your study timetable for the week</p>
        </div>
        <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
          {weeklyTotal} hours/week
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Day
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subjects
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hours
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {daysOfWeek.map(day => (
              <tr key={day} className={`${day === 'Saturday' || day === 'Sunday' ? 'bg-blue-50' : ''} hover:bg-gray-50`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      day === 'Saturday' || day === 'Sunday' ? 'bg-blue-100' : 'bg-blue-200'
                    }`}>
                      <span className="font-medium text-blue-800">
                        {day.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{day}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {scheduleByDay[day].length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {scheduleByDay[day].map(item => (
                        <div key={item.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-blue-100 text-blue-800">
                          {item.subject} <span className="ml-1 text-blue-600">{item.study_hours} hrs</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">No subjects scheduled</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                    dailyTotals[day] > 0 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {dailyTotals[day]} hrs
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {scheduleByDay[day].length > 0 && (
                    <div className="flex flex-col space-y-2">
                      {scheduleByDay[day].map(item => (
                        <button 
                          key={item.id}
                          onClick={() => deleteScheduleItem(item.id)}
                          className="inline-flex items-center text-xs px-2 py-1 border border-transparent rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                          <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          {item.subject}
                        </button>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <th colSpan="2" className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                Weekly Total:
              </th>
              <th className="px-6 py-3 text-center">
                <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                  {weeklyTotal} hrs
                </span>
              </th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;
