# Deployment Guide - Render

## Step 1: Push Your Code to GitHub

Make sure all your changes are committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## Step 2: Deploy on Render

### Option A: Using Blueprint (Automatic - Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New" → "Blueprint"**
3. Connect your GitHub repository: `Win-my-Argument`
4. Render will detect `render.yaml` and create both services automatically
5. Set environment variables:
   - For **backend**: Add `GEMINI_API_KEY` = `AIzaSyAN1tMhcOEglx4Nw0SxjDsAX9v3kPJqnKg`
6. Click **"Apply"**

### Option B: Manual Setup

#### Backend Service:
1. Click **"New" → "Web Service"**
2. Connect your GitHub repo
3. Configure:
   - **Name**: `win-my-argument-backend`
   - **Root Directory**: Leave empty (uses root)
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free
4. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `GEMINI_API_KEY` = `AIzaSyAN1tMhcOEglx4Nw0SxjDsAX9v3kPJqnKg`
   - `PORT` = `3001`
5. Click **"Create Web Service"**

#### Frontend Service:
1. Click **"New" → "Web Service"** again
2. Connect the same GitHub repo
3. Configure:
   - **Name**: `win-my-argument-frontend`
   - **Root Directory**: `ui`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free
4. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `NEXT_PUBLIC_API_URL` = `https://win-my-argument-backend.onrender.com/api`
   - `NEXT_PUBLIC_WS_URL` = `wss://win-my-argument-backend.onrender.com`
5. Click **"Create Web Service"**

## Step 3: Wait for Deployment

- Backend deploys first (~5-10 minutes)
- Frontend deploys after (~3-5 minutes)
- Check logs if there are any errors

## Step 4: Update Frontend URL

After backend is deployed:
1. Copy the backend URL (e.g., `https://win-my-argument-backend.onrender.com`)
2. Go to frontend service settings
3. Update environment variables:
   - `NEXT_PUBLIC_API_URL` = `https://YOUR-ACTUAL-BACKEND-URL.onrender.com/api`
   - `NEXT_PUBLIC_WS_URL` = `wss://YOUR-ACTUAL-BACKEND-URL.onrender.com`
4. Trigger a manual redeploy of the frontend

## Step 5: Access Your App

Your frontend will be available at:
`https://win-my-argument-frontend.onrender.com`

## Important Notes:

⚠️ **Free Tier Limitations:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30-60 seconds
- 750 hours/month free (enough for testing)

✅ **Database:**
- SQLite file persists on Render's disk
- Backed up automatically

✅ **Auto-Deploy:**
- Every push to `main` branch triggers automatic deployment

## Troubleshooting:

### Backend won't start:
- Check environment variables are set correctly
- View logs in Render dashboard
- Ensure `GEMINI_API_KEY` is set

### Frontend can't connect to backend:
- Verify `NEXT_PUBLIC_API_URL` points to correct backend URL
- Check backend is running (green status)
- Test backend URL directly in browser

### Build fails:
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Try building locally first: `npm run build`

## Need Help?

Check the Render logs:
1. Go to your service in Render dashboard
2. Click "Logs" tab
3. Look for error messages

Common issues are usually:
- Missing environment variables
- Wrong build/start commands
- Database connection errors
