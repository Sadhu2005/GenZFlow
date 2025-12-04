# 🚀 GenZFlow Setup and Testing Guide

## Prerequisites
- Node.js (v18 or higher)
- MySQL database (local or remote)
- npm or yarn

---

## Step 1: Database Setup

### Option A: Using Local MySQL

1. **Create the database:**
```sql
CREATE DATABASE genzflow_db;
USE genzflow_db;
```

2. **Run the schema:**
```bash
# Using MySQL command line
mysql -u root -p genzflow_db < backend/database/schema.sql

# OR using MySQL Workbench/phpMyAdmin
# Copy and paste the contents of backend/database/schema.sql and execute
```

### Option B: Using Remote MySQL (Hostinger/Other)

1. Connect to your remote MySQL database
2. Create database: `genzflow_db`
3. Import the schema file: `backend/database/schema.sql`

**Verify the CEO user was created:**
```sql
SELECT id, name, email, role, password_change_required FROM employees WHERE email = 'sadhuj2005@gmail.com';
```

---

## Step 2: Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
# Copy the example file
cp env.example .env
```

4. **Edit `.env` file with your database credentials:**
```env
# Database Configuration
DB_HOST=localhost                    # or your remote MySQL host
DB_USER=root                         # your MySQL username
DB_PASSWORD=your_password            # your MySQL password
DB_NAME=genzflow_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

5. **Start the backend server:**
```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

**Expected output:**
```
✅ Database connected successfully
🚀 Server running on port 5000
📊 Environment: development
🌐 Frontend URL: http://localhost:5173
```

**Test backend health:**
```bash
# Open in browser or use curl
curl http://localhost:5000/api/health

# Should return:
# {"status":"OK","timestamp":"...","environment":"development"}
```

---

## Step 3: Frontend Setup

1. **Open a NEW terminal window** (keep backend running)

2. **Navigate to frontend directory:**
```bash
cd frontend
```

3. **Install dependencies:**
```bash
npm install
```

4. **Create `.env` file:**
```bash
# Copy the example file
cp env.example .env
```

5. **Edit `.env` file:**
```env
# For local development
VITE_API_URL=http://localhost:5000

# App Configuration
VITE_APP_NAME=GenZFlow
VITE_APP_VERSION=1.0.0
```

6. **Start the frontend:**
```bash
npm run dev
```

**Expected output:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## Step 4: Testing the Application

### Test 1: Login as CEO

1. **Open browser:** http://localhost:5173
2. **You should see the login page**
3. **Login with CEO credentials:**
   - Email: `sadhuj2005@gmail.com`
   - Password: `abcd@1234`
4. **Expected:** 
   - ✅ Login successful
   - ✅ Redirected to Dashboard
   - ✅ See CEO dashboard with company stats

### Test 2: Add a New Member

1. **Click on "Members" in the navbar** (only visible to CEO/Director/HR)
2. **Click "Add Member" button**
3. **Fill in the form:**
   - Name: `John Developer`
   - Email: `john@example.com`
   - Role: `Developer`
   - Bio: (optional)
4. **Click "Add Member"**
5. **Expected:**
   - ✅ Success message with default password: `GenZFlow@2024`
   - ✅ New member appears in the list
   - ✅ Member has default password set

### Test 3: Test First Login (Password Change Required)

1. **Logout** from CEO account
2. **Login with new member credentials:**
   - Email: `john@example.com`
   - Password: `GenZFlow@2024`
3. **Expected:**
   - ✅ Password change modal appears immediately
   - ✅ Cannot proceed without changing password
   - ✅ Modal shows "First Login" message
4. **Set new password:**
   - New Password: `MyNewPass123!`
   - Confirm Password: `MyNewPass123!`
5. **Click "Set Password"**
6. **Expected:**
   - ✅ Success message
   - ✅ Page reloads
   - ✅ Now logged in and can access dashboard
   - ✅ Password change modal doesn't appear again

### Test 4: Regular Password Change

1. **While logged in**, you can change password anytime
2. **The password change modal can be triggered** (you may need to add a button in profile settings)
3. **Test changing password:**
   - Current Password: `MyNewPass123!`
   - New Password: `AnotherPass456!`
   - Confirm Password: `AnotherPass456!`
4. **Expected:**
   - ✅ Password changed successfully
   - ✅ Can login with new password

### Test 5: Verify Registration is Disabled

1. **Try to access:** http://localhost:5173/register
2. **Expected:**
   - ✅ Route doesn't exist or redirects to login
   - ✅ No public registration available

### Test 6: Test Member Management Features

1. **As CEO, go to Members page**
2. **Test search functionality:**
   - Type in search box
   - Should filter members in real-time
3. **View member cards:**
   - Should show name, email, role, department
4. **Add multiple members** with different roles
5. **Verify all appear in the list**

---

## Step 5: API Testing (Optional)

### Test Backend API Directly

**1. Test Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sadhuj2005@gmail.com","password":"abcd@1234"}'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Sadhu J",
      "email": "sadhuj2005@gmail.com",
      "role": "CEO",
      "password_change_required": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**2. Test Create Employee (with token):**
```bash
# First get token from login response, then:
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "role": "Developer"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Employee created successfully. Default password: GenZFlow@2024 (must be changed on first login)",
  "data": {
    "id": 2,
    "name": "Test User",
    "email": "test@example.com",
    "role": "Developer",
    "default_password": "GenZFlow@2024",
    "password_change_required": true
  }
}
```

**3. Test Password Change:**
```bash
curl -X PUT http://localhost:5000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "newPassword": "NewPassword123!"
  }'
