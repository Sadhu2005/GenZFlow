# 🔧 GenZFlow FTP Deployment Troubleshooting Guide

## 🚨 **Common FTP Deployment Errors**

### **Error: `ENOTFOUND ***`**
This means the FTP server hostname is incorrect or not set properly.

## 🔧 **How to Fix FTP Issues**

### **Step 1: Get Correct Hostinger FTP Credentials**

1. **Login to Hostinger Control Panel**
   - Go to: https://hpanel.hostinger.com
   - Login with your Hostinger account

2. **Navigate to FTP Accounts**
   - Go to "Advanced" → "FTP Accounts"
   - Or go to "Files" → "FTP Accounts"

3. **Create/Find FTP Account**
   - If you don't have one, create a new FTP account
   - **Important**: Use your domain as the FTP host

### **Step 2: Correct FTP Settings for Hostinger**

**For your domain `genzflow.genzspace.in`:**

```
HOSTINGER_FTP_HOST = genzflow.genzspace.in
HOSTINGER_FTP_USERNAME = your_ftp_username
HOSTINGER_FTP_PASSWORD = your_ftp_password
```

**Alternative Hostinger FTP hosts:**
- `ftp.genzflow.genzspace.in`
- `files.genzflow.genzspace.in`
- Your server IP address (from Hostinger control panel)

### **Step 3: Update GitHub Secrets**

1. Go to: https://github.com/Sadhu2005/GenZFlow/settings/secrets/actions
2. Update these secrets:

```
Name: HOSTINGER_FTP_HOST
Value: genzflow.genzspace.in
(OR try: ftp.genzflow.genzspace.in)

Name: HOSTINGER_FTP_USERNAME
Value: your_actual_ftp_username

Name: HOSTINGER_FTP_PASSWORD
Value: your_actual_ftp_password
```

## 🔍 **Alternative Deployment Methods**

### **Method 1: Use Hostinger File Manager**
If FTP continues to fail, you can manually upload:

1. **Build locally:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload to Hostinger:**
   - Login to Hostinger control panel
   - Go to File Manager
   - Upload `frontend/dist/` contents to `public_html/`
   - Upload `backend/` folder to your domain folder

### **Method 2: Use SFTP Instead of FTP**
Update the workflow to use SFTP:

```yaml
- name: Deploy to Hostinger
  uses: SamKirkland/FTP-Deploy-Action@v4.3.4
  with:
    server: ${{ secrets.HOSTINGER_FTP_HOST }}
    username: ${{ secrets.HOSTINGER_FTP_USERNAME }}
    password: ${{ secrets.HOSTINGER_FTP_PASSWORD }}
    protocol: sftp
    port: 22
```

### **Method 3: Use rsync with SSH**
If you have SSH access:

```yaml
- name: Deploy via SSH
  uses: appleboy/ssh-action@v0.1.5
  with:
    host: ${{ secrets.HOSTINGER_SSH_HOST }}
    username: ${{ secrets.HOSTINGER_SSH_USERNAME }}
    password: ${{ secrets.HOSTINGER_SSH_PASSWORD }}
    script: |
      rsync -avz --delete ./frontend/dist/ /home/username/public_html/
```

## 🎯 **Quick Fix Steps**

### **1. Check Your FTP Credentials**
- Verify FTP hostname in Hostinger control panel
- Test FTP connection with FileZilla or similar tool
- Make sure FTP account is active

### **2. Try Different FTP Hosts**
Try these variations in your GitHub secret:
- `genzflow.genzspace.in`
- `ftp.genzflow.genzspace.in`
- `files.genzflow.genzspace.in`
- Your server IP address

### **3. Enable FTP in Hostinger**
- Make sure FTP is enabled in Hostinger control panel
- Check if there are any firewall restrictions
- Verify FTP port 21 is open

### **4. Test FTP Connection Manually**
Use a FTP client to test:
- **Host**: genzflow.genzspace.in
- **Port**: 21
- **Username**: your_ftp_username
- **Password**: your_ftp_password

## 🚀 **Manual Deployment (Backup Plan)**

If FTP continues to fail, you can deploy manually:

### **Frontend Deployment:**
1. Build locally: `cd frontend && npm run build`
2. Upload `frontend/dist/` contents to Hostinger File Manager
3. Place files in `public_html/` folder

### **Backend Deployment:**
1. Upload `backend/` folder to Hostinger
2. Set up Node.js in Hostinger control panel
3. Configure environment variables
4. Set startup file to `server.js`

### **Database Setup:**
1. Go to phpMyAdmin in Hostinger
2. Import `backend/database/schema.sql`
3. Update backend environment variables

## 📞 **Hostinger Support**

If FTP still doesn't work:
1. **Contact Hostinger Support** via live chat
2. **Ask for FTP configuration** details
3. **Request SSH access** if available
4. **Verify domain DNS** settings

## ✅ **Success Indicators**

When FTP works correctly, you'll see:
- ✅ **Files uploaded** to Hostinger
- ✅ **Frontend accessible** at https://genzflow.genzspace.in
- ✅ **Backend API responding** at https://genzflow.genzspace.in:5000
- ✅ **No FTP connection errors**

Your **GenZFlow** platform will be live! 🌊✨
