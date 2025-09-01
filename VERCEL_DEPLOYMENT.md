# Vercel Deployment Guide for Guess Who Game

## Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Create a Vercel account at https://vercel.com
3. Login to Vercel CLI: `vercel login`

## Step 1: Deploy Backend to Vercel

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

3. When prompted:
   - Set up and deploy: **Y**
   - Which scope: Select your account
   - Link to existing project: **N**
   - Project name: **guess-who-backend** (or your preferred name)
   - Directory: **./backend** (current directory)
   - Override settings: **N**

4. Note the deployed URL (e.g., https://guess-who-backend-xxx.vercel.app)

## Step 2: Deploy Frontend to Vercel

1. Navigate to frontend directory:
   ```bash
   cd ../frontend
   ```

2. Set the environment variable for the backend URL:
   ```bash
   vercel env add REACT_APP_SERVER_URL
   ```
   Enter the backend URL from Step 1 (e.g., https://guess-who-backend-xxx.vercel.app)

3. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

4. When prompted:
   - Set up and deploy: **Y**
   - Which scope: Select your account
   - Link to existing project: **N**
   - Project name: **guess-who-frontend** (or your preferred name)
   - Directory: **./frontend** (current directory)
   - Override settings: **N**

## Step 3: Update Backend CORS Settings

After frontend deployment, you need to update the backend's CORS configuration:

1. Go to Vercel dashboard
2. Find your backend project
3. Go to Settings → Environment Variables
4. Add `FRONTEND_URL` with your frontend URL (e.g., https://guess-who-frontend-xxx.vercel.app)
5. Redeploy the backend: `vercel --prod` in the backend directory

## Environment Variables Summary

### Backend:
- `NODE_ENV`: production
- `FRONTEND_URL`: Your frontend Vercel URL

### Frontend:
- `REACT_APP_SERVER_URL`: Your backend Vercel URL

## Testing

1. Visit your frontend URL
2. Test creating a game room
3. Test joining a game room
4. Verify WebSocket connections work
5. Test gameplay functionality

## Troubleshooting

- If WebSocket connections fail, check CORS settings
- If builds fail, check that all dependencies are in package.json
- For real-time updates, ensure both frontend and backend URLs are correctly configured
