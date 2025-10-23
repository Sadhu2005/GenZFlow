# Free Hosting Deployment Guide

This guide will help you deploy your GenZFlow application using free hosting services.

## Architecture Overview

- **Frontend**: Hosted on Hostinger (Static Files)
- **Backend**: Deployed on Render.com (Free Tier)
- **Database**: Hostinger MySQL Database

## Prerequisites

1. Hostinger account with MySQL database
2. Render.com account (free)
3. GitHub account (for Render deployment)

## Step 1: Prepare Your Hostinger Database

### 1.1 Create MySQL Database
1. Log into your Hostinger control panel
2. Go to **Databases** → **MySQL Databases**
3. Create a new database (e.g., `genzflow_production`)
4. Create a database user with full privileges
5. Note down:
   - Database host (usually `localhost` or your server IP)
   - Database name
   - Username
   - Password
   - Port (usually `3306`)

### 1.2 Import Database Schema
1. Go to **phpMyAdmin** in your Hostinger panel
2. Select your database
3. Import the SQL file from `backend/database/schema.sql`

## Step 2: Deploy Backend to Render.com

### 2.1 Prepare Backend for Render
1. Push your code to GitHub
2. Make sure `render.yaml` is in your repository root
3. Update `backend/env.example` with your Hostinger database details

### 2.2 Deploy on Render
1. Go to [Render.com](https://render.com) and sign up
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `genzflow-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: `Free`

### 2.3 Set Environment Variables
In Render dashboard, go to **Environment** tab and add:

```
NODE_ENV=production
DB_HOST=your_hostinger_mysql_host
DB_USER=your_hostinger_mysql_username
DB_PASSWORD=your_hostinger_mysql_password
DB_NAME=your_hostinger_database_name
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=https://your-domain.com
```

### 2.4 Deploy
1. Click **Create Web Service**
2. Wait for deployment to complete
3. Note your backend URL (e.g., `https://genzflow-backend.onrender.com`)

## Step 3: Deploy Frontend to Hostinger

### 3.1 Build Frontend
```bash
cd frontend
npm install
npm run build
```

### 3.2 Configure API URL
1. Create `.env` file in frontend directory:
```
VITE_API_URL=https://your-render-backend-url.onrender.com
```

2. Rebuild:
```bash
npm run build
```

### 3.3 Upload to Hostinger
1. Log into Hostinger File Manager
2. Navigate to `public_html` (or your domain folder)
3. Upload all contents from `frontend/dist/` folder
4. Make sure `index.html` is in the root directory

### 3.4 Configure Domain (Optional)
1. In Hostinger, go to **Domains**
2. Point your domain to the folder containing your files
3. Enable SSL certificate

## Step 4: Update CORS Settings

### 4.1 Update Backend CORS
In your Render environment variables, update:
```
FRONTEND_URL=https://your-domain.com
```

### 4.2 Restart Backend
The backend will automatically restart when you update environment variables.

## Step 5: Test Your Deployment

### 5.1 Test Backend
Visit: `https://your-backend-url.onrender.com/api/health` (if you have a health endpoint)

### 5.2 Test Frontend
Visit your Hostinger domain and test:
- User registration
- User login
- Dashboard functionality
- Task management

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Make sure `FRONTEND_URL` in backend matches your actual domain
   - Check that your domain has HTTPS enabled

2. **Database Connection Issues**
   - Verify Hostinger database credentials
   - Check if your Hostinger plan allows external connections
   - Some Hostinger plans only allow localhost connections

3. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are in `package.json`

4. **Frontend Not Loading**
   - Verify all files are uploaded to correct directory
   - Check browser console for errors
   - Ensure `index.html` is in the root of your domain

### Alternative Free Hosting Options

If Render.com doesn't work for you:

1. **Railway.app** - Free tier with PostgreSQL
2. **Fly.io** - Free tier with generous limits
3. **Heroku** - Limited free tier (may require credit card)
4. **Vercel** - For serverless functions
5. **Netlify** - For static sites with serverless functions

## Cost Breakdown

- **Hostinger**: $0 (if you already have hosting)
- **Render.com**: $0 (free tier)
- **Domain**: $0 (if you already have one)
- **Total**: $0/month

## Performance Tips

1. **Enable Gzip compression** on Hostinger
2. **Use CDN** for static assets (Cloudflare free tier)
3. **Optimize images** before uploading
4. **Enable caching** in your browser

## Security Considerations

1. **Use HTTPS** for both frontend and backend
2. **Set strong JWT secrets**
3. **Enable rate limiting** (already configured)
4. **Use environment variables** for sensitive data
5. **Regular security updates**

## Monitoring

1. **Render.com** provides basic monitoring
2. **Hostinger** provides server monitoring
3. Consider adding **Uptime monitoring** (UptimeRobot free tier)

## Scaling

When you outgrow the free tier:
1. **Render.com** paid plans start at $7/month
2. **Hostinger** VPS plans start at $3.99/month
3. **Database**: Consider managed databases (PlanetScale, Supabase)

---

**Need Help?**
- Check Render.com documentation
- Hostinger support documentation
- GitHub issues for your project
