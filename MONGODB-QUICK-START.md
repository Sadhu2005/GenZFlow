# 🍃 MongoDB Quick Start for GenZFlow

## ✅ What's Been Converted

Your project has been converted from MySQL to MongoDB! Here's what changed:

- ✅ Database connection (MongoDB/Mongoose)
- ✅ All models (Employee, Department, Project, Task)
- ✅ Auth routes (login, register, password change)
- ✅ Auth middleware
- ✅ Seed script with CEO user

## 🚀 Quick Setup (3 Steps)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

This installs `mongoose` (replaces `mysql2`).

### Step 2: Configure MongoDB

**Edit `backend/.env`:**
```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/genzflow_db

# OR for MongoDB Atlas (cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/genzflow_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 3: Seed Database & Start

```bash
# Seed the database (creates CEO user and sample data)
node database/seed.js

# Start the server
npm run dev
```

## 📋 CEO Login Credentials

After seeding:
- **Email:** `sadhuj2005@gmail.com`
- **Password:** `abcd@1234`

## 🎯 Using MongoDB Compass

1. **Open MongoDB Compass**
2. **Connect to:** `mongodb://localhost:27017`
3. **View database:** `genzflow_db`
4. **Collections:**
   - `employees` - Your users
   - `departments` - Company departments
   - `projects` - Projects
   - `tasks` - Tasks

## ⚠️ Important Notes

1. **MongoDB must be running** before starting the backend
2. **Run seed script** to create initial data
3. **ObjectId format:** IDs are now MongoDB ObjectIds (not integers)
4. **No SQL queries:** All queries use Mongoose methods

## 🐛 Troubleshooting

### MongoDB Not Running
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
# OR
brew services start mongodb-community
```

### Connection Error
- Check MongoDB is running
- Verify `MONGODB_URI` in `.env`
- For Compass: Use connection string from Compass

### Seed Script Fails
- Make sure MongoDB is running
- Check connection string is correct
- Database will be created automatically

## 📝 Next Steps

1. ✅ Install: `npm install`
2. ✅ Configure: Edit `.env` with MongoDB connection
3. ✅ Seed: `node database/seed.js`
4. ✅ Start: `npm run dev`
5. ✅ Test: Login with CEO credentials

**You're ready to go! 🎉**



