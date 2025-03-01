import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-white font-bold text-2xl no-underline">
                Study Planner
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {user && (
                  <>
                    <Link
                      to="/dashboard"
                      className={`text-white text-base no-underline ${
                        isActive('/dashboard') 
                          ? 'bg-blue-700' 
                          : 'hover:bg-blue-700'
                      } px-3 py-2 rounded-md font-medium`}
                    >
                      Dashboard
                    </Link>
                    
                    <Link
                      to="/tasks"
                      className={`text-white text-base no-underline ${
                        isActive('/tasks') 
                          ? 'bg-blue-700' 
                          : 'hover:bg-blue-700'
                      } px-3 py-2 rounded-md font-medium`}
                    >
                      Tasks
                    </Link>
                    
                    <Link
                      to="/schedule"
                      className={`text-white text-base no-underline ${
                        isActive('/schedule') 
                          ? 'bg-blue-700' 
                          : 'hover:bg-blue-700'
                      } px-3 py-2 rounded-md font-medium`}
                    >
                      Schedule
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-200 to-blue-100 text-blue-900 px-4 py-2 rounded-full mr-4 font-medium shadow-sm">
                    {user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-base font-medium transition-colors shadow-sm no-underline"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className={`${
                      isActive('/login') 
                        ? 'bg-blue-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white px-5 py-2 rounded-md text-base font-medium transition-colors shadow no-underline`}
                  >
                    Login
                  </Link>
                  
                  <Link
                    to="/signup"
                    className={`${
                      isActive('/signup') 
                        ? 'bg-white text-blue-700' 
                        : 'bg-white text-blue-600 hover:text-blue-700'
                    } px-5 py-2 rounded-md text-base font-medium transition-colors shadow no-underline`}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-blue-700 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-blue-700 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-800">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`block px-3 py-2 rounded-md text-base font-medium text-white no-underline ${
                    isActive('/dashboard') 
                      ? 'bg-blue-900' 
                      : 'hover:bg-blue-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                
                <Link
                  to="/tasks"
                  className={`block px-3 py-2 rounded-md text-base font-medium text-white no-underline ${
                    isActive('/tasks') 
                      ? 'bg-blue-900' 
                      : 'hover:bg-blue-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tasks
                </Link>
                
                <Link
                  to="/schedule"
                  className={`block px-3 py-2 rounded-md text-base font-medium text-white no-underline ${
                    isActive('/schedule') 
                      ? 'bg-blue-900' 
                      : 'hover:bg-blue-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Schedule
                </Link>
                
                <div className="pt-4 pb-3 border-t border-blue-900">
                  <div className="bg-blue-700 px-3 py-2 rounded-md">
                    <p className="text-sm text-white mb-2">Signed in as</p>
                    <p className="text-base font-medium text-white mb-3 break-all">{user.email}</p>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition-colors no-underline"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 p-3">
                <Link
                  to="/login"
                  className={`${
                    isActive('/login') 
                      ? 'bg-blue-900' 
                      : 'bg-blue-700'
                  } text-white text-center px-3 py-2 rounded-md text-base font-medium no-underline`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                
                <Link
                  to="/signup"
                  className="bg-white text-blue-700 text-center px-3 py-2 rounded-md text-base font-medium no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
