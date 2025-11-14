# HomeServo

A comprehensive home services platform that connects homeowners with skilled service providers (taskers) for various home maintenance and improvement needs.

## 📋 Overview

HomeServo is a full-stack web application that facilitates booking and managing home services such as cleaning, repairs, assembly, painting, moving, and outdoor help. The platform features role-based access for users, taskers, and administrators, providing a seamless experience for all stakeholders.

## ✨ Features

### For Users
- Browse and search available home services
- Book services from verified taskers
- View and manage bookings
- Profile management
- Service history tracking

### For Taskers
- Register as a service provider
- Manage service offerings
- Accept/decline booking requests
- Track earnings and job history
- Profile and availability management

### For Administrators
- Dashboard with analytics and insights
- User management
- Tasker approval workflow
- Service management
- Booking oversight

## 🛠️ Tech Stack

### Frontend
- **React** 18.3.1 - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Recharts** - Data visualization
- **Font Awesome** - Icons

### Backend
- **Node.js** with **Express** - Server framework
- **MongoDB** with **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
HomeServo/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── Components/   # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React Context (Auth, etc.)
│   │   ├── middleware/   # Route guards and utilities
│   │   └── utils/        # API utilities
│   └── public/           # Static assets and service data
│
├── backend/              # Express backend API
│   ├── config/          # Configuration files (DB, Cloudinary)
│   ├── controllers/     # Route controllers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── middleware/      # Authentication & authorization
│
└── package.json         # Root package configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HomeServo
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

   Or install individually:
   ```bash
   # Root dependencies
   npm install

   # Frontend dependencies
   cd frontend
   npm install

   # Backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the `backend` directory:
   ```env
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string

   # Server
   PORT=5001

   # JWT
   JWT_SECRET=your_jwt_secret_key

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   Create a `.env` file in the `frontend` directory (if needed):
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

### Running the Application

#### Development Mode

**Run both frontend and backend:**
```bash
# From root directory
npm run start:backend
# In a new terminal
npm run start:frontend
```

**Or run separately:**
```bash
# Backend (from backend directory)
cd backend
npm run dev

# Frontend (from frontend directory)
cd frontend
npm run dev
```

#### Production Mode

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Start the backend:**
   ```bash
   npm start
   ```

The backend will run on `http://localhost:5001` and the frontend on `http://localhost:5173` (Vite default).

## 🔑 API Endpoints

### Authentication & Users
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Taskers
- `POST /api/taskers/register` - Tasker registration
- `GET /api/taskers` - Get all taskers
- `GET /api/taskers/:id` - Get tasker by ID
- `PUT /api/taskers/:id` - Update tasker profile

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (tasker only)
- `PUT /api/services/:id` - Update service

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id` - Update booking status

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Manage users
- `GET /api/admin/taskers` - Manage taskers
- `PUT /api/admin/taskers/:id/approve` - Approve/reject taskers

## 👥 User Roles

1. **User** - Can browse services, book taskers, and manage their bookings
2. **Tasker** - Can offer services, accept bookings, and manage their profile
3. **Admin** - Full platform management capabilities

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in localStorage and included in API requests via Authorization headers.

## 📦 Service Categories

- Assembly
- Cleaning
- Home Repairs
- Mounting
- Moving
- Outdoor Help
- Painting
- General Repairs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Happy Coding! 🚀**
