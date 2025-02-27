import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './hooks/useAuth';

// Debug logging
console.log('Starting application...');
console.log('Checking for root element...');

// Make sure the root element exists in index.html
const rootElement = document.getElementById('root');
console.log('Root element found:', rootElement);

if (!rootElement) {
  console.error('Root element not found! Creating one...');
  const rootDiv = document.createElement('div');
  rootDiv.id = 'root';
  document.body.appendChild(rootDiv);
}

try {
  console.log('Creating React root...');
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  console.log('Rendering App component...');
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
  console.log('Render call completed.');
} catch (error) {
  console.error('Error rendering React application:', error);
  
  // Display error on page for debugging
  document.body.innerHTML = `
    <div style="color: red; margin: 20px;">
      <h1>Something went wrong</h1>
      <p>${error.message}</p>
      <pre>${error.stack}</pre>
    </div>
  `;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
