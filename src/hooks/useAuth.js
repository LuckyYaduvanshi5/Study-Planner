import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../supabaseClient';

// Create an authentication context
const AuthContext = createContext(null);

// Provider component that wraps your app and makes auth available to any child component
export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Hook for components to get the auth object and re-render when it changes
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider hook that creates the auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    // Get current session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    
    getSession();

    // Set up auth subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.email);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Sign up a new user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Object} - Data or error
   */
  const signup = async (email, password) => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
        return { error };
      }
      
      return { data };
    } catch (err) {
      setError(err.message);
      return { error: err };
    }
  };

  /**
   * Sign in a user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Object} - Data or error
   */
  const login = async (email, password) => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
        return { error };
      }
      
      return { data };
    } catch (err) {
      setError(err.message);
      return { error: err };
    }
  };

  /**
   * Sign out the current user
   * @returns {Object} - Success or error
   */
  const logout = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError(error.message);
        return { error };
      }
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { error: err };
    }
  };

  /**
   * Reset password for user
   * @param {string} email - User's email
   * @returns {Object} - Success or error
   */
  const resetPassword = async (email) => {
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      if (error) {
        setError(error.message);
        return { error };
      }
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { error: err };
    }
  };

  /**
   * Update user's password
   * @param {string} password - New password
   * @returns {Object} - Success or error
   */
  const updatePassword = async (password) => {
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        setError(error.message);
        return { error };
      }
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { error: err };
    }
  };

  return {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    resetPassword,
    updatePassword
  };
}
