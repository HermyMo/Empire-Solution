# 🚀 SafeZone Gender-Safe Hub - Complete Setup & Run Guide

This guide will walk you through running the entire project from scratch.

---

## 📋 Prerequisites

Before starting, ensure you have installed:
- ✅ **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- ✅ **Python** (3.8-3.12 recommended) - [Download here](https://www.python.org/downloads/)
- ✅ **Bun** (optional, can use npm) - [Download here](https://bun.sh/)
- ✅ **Git** - [Download here](https://git-scm.com/)

---

## 🎯 Quick Start (3-Terminal Setup)

### Terminal 1️⃣: Backend Node Server (Port 3000)

```powershell
# Navigate to server directory
cd server

# Install dependencies (first time only)
npm install

# Start the backend server
node server.js
```

**Expected Output:**
```
Server running on port 3000
```

**What it does:** Handles authentication, password reset emails, SMS alerts, user data storage.

---

### Terminal 2️⃣: Python Chatbot Server (Port 5000)

```powershell
# Navigate to chatbot directory
cd chatbot

# Create virtual environment (first time only)
python -m venv .venv

# Activate virtual environment
.venv\Scripts\activate

# Install Python packages (first time only)
pip install -r requirements.txt

# Train the chatbot model (first time only)
python train_simple_model.py

# Start the chatbot server
python simple_chatbot_server.py
```

**Expected Output:**
```
🤖 Starting SafeSupport Chatbot Server...
✅ Model loaded successfully!
🚀 Server running on http://localhost:5000
```

**What it does:** AI chatbot with SA GBV resources (trained on 13 intents, 75 patterns).

---

### Terminal 3️⃣: Frontend Development Server (Port 5173)

```powershell
# Navigate to project root
cd C:\Users\serog\SafeZone\gender-safe-hub

# Install dependencies (first time only)
bun install
# OR if using npm:
# npm install

# Start the frontend dev server
bun run dev
# OR if using npm:
# npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**What it does:** React + TypeScript frontend with dashboard, auth, chatbot UI, panic button.

---

## 🌐 Access Your Application

Once all 3 terminals are running, open your browser:

- 🏠 **Homepage:** http://localhost:5173/
- 🔐 **Sign In:** http://localhost:5173/auth
- 📊 **Dashboard:** http://localhost:5173/dashboard (after login)
- 💬 **Chatbot:** Click the chat icon in bottom-right corner on dashboard
- 🔑 **Password Reset:** http://localhost:5173/request-reset

---

## 📝 Step-by-Step Detailed Instructions

### Step 1: Clone & Setup (First Time Only)

```powershell
# Clone the repository (if not already done)
git clone https://github.com/Seroganyane/gender-safe-hub.git
cd gender-safe-hub
```

### Step 2: Configure Environment Variables

#### Backend Server (.env in /server folder)

Create `server/.env` file:
```env
# Email Configuration (for password reset)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Vonage SMS (for panic button)
VONAGE_API_KEY=your-vonage-key
VONAGE_API_SECRET=your-vonage-secret
VONAGE_FROM_NUMBER=your-number

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Gmail Setup for Password Reset:**
1. Go to https://myaccount.google.com/apppasswords
2. Generate an "App Password"
3. Use that password in `EMAIL_PASSWORD` (not your regular Gmail password)

#### Chatbot Server (.env in /chatbot folder)

Create `chatbot/.env` file:
```env
FLASK_ENV=development
PORT=5000
```

### Step 3: Install All Dependencies

```powershell
# Frontend dependencies
bun install  # or npm install

# Backend dependencies
cd server
npm install
cd ..

# Python chatbot dependencies
cd chatbot
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python train_simple_model.py
cd ..
```

### Step 4: Start All Services

Open **3 separate PowerShell terminals** and run each command:

**Terminal 1 - Backend:**
```powershell
cd server
node server.js
```
✅ Keep running on port 3000

**Terminal 2 - Chatbot:**
```powershell
cd chatbot
.venv\Scripts\activate
python simple_chatbot_server.py
```
✅ Keep running on port 5000

**Terminal 3 - Frontend:**
```powershell
bun run dev  # or npm run dev
```
✅ Keep running on port 5173

### Step 5: Create Your First Account

1. Open http://localhost:5173/auth
2. Click "Sign Up"
3. Fill in your details:
   - Full Name
   - Email (use: seroganyanemathaba@gmail.com)
   - Phone Number (format: +27XXXXXXXXX)
   - Password (min 8 characters)
4. Click "Create Account"

### Step 6: Test All Features

#### ✅ Authentication
- Sign in with your email and password
- Try "Forgot Password" feature

#### ✅ Dashboard
- View your safe zone status
- Check emergency resources
- See quick action cards

#### ✅ AI Chatbot
- Click 💬 icon in bottom-right
- Try these messages:
  - "Hello" → Get greeting
  - "I need help urgently" → Get emergency numbers
  - "Where can I find legal help?" → Get Legal Aid SA info
  - "I need a shelter" → Get shelter resources
  - "I'm feeling depressed" → Get mental health support

#### ✅ Panic Button
- Click red panic button
- Sends SMS alerts to emergency contacts
- Shows 5-second countdown

---

## 🔧 Troubleshooting

### Problem: "Port already in use"

**Solution:**
```powershell
# Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Find and kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

### Problem: "Cannot find module" (Node.js)

**Solution:**
```powershell
cd server
rm -r node_modules
npm install
```

### Problem: Python package installation fails

**Solution:**
```powershell
# Use simplified requirements (no ML dependencies)
cd chatbot
pip install flask flask-cors python-dotenv nltk requests
```

### Problem: Chatbot not responding

**Solution:**
1. Check chatbot server is running (Terminal 2)
2. Check browser console (F12) for errors
3. Verify URL is http://localhost:5000 in chatbot.tsx
4. Ensure model is trained: `python train_simple_model.py`

### Problem: Password reset email not received

**Solution:**
1. Check Gmail App Password is correct in `server/.env`
2. Check spam/junk folder
3. Verify backend server is running (Terminal 1)
4. Check server console logs for errors

### Problem: "Failed to fetch" in browser

**Solution:**
- Ensure all 3 servers are running
- Check CORS is enabled (should be by default)
- Clear browser cache and reload

---

## 📦 Project Structure

```
gender-safe-hub/
├── server/                    # Node.js Backend (Port 3000)
│   ├── server.js             # Main API server
│   ├── mailer.js             # Email functionality
│   ├── users.json            # User database
│   └── .env                  # Backend config
│
├── chatbot/                   # Python AI Chatbot (Port 5000)
│   ├── simple_chatbot_server.py  # Flask API
│   ├── train_simple_model.py     # Training script
│   ├── training_data.json        # 13 intents, 75 patterns
│   ├── simple_chatbot_model.pkl  # Trained model
│   └── .env                      # Chatbot config
│
├── src/                       # React Frontend (Port 5173)
│   ├── pages/
│   │   ├── Dashboard.tsx     # Main dashboard (includes chatbot)
│   │   ├── Auth.tsx          # Login/Signup
│   │   └── RequestReset.tsx  # Password reset
│   ├── components/ui/
│   │   ├── chatbot.tsx       # Chat UI component
│   │   └── panic-button.tsx  # Emergency button
│   └── main.tsx              # App entry point
│
└── package.json              # Frontend dependencies
```

---

## 🎓 Development Workflow

### Making Changes

1. **Edit Code** - Make your changes in VS Code
2. **Frontend Auto-Reloads** - Vite hot-reloads automatically
3. **Backend Restart** - Stop (Ctrl+C) and restart `node server.js`
4. **Chatbot Restart** - Stop (Ctrl+C) and restart `python simple_chatbot_server.py`

### Retraining Chatbot

If you modify `training_data.json`:
```powershell
cd chatbot
.venv\Scripts\activate
python train_simple_model.py
# Restart server: Ctrl+C then python simple_chatbot_server.py
```

### Testing Password Reset

1. Go to http://localhost:5173/request-reset
2. Enter: seroganyanemathaba@gmail.com
3. Check your Gmail inbox (or spam)
4. Click the reset link in the email

---

## 📊 Monitoring & Logs

### Check Server Status

**Backend:**
```powershell
# Should show: Server running on port 3000
```

**Chatbot:**
```powershell
# Should show: Server running on http://localhost:5000
```

**Frontend:**
```powershell
# Should show: Local: http://localhost:5173/
```

### View Logs

- **Backend Logs:** Terminal 1 (API requests, errors)
- **Chatbot Logs:** Terminal 2 (chat requests, predictions)
- **Frontend Logs:** Browser Console (F12 → Console tab)

---

## 🚨 Important Notes

1. **All 3 servers must run simultaneously** for full functionality
2. **Python virtual environment** must be activated for chatbot
3. **Gmail App Password** required for password reset emails (not regular password)
4. **Phone numbers** must be in international format: +27XXXXXXXXX
5. **Chatbot model** must be trained before starting server (first time)
6. **Keep terminals open** - closing them stops the servers

---

## 🎉 Success Checklist

Before testing, verify:
- ✅ Backend server shows "Server running on port 3000"
- ✅ Chatbot server shows "Server running on http://localhost:5000"
- ✅ Frontend shows "Local: http://localhost:5173/"
- ✅ Browser opens http://localhost:5173/ successfully
- ✅ Can create account and sign in
- ✅ Dashboard loads without errors
- ✅ Chat icon appears in bottom-right corner
- ✅ Chatbot responds to messages
- ✅ Password reset email arrives in inbox

---

## 💡 Quick Commands Reference

```powershell
# Start everything (run in 3 separate terminals)
Terminal 1: cd server && node server.js
Terminal 2: cd chatbot && .venv\Scripts\activate && python simple_chatbot_server.py
Terminal 3: bun run dev

# Stop everything
Press Ctrl+C in each terminal

# Reinstall dependencies
Frontend: bun install (or npm install)
Backend: cd server && npm install
Chatbot: cd chatbot && pip install -r requirements.txt

# Retrain chatbot
cd chatbot && python train_simple_model.py

# Check running processes
netstat -ano | findstr :3000  # Backend
netstat -ano | findstr :5000  # Chatbot
netstat -ano | findstr :5173  # Frontend
```

---

## 📞 Support Resources in Chatbot

The chatbot provides these South African GBV resources:
- 🚨 GBV Command Centre: **0800 428 428**
- 👮 SAPS: **10111**
- 🆘 Rape Crisis: **021 447 9762**
- 💙 Lifeline SA: **0861 322 322**
- ⚖️ Legal Aid SA: **0800 110 110**
- 🏠 Shelters & Safe Houses
- 🧠 Mental Health Support
- 💰 Financial Assistance
- 📋 Safety Planning Tips

---

## 🏁 You're All Set!

Your SafeZone Gender-Safe Hub is now running! 🎉

Open http://localhost:5173/ and start exploring. The chatbot is ready to help with SA GBV resources and support.

**Happy coding! Stay safe! 💪**
