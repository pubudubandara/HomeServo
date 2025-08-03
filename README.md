# HomeServo - Task Marketplace Platform

A full-stack web application that connects service providers (taskers) with customers who need various home services.

## Project Structure

```
iwb104-code-busters/
├── frontend/          # React + Vite frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── backend/           # Node.js + Express backend API
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── controllers/
│   │   └── middleware/
│   ├── server.js
│   └── package.json
└── package.json       # Root package.json for workspace management
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd iwb104-code-busters
```

2. Install dependencies for both frontend and backend
```bash
npm run install:all
```

### Development

To run both frontend and backend simultaneously:
```bash
npm run dev
```

To run individually:
```bash
# Frontend only (runs on port 5173)
npm run dev:frontend

# Backend only (runs on port 5000)
npm run dev:backend
```

### Building for Production

```bash
npm run build
```

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT Authentication

## Features

- User authentication (customers and taskers)
- Service browsing and booking
- Task management
- User profiles
- Admin dashboard
- Responsive design
