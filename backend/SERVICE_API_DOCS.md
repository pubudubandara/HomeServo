# Service Management API Documentation

## Overview
This API manages service cards for taskers in the HomeServo platform. It includes functionality for creating, updating, managing, and admin review of service offerings.

## Base URL
```
http://localhost:5001/api/services
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Service Model Structure
```javascript
{
  _id: ObjectId,
  taskerId: ObjectId, // Reference to Tasker
  title: String, // Max 100 characters
  category: String, // Enum: Assembly, Mounting, Moving, etc.
  description: String, // Max 1000 characters
  price: String, // e.g., "$45/hour"
  image: String, // Image URL
  tags: [String], // Array of tags
  status: String, // "active" | "inactive"
  state: String, // "pending" | "approved" | "rejected"
  rating: Number, // 0-5
  jobsCompleted: Number,
  reviewedAt: Date,
  reviewNotes: String,
  reviewedBy: ObjectId, // Admin who reviewed
  createdAt: Date,
  updatedAt: Date
}
```

## Endpoints

### Tasker Service Management

#### Get Tasker Services
```
GET /tasker/:taskerId
```
**Description:** Get all services for a specific tasker  
**Authorization:** Tasker must own the profile  
**Response:**
```javascript
{
  "success": true,
  "count": 3,
  "data": [/* array of service objects */]
}
```

#### Create Service
```
POST /tasker/:taskerId
```
**Description:** Create a new service card  
**Authorization:** Tasker must own the profile  
**Body:**
```javascript
{
  "title": "Furniture Assembly Service",
  "category": "Assembly",
  "description": "Professional furniture assembly...",
  "price": "$45/hour",
  "image": "https://example.com/image.jpg",
  "tags": ["IKEA", "Furniture", "Assembly"]
}
```
**Response:**
```javascript
{
  "success": true,
  "message": "Service created successfully. Awaiting admin approval.",
  "data": {/* service object */}
}
```

#### Update Service
```
PUT /:serviceId
```
**Description:** Update an existing service  
**Authorization:** Must own the service  
**Note:** Updates reset approved services to pending state  
**Body:** Same as create service  

#### Toggle Service Status
```
PATCH /:serviceId/toggle-status
```
**Description:** Activate/deactivate a service  
**Authorization:** Must own the service  
**Note:** Only works for approved services  

#### Delete Service
```
DELETE /:serviceId
```
**Description:** Delete a service card  
**Authorization:** Must own the service  

#### Get Service Statistics
```
GET /tasker/:taskerId/stats
```
**Description:** Get service statistics for a tasker  
**Authorization:** Tasker must own the profile  
**Response:**
```javascript
{
  "success": true,
  "data": {
    "total": 5,
    "active": 3,
    "pending": 1,
    "approved": 4,
    "rejected": 0,
    "totalJobs": 25,
    "averageRating": "4.2"
  }
}
```

### Admin Service Management

#### Get All Services for Admin
```
GET /admin/all?state=pending&page=1&limit=10
```
**Description:** Get all services with optional filtering  
**Authorization:** Admin role required  
**Query Parameters:**
- `state`: Filter by state (pending, approved, rejected)
- `page`: Page number for pagination
- `limit`: Items per page

#### Admin Review Service
```
PATCH /admin/:serviceId/review
```
**Description:** Approve or reject a service  
**Authorization:** Admin role required  
**Body:**
```javascript
{
  "state": "approved", // or "rejected"
  "reviewNotes": "Optional review notes"
}
```

## Error Responses
All endpoints return errors in this format:
```javascript
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message" // Only in development
}
```

## Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Validation Rules

### Service Creation/Update
- **title**: Required, max 100 characters
- **category**: Required, must be valid category
- **description**: Required, max 1000 characters
- **price**: Required
- **image**: Required, valid URL
- **tags**: Optional array of strings

### Admin Review
- **state**: Required, must be "approved" or "rejected"
- **reviewNotes**: Optional, max 500 characters

## Frontend Integration

### Service API Utility
Use the provided `serviceAPI` utility for easy integration:

```javascript
import { serviceAPI } from '../utils/serviceAPI';

// Create service
const result = await serviceAPI.createService(taskerId, serviceData, token);

// Get services
const services = await serviceAPI.getTaskerServices(taskerId, token);
```

### Validation Helper
```javascript
import { validateServiceData } from '../utils/serviceAPI';

const validation = validateServiceData(formData);
if (!validation.isValid) {
  console.log(validation.errors);
}
```

## Security Features
- JWT authentication required for all endpoints
- Ownership verification (taskers can only access their own services)
- Admin role verification for admin endpoints
- Input validation and sanitization
- MongoDB injection protection

## Future Enhancements
- File upload for service images via Cloudinary
- Service booking integration
- Rating and review system
- Advanced search and filtering
- Service analytics and insights
