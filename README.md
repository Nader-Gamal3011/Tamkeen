# 🏥 MediFlow — Hospital Management System

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

A comprehensive, role-based Hospital Management System frontend built with React, Vite, and Tailwind CSS. MediFlow streamlines hospital operations for administrators, doctors, and receptionists.

---

## ✨ Features

### 🔐 Authentication
- JWT-based authentication with access & refresh tokens
- Role-based route protection (Admin, Doctor, Receptionist)
- Forgot password flow

### 👨‍💼 Admin Dashboard
- System-wide statistics and activity reports
- Staff account management (create doctors & receptionists)
- Pending account approval workflow
- Doctor schedule management
- User & patient management

### 👨‍⚕️ Doctor Dashboard
- Appointment tracking with status updates
- Patient detail management (vitals, medications, notes)
- Health report viewing
- Calendar integration
- Profile settings

### 📋 Receptionist Dashboard
- Patient registration with full demographics
- Appointment booking, editing & cancellation
- Real-time queue management with check-in
- Search, filter & pagination across all records
- Quick action shortcuts

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI component library |
| **Vite 6** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **React Router v7** | Client-side routing |
| **Recharts** | Dashboard charts & graphs |
| **React Icons (Lucide)** | Icon system |
| **Context API** | Global state management |
| **REST API** | Backend communication |

---

## 📦 Installation

### Prerequisites
- Node.js v18+
- npm v9+
- Backend API server running

### Setup

```bash
# Clone the repository
git clone https://github.com/Nader-Gamal3011/Nader_Portfolio.git

# Navigate to project
cd final-project

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=MediFlow
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Hospital Management System
```

---

## 🚀 Running the Project

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint check
npm run lint
```

---

## 📡 API Overview

The frontend communicates with a REST API at the configured `VITE_API_BASE_URL`.

### Key Endpoints

| Module | Endpoint | Method | Description |
|--------|----------|--------|-------------|
| Auth | `/auth/login` | POST | User login |
| Auth | `/auth/refresh-token` | POST | Refresh access token |
| Doctor | `/doctors/stats` | GET | Doctor dashboard stats |
| Doctor | `/doctors/appointments` | GET | Doctor appointments |
| Receptionist | `/receptionist/stats` | GET | Reception dashboard stats |
| Receptionist | `/receptionist/patients` | GET/POST | Patient CRUD |
| Receptionist | `/receptionist/appointments` | GET/POST | Appointment CRUD |
| Receptionist | `/receptionist/queue` | GET | Queue management |
| Admin | `/admin/doctors` | POST | Create doctor |
| Admin | `/admin/receptionists` | POST | Create receptionist |

---

## 🌐 Deployment

### Vercel / Netlify
1. Connect your Git repository
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variables
5. Deploy

### Railway
1. Connect repository
2. Add environment variables
3. Auto-deploys on push

---

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── config/         # Configuration arrays
├── context/        # React Context (Auth)
├── hooks/          # Custom API hooks
├── pages/          # Route-level pages
│   ├── Admin/      # Admin module
│   ├── Doctor/     # Doctor module
│   └── Reception/  # Receptionist module
├── styles/         # Additional CSS
└── utils/          # API client & helpers
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Nader Gamal**
- GitHub: [@Nader-Gamal3011](https://github.com/Nader-Gamal3011)