# 🍃 MongoDB Setup Guide for GenZFlow

## Quick Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

This will install `mongoose` instead of `mysql2`.

### 2. Configure MongoDB Connection

**Option A: Local MongoDB**
```env
# In backend/.env
MONGODB_URI=mongodb://localhost:27017/genzflow_db
# OR use individual settings:
DB_HOST=localhost
DB_PORT=27017
DB_NAME=genzflow_db
```

**Option B: MongoDB Atlas (Cloud)**
```env
# In backend/.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/genzflow_db?retryWrites=true&w=majority
```

**Option C: MongoDB Compass Connection String**
If you're using MongoDB Compass, copy the connection string from Compass and paste it:
```env
MONGODB_URI=mongodb://localhost:27017/genzflow_db
```

### 3. Update Environment Variables

Edit `backend/.env`:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/genzflow_db
# OR use:
DB_HOST=localhost
DB_PORT=27017
DB_NAME=genzflow_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 4. Seed the Database

Run the seed script to create initial data:
```bash
cd backend
node database/seed.js
```

This will create:
- ✅ CEO user (sadhuj2005@gmail.com / abcd@1234)
- ✅ Sample departments
- ✅ Sample employees
- ✅ Sample projects and tasks

### 5. Start the Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected: localhost:27017
🚀 Server running on port 5000
```

---

## Using MongoDB Compass

### Connect to Database

1. **Open MongoDB Compass**
2. **Enter connection string:**
   ```
   mongodb://localhost:27017
   ```
3. **Click Connect**

### View Collections

After seeding, you'll see:
- `employees` - All users
- `departments` - Company departments
- `projects` - Projects
- `tasks` - Tasks

### Verify CEO User

1. Click on `employees` collection
2. Find document with email: `sadhuj2005@gmail.com`
3. Verify it has:
   - `name`: "Sadhu J"
   - `role`: "CEO"
   - `password_change_required`: false

---

## Testing

### 1. Test Connection
```bash
# Start backend
cd backend
npm run dev

# Should see: ✅ MongoDB connected
```

### 2. Test Login
- Go to: http://localhost:5173
- Email: `sadhuj2005@gmail.com`
- Password: `abcd@1234`

### 3. Add Member
- Click "Members" → "Add Member"
- Create a new member
- Default password: `GenZFlow@2024`

---

## Troubleshooting

### MongoDB Not Running
**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
1. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   # OR
   brew services start mongodb-community
   ```

### Connection String Issues
**Error:** `MongoParseError: Invalid connection string`

**Solution:**
- Check your `MONGODB_URI` in `.env`
- For local: `mongodb://localhost:27017/genzflow_db`
- For Atlas: Use full connection string from Atlas dashboard

### Database Not Found
**Error:** Database doesn't exist

**Solution:**
- MongoDB creates databases automatically on first write
- Run seed script: `node database/seed.js`

### Port Already in Use
**Error:** `Port 27017 already in use`

**Solution:**
- Check if MongoDB is already running
- Or change port in connection string

---

## Differences from MySQL

### What Changed:
1. ✅ No SQL queries - uses Mongoose ODM
2. ✅ No JOINs - uses populate() for references
3. ✅ ObjectId instead of INT for IDs
4. ✅ Collections instead of tables
5. ✅ Documents instead of rows

### What Stayed the Same:
- ✅ Same API endpoints
- ✅ Same authentication
- ✅ Same frontend code
- ✅ Same business logic

---

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure `.env` with MongoDB connection
3. ✅ Run seed script: `node database/seed.js`
4. ✅ Start backend: `npm run dev`
5. ✅ Start frontend: `cd ../frontend && npm run dev`
6. ✅ Test login and add members

**You're all set! 🎉**



