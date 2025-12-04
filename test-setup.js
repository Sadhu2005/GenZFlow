/**
 * Quick Setup Verification Script
 * Run this to check if everything is configured correctly
 * 
 * Usage: node test-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 GenZFlow Setup Verification\n');

let allGood = true;

// Check backend .env
console.log('1. Checking backend/.env...');
const backendEnvPath = path.join(__dirname, 'backend', '.env');
if (fs.existsSync(backendEnvPath)) {
  const backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
  const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
  const missing = required.filter(key => !backendEnv.includes(`${key}=`) || backendEnv.includes(`${key}=your_`));
  
  if (missing.length > 0) {
    console.log('   ❌ Missing or not configured:', missing.join(', '));
    allGood = false;
  } else {
    console.log('   ✅ Backend .env configured');
  }
} else {
  console.log('   ❌ backend/.env not found. Copy from env.example');
  allGood = false;
}

// Check frontend .env
console.log('\n2. Checking frontend/.env...');
const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
if (fs.existsSync(frontendEnvPath)) {
  const frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
  if (frontendEnv.includes('VITE_API_URL=http://localhost:5000') || frontendEnv.includes('VITE_API_URL=https://')) {
    console.log('   ✅ Frontend .env configured');
  } else {
    console.log('   ⚠️  VITE_API_URL should be set');
  }
} else {
  console.log('   ❌ frontend/.env not found. Copy from env.example');
  allGood = false;
}

// Check node_modules
console.log('\n3. Checking dependencies...');
const backendNodeModules = path.join(__dirname, 'backend', 'node_modules');
const frontendNodeModules = path.join(__dirname, 'frontend', 'node_modules');

if (fs.existsSync(backendNodeModules)) {
  console.log('   ✅ Backend dependencies installed');
} else {
  console.log('   ❌ Backend dependencies not installed. Run: cd backend && npm install');
  allGood = false;
}

if (fs.existsSync(frontendNodeModules)) {
  console.log('   ✅ Frontend dependencies installed');
} else {
  console.log('   ❌ Frontend dependencies not installed. Run: cd frontend && npm install');
  allGood = false;
}

// Check schema file
console.log('\n4. Checking database schema...');
const schemaPath = path.join(__dirname, 'backend', 'database', 'schema.sql');
if (fs.existsSync(schemaPath)) {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  if (schema.includes('sadhuj2005@gmail.com')) {
    console.log('   ✅ Schema includes CEO user');
  } else {
    console.log('   ⚠️  CEO user not found in schema');
  }
  if (schema.includes('password_change_required')) {
    console.log('   ✅ Schema includes password_change_required field');
  } else {
    console.log('   ❌ password_change_required field missing');
    allGood = false;
  }
} else {
  console.log('   ❌ Schema file not found');
  allGood = false;
}

// Summary
console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('✅ Setup looks good! You can proceed with testing.');
  console.log('\nNext steps:');
  console.log('1. Make sure MySQL is running');
  console.log('2. Import schema.sql to your database');
  console.log('3. Start backend: cd backend && npm run dev');
  console.log('4. Start frontend: cd frontend && npm run dev');
  console.log('5. Open http://localhost:5173 and login');
} else {
  console.log('❌ Some issues found. Please fix them before proceeding.');
  console.log('\nSee SETUP-AND-TEST-GUIDE.md for detailed instructions.');
}
console.log('='.repeat(50));



