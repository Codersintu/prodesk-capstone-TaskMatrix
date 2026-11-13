# TaskMatrix backend

This Express API handles workspace creation. The browser sends the request to
the Next.js app; its `/api/auth/workspace` route checks the NextAuth session and
forwards the request to this API with a short-lived signed token.

Express verifies that token before creating a workspace. The creator ID comes
from the verified token, not from the request body. Workspace creation also
creates an active owner membership.

Set these server-side environment variables for both the Next.js and backend
servers:

```bash
INTERNAL_API_SECRET=<same random secret, at least 32 characters>
```

Set this variable in the Next.js app as well:

```bash
BACKEND_URL=http://localhost:8000
```

Install workspace dependencies from the repository root with `bun install`, then
start the API from this directory with `bun run index.ts`. The protected
workspace endpoint is `POST http://localhost:8000/api/workspace`.

Example request body:

```json
{
  "name": "Design Team",
  "description": "Workspace for the design team"
}
```
