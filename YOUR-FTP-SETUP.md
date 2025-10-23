# Your Hostinger FTP Setup for GitHub Actions

Based on your Hostinger details, here's exactly what you need to configure:

## Your FTP Details

| Setting | Value |
|---------|-------|
| **FTP Server** | `82.180.143.67` or `genzflow.genzspace.in` |
| **FTP Username** | `u575564595.genzflow.genzspace.in` |
| **FTP Password** | `[Your FTP Password]` |
| **Port** | `21` |
| **Protocol** | `FTP` |
| **Upload Path** | `public_html` |

## Step 1: Add GitHub Secrets

### Go to GitHub Repository Settings
1. **Open:** https://github.com/Sadhu2005/GenZFlow
2. **Click "Settings" tab**
3. **Click "Secrets and variables" → "Actions"**
4. **Click "New repository secret"**

### Add These 3 Secrets:

#### Secret 1: FTP_SERVER
- **Name:** `FTP_SERVER`
- **Value:** `82.180.143.67`
- **Alternative:** `genzflow.genzspace.in`

#### Secret 2: FTP_USERNAME
- **Name:** `FTP_USERNAME`
- **Value:** `u575564595.genzflow.genzspace.in`

#### Secret 3: FTP_PASSWORD
- **Name:** `FTP_PASSWORD`
- **Value:** `[Your actual FTP password from Hostinger]`

## Step 2: Test Deployment

### Option A: Automatic Trigger
1. **Make a small change** to any file in `frontend/` folder
2. **Commit and push** the changes
3. **GitHub Actions will automatically deploy**

### Option B: Manual Trigger
1. **Go to "Actions" tab** in your GitHub repository
2. **Click "Deploy Frontend to Hostinger"**
3. **Click "Run workflow"**
4. **Click "Run workflow" button**

## Step 3: Verify Deployment

### Check GitHub Actions
1. **Go to "Actions" tab**
2. **Click on the latest workflow run**
3. **Check if deployment succeeds**

### Check Your Website
1. **Visit:** https://genzflow.genzspace.in
2. **Test if the website loads**
3. **Check if `.htaccess` file is working** (try refreshing `/login` page)

## Troubleshooting

### If FTP Connection Fails:

#### Check Server Address
- Try `82.180.143.67` first
- If that fails, try `genzflow.genzspace.in`
- Both should work, but IP address is more reliable

#### Verify Credentials
- Username: `u575564595.genzflow.genzspace.in` (exact)
- Password: Your Hostinger FTP password
- Port: `21`

#### Check Hostinger Settings
- Ensure FTP is enabled in your Hostinger account
- Check if your plan includes FTP access
- Contact Hostinger support if needed

### If Deployment Succeeds But Website Doesn't Work:

#### Check File Upload
1. **Log into Hostinger File Manager**
2. **Go to `public_html` folder**
3. **Verify files are uploaded:**
   - `index.html`
   - `assets/` folder
   - `.htaccess` file

#### Check .htaccess File
1. **Make sure `.htaccess` file exists** in `public_html`
2. **Check if it has the correct content** for React SPA routing
3. **Test page refreshes** on different routes

## Expected Results

After successful setup:
- ✅ **Automatic deployment** on every push
- ✅ **Frontend updates** automatically
- ✅ **No manual uploads** needed
- ✅ **React routing works** (no 404 errors on refresh)

## Quick Test

1. **Add the 3 GitHub secrets** with your FTP details
2. **Make a small change** to `frontend/src/App.jsx`
3. **Commit and push** the changes
4. **Check GitHub Actions** for deployment status
5. **Visit your website** to see the changes

---

**Your FTP details are ready! Just add the GitHub secrets and you're good to go!** 🚀