```

---

## Troubleshooting

### Database Connection Issues

**Error:** `Database connection failed`

**Solutions:**
1. Check MySQL is running: `mysql -u root -p`
2. Verify database exists: `SHOW DATABASES;`
3. Check `.env` file has correct credentials
4. Test connection: `mysql -u root -p -h localhost genzflow_db`

### Backend Not Starting

**Error:** `Port 5000 already in use`

**Solutions:**
1. Change PORT in `.env` to another port (e.g., 5001)
2. Kill process using port: `npx kill-port 5000` (Windows: `netstat -ano | findstr :5000`)

### Frontend Can't Connect to Backend

**Error:** `Network Error` or `CORS Error`

**Solutions:**
1. Verify backend is running on port 5000
2. Check `VITE_API_URL` in frontend `.env` is `http://localhost:5000`
3. Check backend CORS settings in `server.js`
4. Clear browser cache

### Login Fails

**Error:** `Invalid credentials`

**Solutions:**
1. Verify CEO user exists in database:
   ```sql
   SELECT * FROM employees WHERE email = 'sadhuj2005@gmail.com';
   ```
2. Check password hash is correct
3. Try resetting password in database if needed

### Password Change Modal Not Appearing

**Solutions:**
1. Check browser console for errors
2. Verify `password_change_required` is in user object
3. Check `AuthContext.jsx` is setting user correctly
4. Verify `PasswordChangeModal` is imported in `App.jsx`

---

## Quick Test Checklist

- [ ] Database created and schema imported
- [ ] CEO user exists in database
- [ ] Backend server running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can login as CEO
- [ ] Members page visible (CEO only)
- [ ] Can add new member
- [ ] Default password shown after adding member
- [ ] New member can login with default password
- [ ] Password change modal appears on first login
- [ ] Can set new password
- [ ] Can login with new password
- [ ] Registration route is disabled/removed
- [ ] Search works on Members page

---

## Next Steps After Testing

1. **Add more departments** in database if needed
2. **Create more members** with different roles
3. **Test task assignment** to new members
4. **Test org chart** with new hierarchy
5. **Deploy to production** when ready

---

## Support

If you encounter any issues:
1. Check the browser console (F12)
2. Check backend terminal for errors
3. Verify database connection
4. Check all environment variables are set correctly

**Happy Testing! 🎉**

