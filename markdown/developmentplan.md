## **Development Plan**

This step-by-step plan outlines the process to build the Study Planner, optimized for use with GitHub Copilot. Each phase includes tasks and details to guide implementation.

### **Step 1: Project Setup**

* **Task**: Initialize the React app and configure Supabase.  
*   
   **Details**:

  * Create a new React app: npx create-react-app study-planner.  
  *   
     Install dependencies: npm install @supabase/supabase-js bootstrap react-bootstrap chart.js.  
  *   
     Set up Supabase in src/supabaseClient.js:

import { createClient } from '@supabase/supabase-js';

const supabaseUrl \= process.env.REACT\_APP\_SUPABASE\_URL;  
const supabaseAnonKey \= process.env.REACT\_APP\_SUPABASE\_ANON\_KEY;

export const supabase \= createClient(supabaseUrl, supabaseAnonKey);

Add environment variables (e.g., .env) with your Supabase URL and anonymous key from the Supabase dashboard.

**Step 2: Database Setup with Supabase**

* **Task**: Create tables in Supabase’s PostgreSQL database and enable security.  
*   
   **Details**:

  * In the Supabase dashboard, go to **SQL Editor** and run:

\-- Users table  
CREATE TABLE users (  
  id SERIAL PRIMARY KEY,  
  email TEXT UNIQUE NOT NULL,  
  created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
  last\_login TIMESTAMP  
);

\-- Tasks table  
CREATE TABLE tasks (  
  id SERIAL PRIMARY KEY,  
  user\_id INTEGER REFERENCES users(id),  
  task\_name TEXT NOT NULL,  
  due\_date TIMESTAMP,  
  completed BOOLEAN DEFAULT FALSE,  
  created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

\-- Schedules table  
CREATE TABLE schedules (  
  id SERIAL PRIMARY KEY,  
  user\_id INTEGER REFERENCES users(id),  
  day TEXT NOT NULL,  
  subject TEXT NOT NULL,  
  study\_hours NUMERIC NOT NULL,  
  created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

Enable **Row-Level Security (RLS)** in the Supabase dashboard under **Authentication \> Policies**:

CREATE POLICY "Users can manage their own tasks"  
ON tasks  
FOR ALL  
USING (auth.uid() \= user\_id);

CREATE POLICY "Users can manage their own schedules"  
ON schedules  
FOR ALL  
USING (auth.uid() \= user\_id);

### **Step 3: Implement Authentication**

* **Task**: Add signup and login functionality with Supabase Auth.  
*   
   **Details**:

  * Create src/pages/Signup.js and src/pages/Login.js with Bootstrap-styled forms.  
  *   
     Implement src/hooks/useAuth.js:

     javascript

import { useState, useEffect } from 'react';  
import { supabase } from '../supabaseClient';

export const useAuth \= () \=\> {  
  const \[user, setUser\] \= useState(null);

  useEffect(() \=\> {  
    const session \= supabase.auth.getSession();  
    setUser(session?.user ?? null);

    const { data: authListener } \= supabase.auth.onAuthStateChange((event, session) \=\> {  
      setUser(session?.user ?? null);  
    });

    return () \=\> authListener?.subscription.unsubscribe();  
  }, \[\]);

  const signup \= (email, password) \=\> supabase.auth.signUp({ email, password });  
  const login \= (email, password) \=\> supabase.auth.signInWithPassword({ email, password });  
  const logout \= () \=\> supabase.auth.signOut();

  return { user, signup, login, logout };  
};

### **Step 4: Build Task Management**

* **Task**: Enable users to create and view tasks.  
*   
   **Details**:

  * Create src/components/TaskForm.js to save tasks:

const handleSubmit \= async (e) \=\> {  
  e.preventDefault();  
  const { data, error } \= await supabase  
    .from('tasks')  
    .insert(\[{ user\_id: user.id, task\_name, due\_date: new Date(dueDate), completed: false }\]);  
  if (error) console.error(error);  
};

**Create src/hooks/useTasks.js to fetch tasks:**

import { useState, useEffect } from 'react';  
import { supabase } from '../supabaseClient';

export const useTasks \= (user) \=\> {  
  const \[tasks, setTasks\] \= useState(\[\]);

  useEffect(() \=\> {  
    const fetchTasks \= async () \=\> {  
      const { data, error } \= await supabase  
        .from('tasks')  
        .select('\*')  
        .eq('user\_id', user.id);  
      if (\!error) setTasks(data);  
    };  
    if (user) fetchTasks();  
  }, \[user\]);

  return { tasks, setTasks };  
};

* Build src/components/TaskList.js to display tasks.  
* 

### **Step 5: Build Schedule Feature**

* **Task**: Allow users to create and view a weekly schedule.  
*   
   **Details**:

  * Create src/components/ScheduleTable.js with a Bootstrap table for days, subjects, and hours.  
  *   
     Implement src/hooks/useSchedule.js:

     import { useState, useEffect } from 'react';  
  * import { supabase } from '../supabaseClient';  
  *   
  * export const useSchedule \= (user) \=\> {  
  *   const \[schedules, setSchedules\] \= useState(\[\]);  
  *   
  *   useEffect(() \=\> {  
  *     const fetchSchedules \= async () \=\> {  
  *       const { data, error } \= await supabase  
  *         .from('schedules')  
  *         .select('\*')  
  *         .eq('user\_id', user.id);  
  *       if (\!error) setSchedules(data);  
  *     };  
  *     if (user) fetchSchedules();  
  *   }, \[user\]);  
  *   
  *   const addSchedule \= async (day, subject, studyHours) \=\> {  
  *     const { data, error } \= await supabase  
  *       .from('schedules')  
  *       .insert(\[{ user\_id: user.id, day, subject, study\_hours: parseFloat(studyHours) }\]);  
  *     if (\!error) setSchedules(\[...schedules, data\[0\]\]);  
  *   };  
  *   
  *   return { schedules, addSchedule };  
  * };  
  *   
  *   
  * 

**Step 6: Add Progress Tracking**

* **Task**: Display task completion progress.  
*   
   **Details**:

  * Create src/components/ProgressBar.js using Chart.js:

import { Bar } from 'react-chartjs-2';

const ProgressBar \= ({ tasks }) \=\> {

  const completed \= tasks.filter(task \=\> task.completed).length;

  const total \= tasks.length;

  const percentage \= total ? (completed / total) \* 100 : 0;

  const data \= {

    labels: \['Progress'\],

    datasets: \[{ label: 'Completed', data: \[percentage\], backgroundColor: '\#28a745' }\],

  };

  return \<Bar data={data} options={{ scales: { y: { max: 100 } } }} /\>;

};

* Add to src/pages/Home.js.  
* 

### **Step 7: Testing and Deployment**

* **Task**: Test functionality and deploy the app.  
*   
   **Details**:

  * Write a Jest test for TaskForm (install npm install \--save-dev jest @testing-library/react).  
  *   
     Deploy to Heroku:

    * heroku create  
    *   
       heroku config:set REACT\_APP\_SUPABASE\_URL=\<your-url\> REACT\_APP\_SUPABASE\_ANON\_KEY=\<your-key\>  
    *   
       git push heroku main

    

