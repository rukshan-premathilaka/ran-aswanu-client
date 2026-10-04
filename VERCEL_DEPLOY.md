# Deploy to Vercel

1. Push the project to Git (GitHub/GitLab/Bitbucket) and click **Add New -> Project** in Vercel.
2. Framework preset: **Vite** (vercel.json already sets build command `npm run build` and output `dist`).
3. **Settings -> Environment Variables** (Production and Preview), add:

| Name | Required | Example |
|---|---|---|
| VITE_API_BASE_URL | yes | https://api.your-domain.com/api |
| VITE_FILES_BASE_URL | no | https://api.your-domain.com |
| VITE_WS_URL | no | https://api.your-domain.com/ws/chat |
| VITE_DESKTOP_APP_URL | no | |
| VITE_CONTACT_EMAIL | no | |
| VITE_CONTACT_PHONE | no | |
| VITE_SUPPORT_EMAIL | no | |

4. Redeploy after changing any variable (they are baked in at build time).

## Backend checklist (separate server)
- Must be served over **https** (browsers block http/ws calls from an https page).
- CORS must allow your Vercel domain (e.g. https://your-app.vercel.app) with the Authorization header and methods GET, POST, PUT, PATCH, DELETE, OPTIONS.
- The WebSocket/SockJS origin (/ws/chat) must also allow that domain.
