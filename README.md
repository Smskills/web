# EduInsta CMS Deployment Guide

This project is a full-stack application with a React frontend and an Express backend.

## Deployment on Render

### 1. Create a New Web Service
- Connect your GitHub repository to Render.
- Select **Web Service**.

### 2. Configure Settings
- **Runtime:** Node
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Node Version:** Ensure it's set to 20 or higher (the `package.json` specifies this).

### 3. Environment Variables
Add the following environment variables in the Render dashboard:
- `NODE_ENV`: `production`
- `JWT_SECRET`: A long random string for security.
- `APP_URL`: `https://your-app-name.onrender.com`
- `DB_HOST`: (Optional) Your MySQL host. If omitted, it will use a local `db.json` file.
- `DB_USER`: (Optional) Your MySQL user.
- `DB_PASSWORD`: (Optional) Your MySQL password.
- `DB_NAME`: (Optional) Your MySQL database name.

## Local Development
1. `npm install`
2. `npm run dev` (Starts both frontend and backend)
