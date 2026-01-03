# Feature: User Authentication

## User Stories
- As a user, I can sign up for an account
- As a user, I can sign in to my account
- As an authenticated user, I can access my tasks only
- As an authenticated user, I cannot see other users' tasks
- As a user, I can securely log out

## Acceptance Criteria

### User Registration
- Collect email and password
- Validate email format
- Password strength requirements (if any)
- Create user in authentication system (Better Auth manages this)

### User Login
- Accept email and password
- Authenticate against Better Auth
- Receive JWT token upon successful login
- Store token securely in frontend

### JWT Token Usage
- Include JWT token in Authorization header for all API requests
- Token should contain user ID for verification
- Backend validates token signature using shared secret

### User Isolation
- All API endpoints require user ID in URL path
- Backend verifies that authenticated user matches user ID in URL
- Users can only access/modify their own tasks

### Secure Logout
- Remove JWT token from frontend storage
- Invalidate session (if needed)
- Redirect to login page

## Security Requirements
- JWT tokens expire after 7 days
- All requests to backend API are authenticated
- User ID in URL path matches authenticated user
- No user can access another user's data

## Implementation Details
- Better Auth handles user registration/login on frontend
- JWT plugin in Better Auth generates tokens
- Backend API verifies JWT tokens using the same secret
- Shared BETTER_AUTH_SECRET environment variable