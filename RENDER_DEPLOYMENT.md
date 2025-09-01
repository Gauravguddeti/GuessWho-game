# Render Deployment Guide for Guess Who Game

## Prerequisites
1. Create a Render account at https://render.com
2. Connect your GitHub repository to Render

## Step 1: Deploy Backend to Render

1. In Render dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: guess-who-backend
   - **Environment**: Node
   - **Region**: Choose closest to your users
   - **Branch**: master (or main)
   - **Root Directory**: backend
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. Environment Variables:
   - `NODE_ENV`: production
   - `FRONTEND_URL`: (will be updated after frontend deployment)

5. Click "Create Web Service"
6. Wait for deployment to complete
7. Note the service URL (e.g., https://guess-who-backend-xxx.onrender.com)

## Step 2: Deploy Frontend to Render

1. In Render dashboard, click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure the site:
   - **Name**: guess-who-frontend
   - **Branch**: master (or main)
   - **Root Directory**: frontend
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: build

4. Environment Variables:
   - `REACT_APP_SERVER_URL`: Your backend Render URL from Step 1

5. Click "Create Static Site"
6. Wait for deployment to complete
7. Note the site URL (e.g., https://guess-who-frontend-xxx.onrender.com)

## Step 3: Update Backend CORS Settings

1. Go to your backend service in Render
2. Go to Environment tab
3. Update `FRONTEND_URL` with your frontend URL from Step 2
4. Save changes (this will trigger a redeploy)

## Auto-Deploy Setup

Render automatically deploys when you push to your connected branch. To set up:

1. Make sure your GitHub repository is connected
2. Both services should have "Auto-Deploy" enabled by default
3. Any push to the master branch will trigger redeployment

## Environment Variables Summary

### Backend Web Service:
- `NODE_ENV`: production
- `FRONTEND_URL`: Your frontend Render URL

### Frontend Static Site:
- `REACT_APP_SERVER_URL`: Your backend Render URL

## Important Notes

1. **Cold Starts**: Free tier Render services may have cold starts (15+ seconds delay)
2. **WebSockets**: Render supports WebSocket connections on all plans
3. **SSL**: All Render deployments include SSL certificates
4. **Logs**: Check service logs for debugging deployment issues

## Testing

1. Visit your frontend URL
2. Test creating a game room
3. Test joining a game room
4. Verify WebSocket connections work (may take a moment on free tier)
5. Test gameplay functionality

## Performance Optimization

For better performance on Render:
1. Consider upgrading to paid plans to avoid cold starts
2. Use Render's CDN features for static assets
3. Monitor service metrics in the dashboard

## Troubleshooting

- **Build Failures**: Check build logs in Render dashboard
- **WebSocket Issues**: Verify CORS configuration
- **Slow Loading**: Free tier services sleep after inactivity
- **Environment Variables**: Double-check all URLs are correct
