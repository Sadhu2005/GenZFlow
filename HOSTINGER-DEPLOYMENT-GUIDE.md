# Hostinger Static Deployment Guide

This guide will help you deploy your GenZFlow frontend to Hostinger as a static website.

## Architecture Overview

- **Frontend**: Hostinger (Static Files)
- **Backend**: Local Development (Node.js)
- **Database**: Hostinger MySQL Database

## Prerequisites

1. Hostinger account with FTP access
2. GitHub account (for CI/CD)
3. Local development environment

## Step 1: Set Up GitHub Secrets

### 1.1 Get Your Hostinger FTP Details
1. Log into your Hostinger control panel
2. Go to **Files** → **File Manager** or **FTP Accounts**
3. Note down:
   - FTP Server (e.g., `ftp.hostinger.com`)
   - FTP Username
   - FTP Password
   - Port (usually `21`)

### 1.2 Add GitHub Secrets
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Add these repository secrets:
   - `FTP_SERVER`: Your Hostinger FTP server
   - `FTP_USERNAME`: Your FTP username
   - `FTP_PASSWORD`: Your FTP password

## Step 2: Local Development Setup

### 2.1 Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your database details
npm run dev
```

### 2.2 Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Step 3: Deploy Frontend

### 3.1 Automatic Deployment (Recommended)
1. Push your code to GitHub
2. GitHub Actions will automatically:
   - Build the frontend
   - Deploy to Hostinger via FTP

### 3.2 Manual Deployment
```bash
cd frontend
npm run build
# Upload contents of dist/ folder to Hostinger public_html/
```

## Step 4: Configure Your Domain

### 4.1 Point Domain to Hostinger
1. In Hostinger control panel
2. Go to **Domains**
3. Point your domain to the folder containing your files
4. Enable SSL certificate

### 4.2 Test Your Website
Visit your domain and test:
- Static files loading
- API calls to local backend (if running)

## Development Workflow

### For Frontend Changes:
1. Make changes to frontend code
2. Push to GitHub
3. GitHub Actions automatically deploys to Hostinger

### For Backend Changes:
1. Make changes to backend code
2. Run locally: `npm run dev`
3. Test with frontend

## Troubleshooting

### Common Issues

1. **FTP Connection Failed**
   - Check FTP credentials in GitHub secrets
   - Verify Hostinger FTP is enabled
   - Check firewall settings

2. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are installed
   - Check for TypeScript errors

3. **Files Not Uploading**
   - Verify FTP server path
   - Check file permissions
   - Ensure public_html directory exists

4. **Website Not Loading**
   - Check if index.html is in root directory
   - Verify domain DNS settings
   - Check SSL certificate status

### Manual FTP Upload
If automatic deployment fails:
1. Build frontend: `npm run build`
2. Use FTP client (FileZilla, WinSCP)
3. Upload contents of `dist/` folder to `public_html/`

## Cost Breakdown

- **Hostinger**: $0 (if you already have hosting)
- **GitHub Actions**: $0 (free tier)
- **Domain**: $0 (if you already have one)
- **Total**: $0/month

## Security Considerations

1. **Use HTTPS** for your domain
2. **Keep FTP credentials secure** in GitHub secrets
3. **Regular backups** of your code
4. **Monitor deployment logs** for issues

## Performance Tips

1. **Enable Gzip compression** on Hostinger
2. **Use CDN** for static assets (Cloudflare free tier)
3. **Optimize images** before uploading
4. **Enable browser caching**

## Monitoring

1. **GitHub Actions** provides deployment logs
2. **Hostinger** provides server monitoring
3. **Browser DevTools** for frontend debugging

## Scaling

When you need more features:
1. **Hostinger VPS** plans start at $3.99/month
2. **Backend hosting** on Railway, Render, or Fly.io
3. **Database** migration to managed services

---

**Need Help?**
- Check Hostinger documentation
- GitHub Actions logs
- Browser console for frontend errors
