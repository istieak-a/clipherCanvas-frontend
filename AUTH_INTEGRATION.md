# Authentication Integration - Usage Guide

## Overview
Full authentication system integrated with backend API including user registration, login, protected routes, profile management, and persistent sessions.

## Features Implemented

### 1. **Authentication Service Layer**
- [src/utils/api.js](src/utils/api.js) - Fetch wrapper with auth token injection and error handling
- [src/utils/authService.js](src/utils/authService.js) - API functions for register, login, profile operations

### 2. **Auth Context Provider**
- [src/context/AuthContext.jsx](src/context/AuthContext.jsx) - Global auth state management
- Provides: `user`, `isAuthenticated`, `loading`, `login()`, `signup()`, `logout()`, `updateUser()`
- Automatic token persistence and restoration on page refresh
- Handles unauthorized responses (401) with automatic logout

### 3. **Updated Pages**
- [Login.jsx](src/pages/Login.jsx) - Email/password login with error handling and loading states
- [Signup.jsx](src/pages/Signup.jsx) - Registration with username, email, password, firstName, lastName fields
- [Profile.jsx](src/pages/Profile.jsx) - View and update user profile information

### 4. **Protected Routes**
- [ProtectedRoute.jsx](src/components/ProtectedRoute.jsx) - Redirects to login if not authenticated
- Profile page is protected

### 5. **Dynamic Navigation**
- [Navbar.jsx](src/components/Navbar.jsx) - Shows Login/Signup when logged out, Profile/Logout when logged in
- Displays username when authenticated

## How to Use

### Starting the Application

1. **Ensure backend is running** at `http://localhost:5000`
2. **Start the frontend:**
   ```bash
   npm run dev
   ```

### User Flow

#### Registration
1. Navigate to `/signup`
2. Fill in:
   - Username (required)
   - Email (required)
   - Password (required)
   - First Name (optional)
   - Last Name (optional)
3. Click "Create Identity"
4. On success, automatically logged in and redirected to home

#### Login
1. Navigate to `/login`
2. Enter email and password
3. Click "Unlock Account"
4. On success, redirected to home with navbar showing username

#### Profile Management
1. Must be logged in
2. Navigate to `/profile` or click "Profile" in navbar
3. View current profile information
4. Click "Edit Profile" to update firstName, lastName, or avatar URL
5. Click "Save Changes" to persist updates

#### Logout
1. Click "Logout" button in navbar
2. Clears token and user data
3. Redirects to home page

## Backend API Integration

### Endpoints Used
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Token Management
- JWT token stored in `localStorage` under key `token`
- User data cached in `localStorage` under key `user`
- Token automatically included in `Authorization: Bearer <token>` header for protected requests
- Token verified on app mount - if invalid/expired, user is logged out

### Error Handling
- Network errors displayed as inline error messages
- 401 responses trigger automatic logout
- Form validation with HTML5 required fields
- Loading states prevent duplicate submissions

## Security Notes

- Tokens stored in localStorage (persistent across browser sessions)
- No token expiry checking on frontend (relies on backend validation)
- Protected routes redirect to login before accessing sensitive pages
- Logout clears all auth data from localStorage

## File Structure

```
src/
├── context/
│   └── AuthContext.jsx         # Global auth state & methods
├── components/
│   ├── Navbar.jsx              # Dynamic auth UI
│   └── ProtectedRoute.jsx      # Route guard component
├── pages/
│   ├── Login.jsx               # Login page
│   ├── Signup.jsx              # Registration page
│   └── Profile.jsx             # User profile (protected)
├── utils/
│   ├── api.js                  # Fetch wrapper
│   └── authService.js          # Auth API functions
└── App.jsx                     # Routes with AuthProvider
```

## Next Steps (Optional Enhancements)

1. **Add form validation** - Email format, password strength requirements
2. **Add toast notifications** - Better UX for success/error messages
3. **Add loading skeleton** - For profile page data loading
4. **Add password reset** - Forgot password functionality
5. **Add email verification** - Verify email after registration
6. **Add refresh token logic** - Auto-refresh expired tokens
7. **Add remember me** - Choice between localStorage/sessionStorage
8. **Add social auth** - Google, GitHub OAuth integration
