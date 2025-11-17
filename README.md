# 🛡️ Shield of Athena – Donation Section Rebuild

**Morgan Stanley Montréal Hackathon 2025**


![NestJS](https://img.shields.io/badge/NestJS-11.0.1-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-20.3.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.19+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-30.0.0-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Karma](https://img.shields.io/badge/Karma-6.4.0-0D8BBA?style=for-the-badge&logo=karma&logoColor=white)

---

## 📋 Overview

This project was developed in 4 days during the Morgan Stanley Montréal Hackathon 2025. Our team redesigned the website for Shield of Athena, a nonprofit organization that supports women, children, and ethnocultural communities through education, intervention, and prevention services.

## 🏗️ Project Architecture

### Global Structure

```
hackathon-morganstanley/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management module
│   │   ├── app.module.ts   # Main module
│   │   └── main.ts         # Entry point
│   ├── scripts/            # Utility scripts (seed, clear, etc.)
│   ├── test/               # E2E tests
│   └── package.json
├── frontend/               # Angular application
│   ├── src/
│   │   ├── app/            # Main components and routes
│   │   ├── components/     # Reusable components
│   │   ├── services/       # Angular services (API, Auth, Language, etc.)
│   │   ├── assets/         # Images, logos, etc.
│   │   └── environments/  # Environment configuration
│   └── package.json
├── setup-and-start.js      # Automatic startup script
├── script_mac_linux.sh     # Installation script (Mac/Linux)
├── script_window.ps1       # Installation script (Windows)
└── README.md
```


## 🚀 Installation and Configuration

### Step-by-Step Installation Guide

#### Step 1: Clone the Project

```bash
git clone https://github.com/bryanTRX/project-team
cd hackathon-morganstanley
```

#### Step 2: Install Dependencies

You have several options:

**Option A: Automatic Installation (Recommended)**

**On Windows (PowerShell):**
```powershell
.\script_window.ps1
```

**On Mac/Linux:**
```bash
chmod +x script_mac_linux.sh
./script_mac_linux.sh
```

**Option B: Manual Installation**

```bash
# From the project root
cd backend
npm install
cd ../frontend
npm install
cd ..
```

**Option C: Single Command Installation**

```bash
# From the project root
cd backend && npm install && cd ../frontend && npm install && cd ..
```

#### Step 4: Verify Installation

Verify that everything is installed correctly:

```bash
# Check Node.js
node --version  # Should display v20.19+ or v22.12+

# Check npm
npm --version

# Verify MongoDB is accessible (if local)
# On Windows: Check that the MongoDB service is running
# On Mac/Linux: mongod --version
```

#### Step 5: Launch the Project

**Option A: Automatic Startup Script (Recommended)**

```bash
# From the project root
node setup-and-start.js
```

This script:
- Automatically installs dependencies if needed
- Starts the backend on `http://localhost:3000`
- Starts the frontend on `http://localhost:4200`

**Option B: Manual Startup (2 terminals)**

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run start
# or if Angular CLI is installed globally:
npx ng serve
```

**Option C: Startup with concurrently**

```bash
# Install concurrently globally (once)
npm install -g concurrently

# From the project root
npx concurrently "cd backend && npm run start:dev" "cd frontend && npx ng serve"
```

#### Step 6: Access the Application

Once the servers are started:

- **Frontend**: [http://localhost:4200](http://localhost:4200)
- **Backend API**: [http://localhost:3000](http://localhost:3000)

---

## 📜 Available Commands

### Backend Commands (NestJS)

All commands must be executed from the `backend/` directory:

#### Development

```bash
cd backend
# Start without watch
npm run start
```

#### Build

```bash
cd backend

# Compile the project (production)
npm run build
```

#### Formatting and Linting

```bash
cd backend

# Format code with Prettier
npm run format

# Lint and auto-fix
npm run lint
```

### Frontend Commands (Angular)

All commands must be executed from the `frontend/` directory:

#### Development

```bash
cd frontend

# Start the development server
npm run start
# or
npx ng serve
```

#### Formatting

```bash
cd frontend

# Format code with Prettier
npm run format
```

### Global Commands (from root)

```bash
# Install dependencies for both projects
cd backend && npm install && cd ../frontend && npm install && cd ..

# Automatic startup (installation + startup)
node setup-and-start.js
```

---

## 📄 License

See the [LICENSE](LICENSE) file for more details.

---
