import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSchedule } from '../hooks/useSchedule';
import ScheduleTable from '../components/ScheduleTable';

const Schedule = () => {
  const { user } = useAuth();
  const { addScheduleItem } = useSchedule(user);
  
  const [day, setDay] = useState('Monday');
  const [subject, setSubject] = useState('');
  const [hours, setHours] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Days of the week array
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);
    
    // Validation
    if (!subject.trim()) {
      setError('Please enter a subject');
      setIsSubmitting(false);
      return;
    }
    
    if (!hours || isNaN(hours) || parseFloat(hours) <= 0) {
      setError('Please enter valid study hours (greater than 0)');
      setIsSubmitting(false);
      return;
    }

    if (parseFloat(hours) > 24) {
      setError('Hours cannot exceed 24 per subject');
      setIsSubmitting(false);
      return;
    }
    
    // Add to schedule in database
    const { error } = await addScheduleItem(day, subject.trim(), parseFloat(hours));
    
    if (error) {
      setError(error);
      setIsSubmitting(false);
      return;
    }
    
    // Success - clear form and show message
    setSubject('');
    setHours('');
    setSuccessMessage('Schedule item added successfully!');
    setIsSubmitting(false);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold gradient-heading">
          Weekly Study Schedule
        </h1>
        <p className="mt-3 text-xl text-gray-600 max-w-3xl mx-auto">
          Plan your weekly study time efficiently by subject and day
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="mb-6 lg:mb-0 order-2 lg:order-1">
          <div className="bg-white overflow-hidden shadow-lg rounded-lg h-full">
            <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add Study Time</h2>
            </div>
            <div className="px-6 py-5">
              {/* Notifications */}
              {error && (
                <div className="mb-5 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {successMessage && (
                <div className="mb-5 bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-600">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-1">
                      Day of Week
                    </label>
                    <select
                      id="day"
                      name="day"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      disabled={isSubmitting}
                      className="form-select"
                    >
                      {daysOfWeek.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Enter subject name"
                      className="form-input"
                      maxLength={50}
                      required
                    />
                    <p className="mt-2 text-sm text-gray-500">Example: Mathematics, Physics, History</p>
                  </div>
                  
                  <div>
                    <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
                      Study Hours
                    </label>
                    <input
                      type="number"
                      name="hours"
                      id="hours"
                      step="0.5"
                      min="0.5"
                      max="24"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Enter study hours"
                      className="form-input"
                      required
                    />
                    <p className="mt-2 text-sm text-gray-500">Hours dedicated to this subject (0.5 to 24)</p>
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white
                      bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </>
                    ) : (
                      'Add to Schedule'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 order-1 lg:order-2">
          <ScheduleTable />
        </div>
      </div>
    </div>
  );
};

export default Schedule;
