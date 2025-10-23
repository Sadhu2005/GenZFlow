# GitHub Secrets Setup for Hostinger Deployment

This guide will help you set up the required GitHub secrets for automatic deployment to Hostinger.

## Required GitHub Secrets

You need to add these secrets to your GitHub repository:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `FTP_SERVER` | Your Hostinger FTP server | `ftp.hostinger.com` |
| `FTP_USERNAME` | Your FTP username | `u123456789` |
| `FTP_PASSWORD` | Your FTP password | `your_ftp_password` |

## Step-by-Step Setup

### 1. Get Your Hostinger FTP Details

#### Option A: From Hostinger Control Panel
1. **Log into Hostinger Control Panel**
2. **Go to Files → File Manager**
3. **Or go to Advanced → FTP Accounts**
4. **Note down:**
   - FTP Server (e.g., `ftp.hostinger.com`)
   - FTP Username (usually starts with `u` followed by numbers)
   - FTP Password

#### Option B: From Hostinger Email
Check your email for FTP credentials that Hostinger sent when you created your account.

### 2. Add Secrets to GitHub

#### Step 1: Go to Repository Settings
1. **Open your GitHub repository**
2. **Click "Settings" tab**
3. **Click "Secrets and variables" → "Actions"**

#### Step 2: Add Repository Secrets
1. **Click "New repository secret"**
2. **Add each secret:**

**Secret 1: FTP_SERVER**
- Name: `FTP_SERVER`
- Value: `ftp.hostinger.com` (or your specific server)

**Secret 2: FTP_USERNAME**
- Name: `FTP_USERNAME`
- Value: `u123456789` (your actual username)

**Secret 3: FTP_PASSWORD**
- Name: `FTP_PASSWORD`
- Value: `your_actual_password`

### 3. Verify Secrets
After adding all secrets, you should see:
- ✅ FTP_SERVER
- ✅ FTP_USERNAME  
- ✅ FTP_PASSWORD

## Common Hostinger FTP Servers

| Region | FTP Server |
|--------|------------|
| Global | `ftp.hostinger.com` |
| India | `ftp.hostinger.in` |
| UK | `ftp.hostinger.co.uk` |
| Custom | Your server IP or custom domain |

## Troubleshooting

### If FTP Connection Fails:

1. **Check FTP Server**
   - Make sure you're using the correct server
   - Try both `ftp.hostinger.com` and your server IP

2. **Verify Credentials**
   - Double-check username and password
   - Username usually starts with `u` followed by numbers

3. **Check Hostinger Settings**
   - Ensure FTP is enabled in your Hostinger account
   - Check if your plan includes FTP access

4. **Test FTP Connection**
   - Use an FTP client (FileZilla, WinSCP) to test
   - Make sure you can connect manually

### If Deployment Fails:

1. **Check GitHub Actions Logs**
   - Go to "Actions" tab in your repository
   - Click on the failed workflow
   - Look for error messages

2. **Common Issues:**
   - Wrong FTP server
   - Incorrect credentials
   - Firewall blocking connection
   - Hostinger server maintenance

## Security Best Practices

1. **Never share your FTP credentials**
2. **Use strong passwords**
3. **Regularly rotate passwords**
4. **Monitor deployment logs**
5. **Keep secrets updated**

## Testing Your Setup

### Manual Test:
1. **Push a small change to frontend**
2. **Check GitHub Actions tab**
3. **Verify deployment succeeds**
4. **Visit your website**

### Expected Workflow:
1. **Code pushed to main branch**
2. **GitHub Actions triggers**
3. **Frontend builds successfully**
4. **Files uploaded to Hostinger**
5. **Website updates automatically**

## Need Help?

- **Hostinger Support**: Check their documentation
- **GitHub Actions**: Check workflow logs
- **FTP Issues**: Test with FTP client first

---

**Once you've added these secrets, your frontend will automatically deploy to Hostinger whenever you push changes to the main branch!** 🚀
