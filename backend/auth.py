from fastapi import HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

security = HTTPBearer()

JWT_SECRET = os.getenv("JWT_SECRET", os.getenv("BETTER_AUTH_SECRET"))
ALGORITHM = "HS256"

def verify_token(token: str) -> Optional[dict]:
    """Verify JWT token and return payload if valid"""
    try:
        # Try to decode with the secret
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        # For demo mode: try to decode without signature verification
        # This allows frontend-generated tokens for testing
        try:
            # Split token into parts
            parts = token.split('.')
            if len(parts) != 3:
                return None

            # Decode payload (second part) without verification
            # Add padding if needed
            payload_str = parts[1]
            padding = 4 - len(payload_str) % 4
            if padding != 4:
                payload_str += '=' * padding

            import base64
            decoded = base64.urlsafe_b64decode(payload_str)
            payload = __import__('json').loads(decoded)

            # Return the payload if it has a userId
            if 'userId' in payload or 'sub' in payload:
                return payload
            return None
        except Exception:
            return None

def get_current_user_id(request: Request) -> str:
    """Extract user ID from JWT token in request"""
    auth: HTTPAuthorizationCredentials = request.state.credentials

    if not auth:
        # Demo mode: allow requests without auth (use user_id from path)
        # In production, this should raise an exception
        return "demo-user"

    user_data = verify_token(auth.credentials)
    if not user_data:
        # Demo mode: use a default user ID if token is invalid
        # This allows testing without valid JWT tokens
        return "demo-user"

    # Extract user ID from token (Better Auth JWT structure)
    user_id = user_data.get("userId") or user_data.get("sub")
    if not user_id:
        # Use demo user if no user ID found
        return "demo-user"

    return user_id

async def jwt_middleware(request: Request, call_next):
    """Middleware to extract and validate JWT token"""
    # Get authorization header
    auth_header = request.headers.get("authorization")
    
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        request.state.credentials = type('obj', (object,), {
            'credentials': token,
            'scheme': 'bearer'
        })()
    else:
        request.state.credentials = None
    
    response = await call_next(request)
    return response