# QuikStay

QuikStay is a full-stack hotel booking application built with React, Node.js, Express, and MongoDB. It allows users to register, log in, manage their profiles, add and book places, and view their bookings.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)


## Features

- User authentication (register, login, logout)
- Profile management
- Add, edit, and delete places
- Book places
- View bookings

## Screenshots

![image](https://github.com/user-attachments/assets/913a1007-c84e-4929-a945-26ba35e58622)
![image](https://github.com/user-attachments/assets/b29b5750-c99e-4a67-8e37-f838abf5d848)
![image](https://github.com/user-attachments/assets/d5356be8-334f-4ceb-85b7-93ede176171e)
![image](https://github.com/user-attachments/assets/1f027240-f2bc-498c-8946-0e4dc88b7904)
![image](https://github.com/user-attachments/assets/b661807f-9a21-47dd-b1ed-376ce754f367)
![image](https://github.com/user-attachments/assets/d89b7a83-c66f-4c21-bb5a-7aca7b50c273)
![image](https://github.com/user-attachments/assets/4080a8d9-4d80-42a6-afb6-d05d7ea2ff86)








## Installation

### Prerequisites

- Node.js
- npm or yarn
- MongoDB

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/quikstay.git
   cd quikstay/api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to http://localhost:3000
2. Register a new account or log in with an existing account.
3. Explore the application by adding, editing, and booking places.

## API Endpoints

### Authentication
- **POST /register**: Register a new user
- **POST /login**: Log in a user
- **POST /logout**: Log out a user

### User
- **GET /profile**: Get user profile

### Places
- **GET /places**: Get all places
- **POST /places**: Add a new place
- **GET /places/:id**: Get a place by ID
- **PUT /places/:id**: Update a place by ID
- **DELETE /places/:id**: Delete a place by ID

### Bookings
- **GET /bookings**: Get all bookings
- **POST /bookings**: Create a new booking
- **GET /bookings/:id**: Get a booking by ID

## Technologies Used

- **Frontend**: React, React Router, Axios, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- **Deployment**: Vercel (Frontend), Render (Backend)

