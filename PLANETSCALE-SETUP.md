# PlanetScale Database Setup Guide

This guide will help you set up a free PlanetScale database for your GenZFlow backend.

## Step 1: Create PlanetScale Account

1. **Go to [planetscale.com](https://planetscale.com)**
2. **Click "Sign up"**
3. **Sign up with GitHub** (recommended)
4. **Verify your email**

## Step 2: Create Database

1. **Click "Create database"**
2. **Database name**: `genzflow`
3. **Region**: Choose closest to your users
4. **Plan**: Free (Hobby)
5. **Click "Create database"**

## Step 3: Get Connection Details

1. **Click on your database**
2. **Go to "Connect" tab**
3. **Click "Connect with" → "Node.js"**
4. **Copy the connection string**

Your connection string will look like:
```
mysql://root:password@aws.connect.psdb.cloud/genzflow?sslaccept=strict
```

## Step 4: Update Render Environment Variables

1. **Go to Render Dashboard**
2. **Select your backend service**
3. **Go to Environment tab**
4. **Update these variables:**

```
DB_HOST=aws.connect.psdb.cloud
DB_USER=root
DB_PASSWORD=your_planetscale_password
DB_NAME=genzflow
DB_PORT=3306
DB_SSL=true
```

## Step 5: Import Database Schema

1. **Go to PlanetScale dashboard**
2. **Click on your database**
3. **Go to "Console" tab**
4. **Run the SQL from `backend/database/schema.sql`**

## Step 6: Test Connection

1. **Deploy your backend**
2. **Check Render logs**
3. **Verify database connection succeeds**

## Benefits of PlanetScale

- ✅ **Free tier** with generous limits
- ✅ **MySQL-compatible** (no code changes needed)
- ✅ **External access** allowed
- ✅ **Automatic backups**
- ✅ **SSL connections**
- ✅ **No maintenance required**

## Alternative: Supabase (PostgreSQL)

If you prefer PostgreSQL:

1. **Go to [supabase.com](https://supabase.com)**
2. **Create free account**
3. **Create new project**
4. **Get connection details**
5. **Update backend to use PostgreSQL**

## Cost Comparison

| Service | Cost | Database Type | External Access |
|---------|------|---------------|-----------------|
| **PlanetScale** | Free | MySQL | ✅ |
| **Supabase** | Free | PostgreSQL | ✅ |
| **Hostinger** | $0 | MySQL | ❌ (requires upgrade) |
| **Railway** | Free | PostgreSQL | ✅ |

---

**PlanetScale is the easiest solution for your current setup!** 🚀
