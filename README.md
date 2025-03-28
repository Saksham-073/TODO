# Advanced React To-Do Application with API Integration


A feature-rich todo application built with React, Redux, and integrated with a weather API. Includes user authentication, task prioritization, and responsive design.

## Features

- **User Authentication**: Login/logout functionality with protected routes
- **Task Management**: Add, view, and delete tasks with priority levels
- **Weather Integration**: Display weather information for task locations
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Persistent Storage**: Tasks and authentication state saved in localStorage
- **Redux State Management**: Advanced state handling with Redux Toolkit

## Technologies Used

- React 18
- Redux Toolkit
- React Hooks
- Tailwind CSS
- Flexbox/CSS Grid
- Mock backend with Express

## Installation
cd backend then npm i
cd.. then cd frontend then npm i
cd.. then npm i

### start 
npm start 

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### Login Credentials

Use any of the following test credentials:
	•	user1 / pass1
	•	user2 / pass2


### Authentication Flow
	1.	Enter the username & password and click Login.
	2.	The login state is stored in Redux and saved in localStorage.
	3.	On page refresh, the app automatically restores the user session.
	4.	Clicking Logout will clear the session and redirect to the login page.

