# .htaccess Setup for React SPA on Hostinger

This guide explains how to fix the 404 error when refreshing pages on your React Single Page Application (SPA) hosted on Hostinger.

## Problem
When you refresh the page on routes like `/login`, `/dashboard`, etc., you get a 404 error because the server tries to find a physical file at that path instead of serving the React app.

## Solution
Add a `.htaccess` file to your `public_html` directory to handle client-side routing.

## Step 1: Create .htaccess File

Create a file named `.htaccess` in your `public_html` directory with this content:

```apache
RewriteEngine On

# Handle client-side routing for React SPA
# Redirect all requests to index.html except for existing files
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable compression for better performance
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers for static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>
```

## Step 2: Upload to Hostinger

### Option A: File Manager
1. **Log into Hostinger Control Panel**
2. **Go to Files → File Manager**
3. **Navigate to `public_html` folder**
4. **Create new file named `.htaccess`**
5. **Paste the content above**
6. **Save the file**

### Option B: FTP Client
1. **Use FileZilla or similar FTP client**
2. **Connect to your Hostinger FTP**
3. **Navigate to `public_html` folder**
4. **Upload the `.htaccess` file**

## Step 3: Test Your Website

1. **Visit your website:** https://genzflow.genzspace.in
2. **Navigate to different routes:** `/login`, `/dashboard`, etc.
3. **Refresh the page** - Should work without 404 errors
4. **Test direct URL access** - Should load the correct page

## What This Fixes

- ✅ **Page refreshes work** - No more 404 errors
- ✅ **Direct URL access** - Can bookmark and share URLs
- ✅ **Browser back/forward** - Navigation works properly
- ✅ **SEO friendly** - Search engines can index your pages
- ✅ **Performance** - Added compression and caching
- ✅ **Security** - Added security headers

## Troubleshooting

### If .htaccess doesn't work:
1. **Check if mod_rewrite is enabled** on your Hostinger account
2. **Contact Hostinger support** to enable mod_rewrite
3. **Try a simpler .htaccess** with just the rewrite rules

### If you get 500 errors:
1. **Check .htaccess syntax** - Make sure there are no typos
2. **Remove security headers** if they cause issues
3. **Test with minimal .htaccess** first

### Alternative: Use Hash Router
If .htaccess doesn't work, you can use Hash Router in React:
```javascript
// In your React app, use HashRouter instead of BrowserRouter
import { HashRouter } from 'react-router-dom'
```

## Benefits

- **Better UX** - Users can refresh pages without errors
- **SEO friendly** - Search engines can crawl your site
- **Professional** - No more 404 errors on refresh
- **Performance** - Faster loading with compression and caching

---

**After adding the .htaccess file, your React SPA will work perfectly on Hostinger!** 🚀
