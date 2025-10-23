# Render.com GitHub Integration (Simplest Method)

This is the easiest way to set up automatic deployment from GitHub to Render.com.

## Step 1: Connect GitHub to Render

### 1.1 In Render Dashboard
1. **Log into Render.com**
2. **Go to your backend service** (genzflow-backend)
3. **Click "Settings" tab**
4. **Scroll down to "Build & Deploy" section**

### 1.2 Enable Auto-Deploy
1. **Find "Auto-Deploy" setting**
2. **Toggle it to "Yes"**
3. **Set Branch to "main"**
4. **Click "Save"**

## Step 2: Configure Build Settings

### 2.1 Build Command
```
cd backend && npm install
```

### 2.2 Start Command
```
cd backend && npm start
```

### 2.3 Node Version
```
20
```

## Step 3: Verify Environment Variables

Make sure these are set in your Render service:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `DB_HOST` | `82.180.143.52` |
| `DB_USER` | `u575564595_genzflow` |
| `DB_PASSWORD` | `[your_database_password]` |
| `DB_NAME` | `[your_database_name]` |
| `DB_PORT` | `3306` |
| `JWT_SECRET` | `[your_jwt_secret]` |
| `FRONTEND_URL` | `https://genzflow.genzspace.in` |

## Step 4: Test Auto-Deploy

### 4.1 Make a Test Change
1. **Edit any file** in `backend/` folder
2. **Commit and push** to main branch
3. **Check Render dashboard** for deployment

### 4.2 Verify Deployment
1. **Go to your service** in Render dashboard
2. **Check "Logs" tab** for build status
3. **Test your API:** https://genzflow-backend.onrender.com/api/health

## What Happens Next

### Automatic Deployment Process:
1. **You push code** to GitHub main branch
2. **Render detects** the changes
3. **Builds your backend** automatically
4. **Deploys to production** automatically
5. **Your API is updated** without manual intervention

### Benefits:
- ✅ **Zero configuration** needed
- ✅ **Automatic builds** on every push
- ✅ **Production deployment** without manual steps
- ✅ **Build logs** for debugging
- ✅ **Rollback capability** if needed

## Troubleshooting

### If Auto-Deploy Doesn't Work:

#### Check Render Settings
- Ensure "Auto-Deploy" is enabled
- Verify branch is set to "main"
- Check build and start commands are correct

#### Check GitHub Connection
- Verify Render is connected to your GitHub repository
- Check if Render has access to your repository
- Reconnect if necessary

#### Check Build Logs
1. **Go to Render dashboard**
2. **Click on your service**
3. **Go to "Logs" tab**
4. **Check for error messages**

### Common Issues:
- **Missing environment variables** - Check all required variables are set
- **Database connection issues** - Verify database credentials
- **Node.js version mismatch** - Ensure Node 20 is selected
- **Missing dependencies** - Check package.json and npm install

## Expected Results

After setup:
- ✅ **Every push to main** triggers automatic deployment
- ✅ **Backend updates** automatically
- ✅ **No manual deployment** needed
- ✅ **Production-ready** backend always up to date

---

**This is the simplest method - just enable Auto-Deploy in Render and you're done!** 🚀
