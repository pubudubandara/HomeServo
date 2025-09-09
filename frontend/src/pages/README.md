# Pages Directory

This directory contains all the main page components for the HomeServo application, organized by functionality.

## Structure

```
pages/
├── Auth/                 # Authentication related pages
│   ├── LoginPage.jsx     # User login page
│   ├── SignupPage.jsx    # Customer signup page
│   └── TaskerSignupPage.jsx # Tasker signup page
├── Home/                 # Home page
│   └── index.jsx         # Main landing page
├── Services/             # Service-related pages
│   └── index.jsx         # Services listing page
├── About/                # About page
│   └── index.jsx         # About us page
├── Booking/              # Booking related pages
│   └── index.jsx         # Booking form page
├── Profile/              # Profile related pages
│   ├── CustomerProfile.jsx    # Customer profile page
│   └── TaskerProfileForm.jsx  # Tasker profile completion form
├── Tasker/               # Tasker-specific pages
│   ├── TaskerProfile.jsx      # Tasker profile dashboard
│   ├── TaskerBookings.jsx     # Tasker bookings management
│   └── TaskerServices.jsx     # Tasker services management
├── Admin/                # Admin pages
│   └── index.jsx         # Admin dashboard
├── Test/                 # Testing pages
│   └── index.jsx         # Service API testing page
└── index.js              # Central export file for all pages
```

## Usage

Import pages from the central index file:

```javascript
import { HomePage, LoginPage, ServicesPage } from '../pages';
```

## Page Components vs Regular Components

- **Pages**: Top-level route components that represent full pages
- **Components**: Reusable UI components used within pages

Each page component should:
1. Handle routing logic
2. Compose multiple components
3. Manage page-level state
4. Handle page-specific side effects
