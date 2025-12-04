# ⚡ Quick Start Guide

## 🚀 Fast Setup (5 minutes)

### 1. Database Setup
```bash
# Create database
mysql -u root -p
CREATE DATABASE genzflow_db;
USE genzflow_db;
SOURCE backend/database/schema.sql;
EXIT;
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your database credentials
npm run dev
```

### 3. Frontend Setup (New Terminal)
```bash
cd frontend
npm install
cp env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000
npm run dev
```

### 4. Login
- Open: http://localhost:5173
- Email: `sadhuj2005@gmail.com`
- Password: `abcd@1234`

### 5. Add Members
- Click "Members" in navbar
- Click "Add Member"
- Fill form and submit
- Default password: `GenZFlow@2024`

---

## 📝 Environment Variables

### Backend `.env`
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=genzflow_db
DB_PORT=3306
JWT_SECRET=your_random_secret_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000
```

---

## ✅ Quick Test

1. ✅ Login as CEO
2. ✅ Add a member
3. ✅ Logout
4. ✅ Login as new member (default password)
5. ✅ Change password (required)
6. ✅ Access dashboard

**Done! 🎉**



