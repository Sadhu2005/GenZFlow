# Manual Deployment Guide

Since the GitHub Actions FTP deployment needs secrets setup, here's how to manually deploy your frontend to Hostinger.

## Step 1: Build Frontend Locally

```bash
cd frontend
npm run build
```

## Step 2: Access Hostinger File Manager

1. **Log into Hostinger Control Panel**
2. **Go to Files → File Manager**
3. **Navigate to `public_html` folder**

## Step 3: Clean Old Files

**Delete everything in public_html:**
- Select all files and folders
- Delete them completely
- Make sure the folder is empty

## Step 4: Upload New Files

**Upload all contents from `frontend/dist/` folder:**
- Select all files from `frontend/dist/`
- Upload to `public_html/`
- Make sure `index.html` is in the root of `public_html/`

## Step 5: Verify Deployment

1. **Visit your website:** https://genzflow.genzspace.in
2. **Check if it loads correctly**
3. **Test API connections**

## Alternative: Use FTP Client

If File Manager doesn't work:

1. **Download FileZilla (free FTP client)**
2. **Connect using your FTP credentials**
3. **Navigate to `public_html` folder**
4. **Delete all old files**
5. **Upload all files from `frontend/dist/`**

## Expected File Structure in public_html:

```
public_html/
├── index.html
├── assets/
│   ├── index-Bl55aaub.css
│   ├── ui-5rNowfsM.js
│   ├── router-BAbphx5A.js
│   ├── index-DLxg-K1l.js
│   └── vendor-D3F3s8fL.js
└── manifest.json (if exists)
```

## Troubleshooting

### If website doesn't load:
1. **Check if `index.html` is in root of `public_html`**
2. **Verify all asset files are uploaded**
3. **Check browser console for errors**

### If API calls fail:
1. **Verify backend is running:** https://genzflow-backend.onrender.com
2. **Check CORS settings**
3. **Test API endpoints directly**

---

**Once you've manually deployed, your website should work perfectly!** 🚀
