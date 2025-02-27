# Study Planner

A comprehensive web application to help students organize their study tasks and schedules.

## Features

- **User Authentication**: Secure signup and login using Supabase authentication
- **Task Management**: Create, track, and complete study tasks with due dates
- **Schedule Planning**: Plan your weekly study schedule by subject and day
- **Progress Tracking**: Visualize your task completion with interactive charts
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React.js, React Router, Bootstrap
- **Backend**: Supabase (PostgreSQL database with REST API)
- **Authentication**: Supabase Auth
- **Charts**: Chart.js with react-chartjs-2

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/LuckyYaduvanshi5/Study-Planner.git
   cd Study-Planner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file in the root directory with your Supabase credentials:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

# Start the development server:
npm start

# Database Setup
Create a Supabase account and project
Execute the SQL scripts in the /sql directory to create the necessary tables
Enable Row Level Security (RLS) policies as defined in the scripts
Project Structure

/src
  /components  - Reusable UI components
  /pages       - Main application pages
  /hooks       - Custom React hooks
  /styles      - CSS files
  /utils       - Helper functions

Screenshots
(Coming soon)

License
MIT

Acknowledgments
Supabase for the backend infrastructure
React Bootstrap for the UI components
Chart.js for data visualization
.gitignore+28-1
Instructions to push to GitHub
Now that your files are ready, follow these steps to push your project to GitHub:

Initialize Git repository (if not already done):
Stage all files:
Create initial commit:
Add GitHub repository as remote:
Push to GitHub:
Note: If your default branch is named "master" instead of "main", use:

If you encounter any authentication issues, you may need to:

Use a GitHub Personal Access Token instead of a password
Configure git to use your GitHub credentials:
Alternative: GitHub CLI
If you have the GitHub CLI (gh) installed, you can use:

Your Study Planner project should now be available on GitHub at https://github.com/LuckyYaduvanshi5/Study-Planner.git with all the necessary files and a comprehensive README to help others understand the project.

Similar code found with 1 license type - View matches


### [.gitignore](vscode-remote://codespaces/workspaces/Study-Planner/.gitignore)

Let's create a proper .gitignore file to exclude unnecessary files:

Instructions to push to GitHub
Now that your files are ready, follow these steps to push your project to GitHub:

Initialize Git repository (if not already done):
