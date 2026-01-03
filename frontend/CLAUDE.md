# Frontend Guidelines - Phase II

## Stack
- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS
- Better Auth for authentication

## Project Structure
- `/app` - Pages and layouts (App Router)
- `/components` - Reusable UI components
- `/lib` - Utility functions and API client
- `/types` - TypeScript type definitions

## Patterns
- Use server components by default
- Client components only when needed (interactivity)
- API calls go through `/lib/api.ts`

## API Client
All backend calls should use the API client:

```typescript
import { api } from '@/lib/api'
const tasks = await api.getTasks(userId)
```

## Styling
- Use Tailwind CSS classes
- No inline styles
- Follow existing component patterns

## Authentication
- Integrate Better Auth for user management
- Implement JWT token handling
- Secure all task operations based on user ID

## API Routes
Connect to backend at http://localhost:8000/api or via environment variable