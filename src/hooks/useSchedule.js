import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export const useSchedule = (user) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch schedules function wrapped in useCallback
  const fetchSchedules = useCallback(async () => {
    if (!user) {
      setSchedules([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Query schedules table for current user's data
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('user_id', user.id)
        .order('day', { ascending: true });

      if (error) {
        throw error;
      }

      // Update state with fetched schedules
      setSchedules(data || []);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch schedules on component mount and when user changes
  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Add a new schedule item
  const addScheduleItem = async (day, subject, studyHours) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      setError(null);
      
      // Validate inputs
      if (!day) return { error: 'Day is required' };
      if (!subject || !subject.trim()) return { error: 'Subject is required' };
      if (!studyHours || studyHours <= 0) return { error: 'Study hours must be greater than 0' };
      
      // Prepare schedule data
      const newSchedule = {
        user_id: user.id,
        day,
        subject: subject.trim(),
        study_hours: parseFloat(studyHours),
        created_at: new Date().toISOString()
      };

      // Insert schedule into Supabase
      const { data, error } = await supabase
        .from('schedules')
        .insert([newSchedule])
        .select();

      if (error) {
        throw error;
      }

      // Update the local state with the new schedule
      setSchedules(prev => [...prev, data[0]]);
      return { data: data[0] };
    } catch (err) {
      console.error('Error adding schedule:', err);
      setError(err.message);
      return { error: err.message };
    }
  };

  // Update a schedule item
  const updateScheduleItem = async (scheduleId, updates) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      setError(null);
      
      // Validate schedule ID
      if (!scheduleId) return { error: 'Schedule ID is required' };
      
      // Update schedule in Supabase
      const { data, error } = await supabase
        .from('schedules')
        .update(updates)
        .eq('id', scheduleId)
        .eq('user_id', user.id)
        .select();

      if (error) {
        throw error;
      }

      // Update schedule in local state
      setSchedules(prev => 
        prev.map(schedule => (schedule.id === scheduleId ? { ...schedule, ...updates } : schedule))
      );
      
      return { data: data[0] };
    } catch (err) {
      console.error('Error updating schedule:', err);
      setError(err.message);
      return { error: err.message };
    }
  };

  // Delete a schedule item
  const deleteScheduleItem = async (scheduleId) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      setError(null);
      
      // Delete schedule from Supabase
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', scheduleId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Remove schedule from local state
      setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting schedule:', err);
      setError(err.message);
      return { error: err.message };
    }
  };

  // Get total hours by subject
  const getSubjectHours = useCallback(() => {
    const subjectHours = {};
    
    schedules.forEach(schedule => {
      const { subject, study_hours } = schedule;
      if (subjectHours[subject]) {
        subjectHours[subject] += parseFloat(study_hours);
      } else {
        subjectHours[subject] = parseFloat(study_hours);
      }
    });
    
    return subjectHours;
  }, [schedules]);

  // Get total hours for the week
  const getTotalHours = useCallback(() => {
    return schedules.reduce((total, schedule) => total + parseFloat(schedule.study_hours), 0);
  }, [schedules]);

  // Function to manually refresh schedules
  const refreshSchedules = () => {
    fetchSchedules();
  };

  return { 
    schedules,
    loading, 
    error,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    getSubjectHours,
    getTotalHours,
    refreshSchedules
  };
};
