import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export const useTasks = (user) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks function wrapped in useCallback to avoid recreating on each render
  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get tasks for current user, ordered by due date
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });

      if (error) {
        throw error;
      }

      setTasks(data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch tasks on component mount and when user changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Add a new task
  const addTask = async (taskName, dueDate) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      setError(null);
      
      // Prepare task data
      const newTask = {
        user_id: user.id,
        task_name: taskName,
        due_date: dueDate,
        completed: false,
        created_at: new Date().toISOString()
      };

      // Insert task into Supabase
      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select();

      if (error) {
        throw error;
      }

      // Update the local state with the new task
      setTasks(prev => [...prev, data[0]]);
      return { data: data[0] };
    } catch (err) {
      console.error('Error adding task:', err);
      setError(err.message);
      return { error: err.message };
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = async (taskId, currentStatus) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      setError(null);
      
      const { data, error } = await supabase
        .from('tasks')
        .update({ completed: !currentStatus })
        .eq('id', taskId)
        .eq('user_id', user.id)
        .select();

      if (error) {
        throw error;
      }

      // Update task in local state
      setTasks(prev => 
        prev.map(task => (task.id === taskId ? { ...task, completed: !currentStatus } : task))
      );
      
      return { data: data[0] };
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.message);
      return { error: err.message };
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      setError(null);
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Remove task from local state
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.message);
      return { error: err.message };
    }
  };

  // Function to manually refresh tasks
  const refreshTasks = () => {
    fetchTasks();
  };

  return { 
    tasks,
    loading, 
    error,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    refreshTasks
  };
};
