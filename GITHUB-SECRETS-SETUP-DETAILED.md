# GitHub Secrets Setup for Hostinger FTP Deployment

This guide will help you set up the required GitHub secrets for automatic deployment to Hostinger.

## Step 1: Get Your Hostinger FTP Details

### Option A: From Hostinger Control Panel
1. **Log into Hostinger Control Panel**
2. **Go to Files → File Manager**
3. **Or go to Advanced → FTP Accounts**
4. **Note down these details:**

| Setting | Value | Example |
|---------|-------|---------|
| **FTP Server** | `ftp.hostinger.com` | `ftp.hostinger.com` |
| **FTP Username** | `u575564595` | `u575564595` |
| **FTP Password** | Your FTP password | `your_password_here` |
| **Port** | `21` | `21` |

### Option B: From Hostinger Email
Check your email for FTP credentials that Hostinger sent when you created your account.

## Step 2: Add GitHub Secrets

### 2.1 Go to Repository Settings
1. **Open your GitHub repository:** https://github.com/Sadhu2005/GenZFlow
2. **Click "Settings" tab** (top right)
3. **Click "Secrets and variables" → "Actions"** (left sidebar)

### 2.2 Add Repository Secrets
Click "New repository secret" for each secret:

#### Secret 1: FTP_SERVER
- **Name:** `FTP_SERVER`
- **Value:** `ftp.hostinger.com`

#### Secret 2: FTP_USERNAME  
- **Name:** `FTP_USERNAME`
- **Value:** `u575564595`

#### Secret 3: FTP_PASSWORD
- **Name:** `FTP_PASSWORD`
- **Value:** `your_actual_ftp_password`

## Step 3: Verify Secrets

After adding all secrets, you should see:
- ✅ FTP_SERVER
- ✅ FTP_USERNAME  
- ✅ FTP_PASSWORD

## Step 4: Test Deployment

### 4.1 Trigger Deployment
1. **Make a small change** to any file in the `frontend/` folder
2. **Commit and push** the changes
3. **GitHub Actions will automatically deploy**

### 4.2 Check Deployment Status
1. **Go to "Actions" tab** in your GitHub repository
2. **Click on the latest workflow run**
3. **Check if deployment succeeds**

## Troubleshooting

### If FTP Connection Still Fails:

#### Check FTP Server
- Make sure you're using `ftp.hostinger.com`
- Try both `ftp.hostinger.com` and your server IP

#### Verify Credentials
- Double-check username: `u575564595`
- Verify password is correct
- Username usually starts with `u` followed by numbers

#### Check Hostinger Settings
- Ensure FTP is enabled in your Hostinger account
- Check if your plan includes FTP access
- Contact Hostinger support if needed

### If Deployment Fails:

#### Check GitHub Actions Logs
1. **Go to "Actions" tab**
2. **Click on failed workflow**
3. **Look for error messages**
4. **Check FTP connection details**

#### Common Issues:
- Wrong FTP server
- Incorrect credentials
- Firewall blocking connection
- Hostinger server maintenance

## Alternative: Manual Deployment

If automatic deployment doesn't work:

### Option 1: File Manager
1. **Log into Hostinger Control Panel**
2. **Go to Files → File Manager**
3. **Navigate to `public_html` folder**
4. **Delete old files**
5. **Upload contents of `frontend/dist/` folder**

### Option 2: FTP Client
1. **Download FileZilla (free FTP client)**
2. **Connect using your FTP credentials**
3. **Navigate to `public_html` folder**
4. **Upload files from `frontend/dist/`**

## Expected Results

After successful setup:
- ✅ **Automatic deployment** on every push to main branch
- ✅ **Frontend updates** automatically on Hostinger
- ✅ **No manual uploads** needed
- ✅ **Version control** of your deployments

## Security Best Practices

1. **Never share your FTP credentials**
2. **Use strong passwords**
3. **Regularly rotate passwords**
4. **Monitor deployment logs**
5. **Keep secrets updated**

---

**Once you've added these secrets, your frontend will automatically deploy to Hostinger whenever you push changes!** 🚀
