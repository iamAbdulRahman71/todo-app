# To Do List Application

This project is a full-stack To Do List Application built using Node.js, Express, MongoDB, and React with React-Bootstrap. It supports JWT-based authentication and provides RESTful endpoints for managing todo lists and their items. The frontend is styled with a modern, professional design using custom CSS.

## Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Backend Configuration](#backend-configuration)
  - [Frontend Configuration](#frontend-configuration)
- [Running the Application](#running-the-application)
  - [Starting the Backend Server](#starting-the-backend-server)
  - [Starting the Frontend Server](#starting-the-frontend-server)
- [Testing](#testing)
  - [Backend Tests](#backend-tests)
  - [Frontend Tests](#frontend-tests)
- [Project Structure](#project-structure)
- [Additional Information](#additional-information)

## Project Overview

The To Do List Application allows users to:
- Login to the application.
- Create and manage individual todo lists.
- Add, edit, and delete todo list items.
- Enjoy a responsive, modern UI styled with React-Bootstrap and custom CSS.

The backend is built with Node.js, Express, and MongoDB (using Mongoose), and the frontend uses React. JWT-based authentication is implemented to secure REST endpoints.

## Prerequisites

Before starting the project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) (for local development) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud-based instances
- [Git](https://git-scm.com/)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/my-todo-app.git
   cd my-todo-app
   ```


2. **Install backend dependencies:**

   ```bash
   cd backend
   npm install
   ```
   
3. **Install frontend dependencies:**

   ```bash
   cd ../frontend
   npm install
   ```
    
## Configuration

### Backend Configuration

1. **Create a .env file in the backend folder:**

   ```env
   MONGO_URI=mongodb://localhost:27017/todoapp
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```
   
   - MONGO_URI: MongoDB connection string. Change this if you're using MongoDB Atlas.
   - JWT_SECRET: A secret key for JWT authentication.
   - PORT: The port on which the backend server will run (default is 5000).


2. **User Setup:**

   Since there is no registration flow, you need to manually add a user to your MongoDB database. Use a MongoDB client (such as MongoDB Compass) or the MongoDB shell. Important: Make sure to hash the password using bcrypt before inserting it into the database.

### Frontend Configuration

1. **Create a .env File in the Frontend Folder:**

   ```env
    REACT_APP_API_URL=http://localhost:5000/api
   ```
   
   - REACT_APP_API_URL: The base URL for your backend API endpoints.

2. **Custom Styles:**

   The project includes a custom CSS file (src/custom.css) that imports a Google Font and overrides some default React-Bootstrap styles to provide a modern, professional look.


## Running the Application

### Starting the Backend Server

1. **Open a terminal and navigate to the backend folder:**

   ```bash
      cd my-todo-app/backend
   ```

2. **Run the backend server:**

   ```bash
      node app.js
   ```
   
   Alternatively, for auto-reloading during development, use:
   
   ```bash
      npx nodemon app.js
   ```
   
   The backend server will run on the port specified in your .env file (default is 5000).
   
   
### Starting the Frontend Server


1. **Open a separate terminal and navigate to the frontend folder:**

   ```bash
      cd my-todo-app/frontend
   ```

2. **Start the React development server:**

   ```bash
      npm start
   ```
   
   The application will typically open in your browser at http://localhost:3000.
   
## Testing

### Backend Tests

Backend tests are written using Jest and Supertest.


1. **Navigate to the backend folder:**

   ```bash
      cd my-todo-app/backend
   ```

2. **Run tests:**

   ```bash
      npm test
   ```
   

### Frontend Tests

Frontend tests are written using Jest and React Testing Library (included with Create React App).


1. **Navigate to the frontend folder:**

   ```bash
      cd my-todo-app/frontend
   ```

2. **Run tests:**

   ```bash
      npm test
   ```