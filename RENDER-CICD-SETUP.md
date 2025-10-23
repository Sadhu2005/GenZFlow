# Render.com CI/CD Setup Guide

This guide will help you set up automatic deployment of your backend to Render.com from GitHub.

## Method 1: Render.com Auto-Deploy (Recommended)

### Step 1: Connect GitHub to Render
1. **Log into Render.com**
2. **Go to your backend service** (genzflow-backend)
3. **Click "Settings" tab**
4. **Go to "Build & Deploy" section**
5. **Under "Auto-Deploy", select "Yes"**
6. **Set Branch to "main"**
7. **Save settings**

### Step 2: Configure Build Settings
1. **In your Render service settings:**
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Node Version:** `20`

### Step 3: Set Environment Variables
Make sure these are set in Render dashboard:
```
NODE_ENV=production
DB_HOST=82.180.143.52
DB_USER=u575564595_genzflow
DB_PASSWORD=[your_database_password]
DB_NAME=[your_database_name]
DB_PORT=3306
JWT_SECRET=[your_jwt_secret]
FRONTEND_URL=https://genzflow.genzspace.in
```

## Method 2: GitHub Actions (Alternative)

### Step 1: Get Render API Key
1. **Log into Render.com**
2. **Go to Account Settings**
3. **Go to "API Keys" section**
4. **Create new API key**
5. **Copy the API key**

### Step 2: Get Service ID
1. **Go to your backend service**
2. **Copy the Service ID** from the URL or settings

### Step 3: Add GitHub Secrets
1. **Go to GitHub repository settings**
2. **Go to "Secrets and variables" → "Actions"**
3. **Add these secrets:**

| Secret Name | Value |
|-------------|-------|
| `RENDER_API_KEY` | `[Your Render API Key]` |
| `RENDER_SERVICE_ID` | `[Your Service ID]` |

## Method 3: Render Webhook (Advanced)

### Step 1: Create Webhook
1. **In your Render service settings**
2. **Go to "Webhooks" section**
3. **Create new webhook**
4. **Set URL:** `https://api.render.com/v1/services/[SERVICE_ID]/deploys`
5. **Set trigger:** GitHub push events

### Step 2: Configure GitHub Webhook
1. **Go to GitHub repository settings**
2. **Go to "Webhooks" section**
3. **Add webhook**
4. **Set Payload URL:** Your Render webhook URL
5. **Set events:** Push events

## Testing Your Setup

### Test Auto-Deploy
1. **Make a small change** to any file in `backend/` folder
2. **Commit and push** the changes
3. **Check Render dashboard** for deployment status
4. **Check your backend URL:** https://genzflow-backend.onrender.com

### Test API Endpoints
1. **Health check:** https://genzflow-backend.onrender.com/api/health
2. **Test registration:** POST to `/api/auth/register`
3. **Test login:** POST to `/api/auth/login`

## Troubleshooting

### If Auto-Deploy Doesn't Work:

#### Check Render Settings
- Ensure "Auto-Deploy" is enabled
- Verify branch is set to "main"
- Check build and start commands

#### Check GitHub Connection
- Verify Render is connected to your GitHub repository
- Check if Render has access to your repository
- Reconnect if necessary

#### Check Environment Variables
- Ensure all required environment variables are set
- Verify database connection details
- Check JWT secret is set

### If Deployment Fails:

#### Check Build Logs
1. **Go to Render dashboard**
2. **Click on your service**
3. **Go to "Logs" tab**
4. **Check build and deploy logs**

#### Common Issues:
- Missing environment variables
- Database connection issues
- Node.js version mismatch
- Missing dependencies

## Benefits of Auto-Deploy

- ✅ **Automatic deployment** on every push to main
- ✅ **No manual intervention** needed
- ✅ **Version control** of your deployments
- ✅ **Rollback capability** if needed
- ✅ **Build logs** for debugging

## Expected Workflow

1. **Make changes** to backend code
2. **Commit and push** to main branch
3. **Render automatically detects** the changes
4. **Builds and deploys** the new version
5. **Your backend is updated** automatically

---

**Choose Method 1 (Auto-Deploy) for the simplest setup!** 🚀
