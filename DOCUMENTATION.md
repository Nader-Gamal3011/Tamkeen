# MediFlow — Hospital Management System

## Complete Technical Documentation

---

# 1. Project Overview

## Purpose

MediFlow is a comprehensive **Hospital Management System (HMS)** frontend application designed to digitize and streamline hospital operations. It provides role-based dashboards and management tools for administrators, doctors, and receptionists.

## Problem It Solves

- **Manual processes**: Replaces paper-based patient records, appointment scheduling, and queue management
- **Coordination gaps**: Provides real-time visibility into doctor schedules, patient queues, and appointment statuses
- **Data accessibility**: Centralizes patient medical records, vitals, medications, and treatment notes
- **Operational efficiency**: Automates appointment booking, patient check-in, and status tracking

## Main Features

| Feature | Description |
|---------|-------------|
| Role-Based Dashboards | Separate dashboards for Admin, Doctor, and Receptionist |
| Patient Management | Full CRUD for patient records, medical info, vitals, medications |
| Appointment Scheduling | Book, edit, cancel, and track appointments by type |
| Queue Management | Real-time patient queue with check-in and status advancement |
| Doctor Scheduling | Create and manage doctor availability and time slots |
| Staff Management | Admin can create doctor and receptionist accounts |
| Pending Account Approval | Admin approves or rejects new staff registrations |
| Activity Reports | Admin-level statistics and reporting |
| Password Recovery | Forgot/reset password flow |
| JWT Authentication | Secure access and refresh token mechanism |

## Target Users

- **Hospital Administrators** — System configuration, staff management, reports
- **Doctors** — View appointments, manage patient records, update medical information
- **Receptionists** — Register patients, book appointments, manage queue, handle billing

---

# 2. System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (This Project)            │
│  React 19 + Vite + Tailwind CSS + React Router v7   │
│                                                      │
│  ┌─────────┐  ┌─────────┐  ┌──────────────────────┐ │
│  │  Admin   │  │ Doctor  │  │   Receptionist       │ │
│  │  Pages   │  │  Pages  │  │     Pages            │ │
│  └────┬─────┘  └────┬────┘  └──────────┬───────────┘ │
│       │              │                  │             │
│  ┌────┴──────────────┴──────────────────┴──────────┐ │
│  │              Custom Hooks (API Layer)            │ │
│  └──────────────────────┬──────────────────────────┘ │
│                         │                            │
│  ┌──────────────────────┴──────────────────────────┐ │
│  │           apiClient.js (HTTP Layer)              │ │
│  │     JWT Auth · Auto Refresh · Error Handling     │ │
│  └──────────────────────┬──────────────────────────┘ │
└─────────────────────────┼─────────────────────────────┘
                          │ HTTP / REST API
                          ▼
              ┌───────────────────────┐
              │     Backend API       │
              │   (External Server)   │
              │  Node.js / Express    │
              │    MongoDB / Atlas    │
              └───────────────────────┘
```

## Design Patterns

| Pattern | Usage |
|---------|-------|
| **Custom Hooks Pattern** | Business logic and API calls abstracted into reusable hooks |
| **Container/Presentational** | Pages handle logic, components handle UI rendering |
| **Protected Route Pattern** | Role-based route guards via `ProtectedRoute` component |
| **Configuration-Driven UI** | Stats cards and sidebar menus driven by config arrays |
| **API Client Abstraction** | Centralized HTTP client with JWT interceptor pattern |
| **Context API** | Auth context for global user/token state management |

## Request Lifecycle

1. **User Action** → Component calls a custom hook function
2. **Hook** → Calls `apiRequest()` from `apiClient.js`
3. **apiClient** → Attaches JWT access token to `Authorization` header
4. **HTTP Request** → Sent to backend API
5. **401 Response** → `apiClient` attempts token refresh using refresh token
6. **Retry** → Original request is retried with new access token
7. **Refresh Failure** → User is logged out and redirected to `/login`
8. **Success** → Response data is returned to hook → state updated → UI re-renders

---

# 3. Technologies Used

| Technology | Purpose | Why |
|-----------|---------|-----|
| **React 19** | UI library | Component-based architecture, hooks, concurrent features |
| **Vite** | Build tool & dev server | Fast HMR, optimized builds, ES module support |
| **Tailwind CSS 4** | Utility-first CSS | Rapid UI development, consistent design system |
| **React Router v7** | Client-side routing | SPA navigation, nested routes, route guards |
| **React Icons** (Lucide) | Icon library | Consistent icon set with tree-shaking |
| **Recharts** | Data visualization | Lightweight React charting for dashboards |
| **Context API** | State management | Built-in React state for auth context |
| **JWT (Access + Refresh)** | Authentication | Stateless auth with automatic token refresh |
| **REST API** | Backend communication | Standard HTTP methods, JSON payloads |

---

# 4. Folder Structure

```
final-project/
├── index.html                    # Vite entry HTML
├── package.json                  # Dependencies and scripts
├── vite.config.js                # Vite configuration
├── eslint.config.js              # ESLint configuration
├── TODO.md                       # Development task tracker
├── data.text                     # Notes / reference data
│
├── public/
│   ├── favicon.svg               # Application favicon
│   ├── icons.svg                 # SVG icon sprite
│   └── imags/                    # Static images
│
└── src/
    ├── main.jsx                  # React DOM entry point
    ├── App.jsx                   # Root component with routing
    ├── index.css                 # Global styles (Tailwind + custom)
    │
    ├── assets/                   # Static assets (images, etc.)
    │
    ├── components/               # Reusable UI components
    │   ├── DashboardLayout.jsx   # Shell layout (sidebar + header + outlet)
    │   ├── Sidebar.jsx           # Navigation sidebar (role-based menus)
    │   ├── Header.jsx            # Top header bar with user info
    │   ├── ProtectedRoute.jsx    # Auth/role route guard
    │   ├── StateDoctor.jsx       # Statistics card widget
    │   ├── PatientManagement.jsx # Patient table component
    │   ├── AppointmentManagement.jsx # Appointment table component
    │   ├── CalendarComponent.jsx # Calendar view component
    │   ├── PatientInformation.jsx # Patient details wrapper
    │   ├── PatientInfo.jsx       # Patient personal info card
    │   ├── MedicalInfo.jsx       # Medical conditions display
    │   ├── EmergencyContact.jsx  # Emergency contact card
    │   ├── PatientAppointment.jsx # Patient appointment list
    │   ├── Vitals.jsx            # Patient vitals display/edit
    │   ├── Medications.jsx       # Medications list with add/edit
    │   ├── PatientNotes.jsx      # Doctor notes for patients
    │   ├── HealthReports.jsx     # Health report display
    │   ├── DoctorSetting.jsx     # Doctor settings/profile
    │   └── Reception/
    │       └── ReceptionWidgets.jsx # Status badges, queue badges, notifications
    │
    ├── config/                   # Configuration arrays
    │   ├── statsConfig.js        # Doctor dashboard stats card config
    │   └── receptionStatsConfig.js # Reception dashboard stats config
    │
    ├── context/                  # React Context providers
    │   └── AuthContext.jsx       # Authentication context (user, tokens)
    │
    ├── data/                     # Static/mock data
    │
    ├── hooks/                    # Custom React hooks (API layer)
    │   ├── useDoctorStats.js     # Doctor dashboard statistics
    │   ├── usePatientDetails.js  # Single patient data fetcher
    │   ├── usePatientAppointments.js # Patient's appointment list
    │   ├── useAllApointments.js  # All appointments for doctor
    │   ├── useUpdateVitals.js    # Update patient vitals
    │   ├── useUpdateMedication.js # Update patient medications
    │   ├── useUpdatePatientNotes.js # Update patient notes
    │   ├── useReceptionistStats.js # Reception dashboard statistics
    │   ├── useReceptionistPatients.js # Patient list with search/filter/pagination
    │   ├── useReceptionistAppointments.js # Today's appointments (reception)
    │   ├── useReceptionistAllAppointments.js # All appointments with CRUD
    │   ├── useReceptionistQueue.js # Queue management with check-in/status
    │   ├── useLiveQueue.js       # Live queue data for dashboard
    │   └── useAdminCreateStaff.js # Admin staff creation
    │
    ├── pages/                    # Route-level page components
    │   ├── Login.jsx             # Login page
    │   ├── ForgotPassword.jsx    # Password reset page
    │   ├── Doctor/
    │   │   ├── Doctor_Dashboard.jsx # Doctor main dashboard
    │   │   ├── Doctor_Appointments.jsx # Doctor appointments view
    │   │   └── DoctorPatientDetails.jsx # Doctor patient detail view
    │   ├── Reception/
    │   │   ├── Reception_Dashboard.jsx # Reception main dashboard
    │   │   ├── Reception_Appointments.jsx # Appointment management
    │   │   ├── Reception_QueueManagement.jsx # Queue management
    │   │   ├── Reception_PatientManagement.jsx # Patient registration/list
    │   │   ├── Reception_PatientDetails.jsx # Patient detail view
    │   │   └── Reception_BookingRequests.jsx # Booking requests
    │   └── Admin/
    │       ├── Admin_Dashboard.jsx # Admin main dashboard
    │       ├── Admin_UserManagement.jsx # User management
    │       ├── Admin_DoctorManagement.jsx # Doctor management
    │       ├── Admin_PatientManagement.jsx # Patient management
    │       ├── Admin_DoctorsSchedule.jsx # Doctor schedule management
    │       ├── Admin_CreateStaff.jsx # Create staff accounts
    │       ├── Admin_PendingAccounts.jsx # Pending account approvals
    │       └── Admin_ActivityReports.jsx # Activity reports
    │
    ├── styles/                   # Additional CSS styles
    │   └── calendar.css          # Calendar component styles
    │
    └── utils/                    # Utility functions
        ├── apiClient.js          # HTTP client with JWT interceptor
        ├── auth.js               # Auth token helpers (get, set, clear)
        └── refreshToken.js       # Token refresh logic
```

---

# 5. Environment Variables

| Variable | Required | Purpose | Example |
|----------|----------|---------|---------|
| `VITE_API_BASE_URL` | Yes | Backend API base URL | `http://localhost:5000/api` |
| `VITE_DEFAULT_AVATAR_URL` | No | Default avatar placeholder | `https://example.com/avatar.png` |
| `VITE_DEFAULT_PATIENT_PHOTO` | No | Default patient photo | `https://example.com/patient.png` |
| `VITE_APP_NAME` | No | Application display name | `MediFlow` |
| `VITE_APP_VERSION` | No | Application version | `1.0.0` |
| `VITE_APP_DESCRIPTION` | No | Application description | `Hospital Management System` |

> **Note**: Vite exposes only variables prefixed with `VITE_` to the client bundle.

---

# 6. Database Documentation

> **This is a frontend-only project.** The database models are inferred from the API request/response structures observed in the frontend code. The actual backend uses MongoDB.

## Inferred Data Models

### User

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier |
| `fullName` | String | User's full name |
| `email` | String | User email (unique) |
| `password` | String | Hashed password |
| `gender` | String | `male` \| `female` |
| `age` | Number | User's age |
| `phone` | String | Phone number |
| `address` | String | Physical address |
| `role` | String | `admin` \| `doctor` \| `receptionist` \| `patient` |
| `isActive` | Boolean | Account active status |
| `avatar` | String | Profile image URL |

### Doctor (extends User)

| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId (ref → User) | Associated user account |
| `specialty` / `specialization` | String | Medical specialty |
| `schedule` | Array | Available time slots |

### Patient (extends User)

| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId (ref → User) | Associated user account |
| `patientId` | String | Auto-generated patient code |
| `dateOfBirth` | Date | Date of birth |
| `occupation` | String | Patient's occupation |
| `bloodType` | String | Blood type (`A+`, `O-`, etc.) |
| `insuranceProvider` | String | Insurance company |
| `insuranceClass` | String | Insurance tier/class |
| `patientType` | String | `outpatient` \| `inpatient` |
| `currentStatus` | String | `inTreatment` \| `admitted` \| `discharged` |
| `doctorId` | ObjectId (ref → Doctor) | Assigned primary doctor |
| `medicalInfo` | Object | Medical conditions, allergies, etc. |
| `emergencyContact` | Object | `{ name, phone, relation }` |
| `vitals` | Object | `{ bp, temperature, heartRate, weight, height, spO2, respiratoryRate, glucose }` |
| `medications` | Array | List of prescribed medications |
| `notes` | Array | Doctor notes with timestamps |

### Appointment

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier |
| `patientId` | ObjectId (ref → Patient) | Patient reference |
| `doctorId` | ObjectId (ref → Doctor) | Doctor reference |
| `appointmentType` | String | `consultation` \| `followUp` \| `surgery` |
| `date` | Date | Appointment date |
| `startTime` | String | Start time (HH:MM) |
| `endTime` | String | End time (HH:MM) |
| `status` | String | `scheduled` \| `waiting` \| `withDoctor` \| `completed` \| `canceled` |
| `notes` | String | Appointment notes |

### QueueEntry

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier |
| `appointmentId` | ObjectId (ref → Appointment) | Associated appointment |
| `patientId` | ObjectId (ref → Patient) | Patient reference |
| `status` | String | `Waiting` \| `With Doctor` \| `Completed` |
| `queueNumber` | Number | Position in queue |

### DoctorSchedule

| Field | Type | Description |
|-------|------|-------------|
| `doctorId` | ObjectId (ref → Doctor) | Doctor reference |
| `date` | Date | Schedule date |
| `startTime` | String | Slot start time |
| `endTime` | String | Slot end time |
| `isAvailable` | Boolean | Slot availability |

## Relationships

```
User ──────┬── Doctor (1:1)
           ├── Patient (1:1)
           ├── Receptionist (1:1)
           └── Admin (1:1)

Doctor ────── Appointments (1:N)
Doctor ────── Schedules (1:N)
Doctor ────── Patients (1:N, assigned)

Patient ────── Appointments (1:N)
Patient ────── Vitals (1:1, embedded)
Patient ────── Medications (1:N, embedded)
Patient ────── Notes (1:N, embedded)

Appointment ── QueueEntry (1:1)
```

---

# 7. API Documentation

> **Base URL**: Configured via `VITE_API_BASE_URL` (default: `http://localhost:5000/api`)

## Authentication Endpoints

### POST `/auth/login`

| Property | Value |
|----------|-------|
| **Description** | Authenticate user and receive tokens |
| **Auth Required** | No |
| **Request Body** | `{ "email": "string", "password": "string" }` |
| **Success Response** | `{ "success": true, "data": { "user": {...}, "accessToken": "string", "refreshToken": "string" } }` |
| **Error Response** | `{ "success": false, "message": "Invalid credentials" }` |

### POST `/auth/refresh-token`

| Property | Value |
|----------|-------|
| **Description** | Refresh expired access token |
| **Auth Required** | No (uses refresh token) |
| **Request Body** | `{ "refreshToken": "string" }` |
| **Success Response** | `{ "success": true, "data": { "accessToken": "string" } }` |

### POST `/auth/forgot-password`

| Property | Value |
|----------|-------|
| **Description** | Send password reset email |
| **Auth Required** | No |
| **Request Body** | `{ "email": "string" }` |

### POST `/auth/reset-password`

| Property | Value |
|----------|-------|
| **Description** | Reset password with token |
| **Auth Required** | No |
| **Request Body** | `{ "token": "string", "newPassword": "string" }` |

---

## Doctor Endpoints

### GET `/doctors`

| Property | Value |
|----------|-------|
| **Description** | List all doctors |
| **Auth Required** | Yes |
| **Query Params** | `limit` (number), `search` (string) |
| **Success Response** | `{ "success": true, "data": [Doctor] }` |

### GET `/doctors/stats`

| Property | Value |
|----------|-------|
| **Description** | Doctor dashboard statistics |
| **Auth Required** | Yes (Doctor role) |
| **Success Response** | `{ "success": true, "data": { "total", "scheduled", "withDoctor", "completed" } }` |

### GET `/doctors/appointments`

| Property | Value |
|----------|-------|
| **Description** | Get doctor's appointments |
| **Auth Required** | Yes (Doctor role) |

### GET `/doctors/patients/:id`

| Property | Value |
|----------|-------|
| **Description** | Get patient details for doctor |
| **Auth Required** | Yes (Doctor role) |
| **Params** | `id` — Patient ID |

### PATCH `/doctors/patients/:id/vitals`

| Property | Value |
|----------|-------|
| **Description** | Update patient vitals |
| **Auth Required** | Yes (Doctor role) |
| **Request Body** | `{ "bp": "string", "temperature": "string", "heartRate": "string", ... }` |

### PATCH `/doctors/patients/:id/medications`

| Property | Value |
|----------|-------|
| **Description** | Update patient medications |
| **Auth Required** | Yes (Doctor role) |
| **Request Body** | `{ "medications": [{ "name", "dose", "frequency" }] }` |

### PATCH `/doctors/patients/:id/notes`

| Property | Value |
|----------|-------|
| **Description** | Add/update patient notes |
| **Auth Required** | Yes (Doctor role) |
| **Request Body** | `{ "notes": "string" }` |

---

## Receptionist Endpoints

### GET `/receptionist/stats`

| Property | Value |
|----------|-------|
| **Description** | Receptionist dashboard statistics |
| **Auth Required** | Yes (Receptionist role) |
| **Success Response** | `{ "success": true, "data": { "todayAppointments", "completedToday", "inQueue", "totalPatients", "pendingBills", "todayRevenue", "withDoctor", "cancelledToday", "currentlyAdmitted", "appointments", "queue", "notifications" } }` |

### GET `/receptionist/today`

| Property | Value |
|----------|-------|
| **Description** | Today's appointments grouped by doctor |
| **Auth Required** | Yes (Receptionist role) |
| **Success Response** | `{ "success": true, "data": { "Doctor Name": [Appointment] } }` |

### GET `/receptionist/patients`

| Property | Value |
|----------|-------|
| **Description** | List patients with filters |
| **Auth Required** | Yes (Receptionist role) |
| **Query Params** | `search`, `gender`, `type`, `status`, `page`, `limit` |
| **Success Response** | `{ "success": true, "data": [Patient], "pagination": { "total": number } }` |

### POST `/receptionist/patients`

| Property | Value |
|----------|-------|
| **Description** | Register a new patient |
| **Auth Required** | Yes (Receptionist role) |
| **Request Body** | `{ "fullName", "email", "password", "gender", "age", "dateOfBirth", "phone", "address", "occupation", "bloodType", "insuranceProvider", "insuranceClass", "patientType", "emergencyContact": { "name", "phone", "relation" } }` |

### GET `/receptionist/appointments`

| Property | Value |
|----------|-------|
| **Description** | List all appointments with filters |
| **Auth Required** | Yes (Receptionist role) |
| **Query Params** | `status`, `date`, `page`, `limit` |
| **Success Response** | `{ "success": true, "data": [Appointment], "pagination": { "totalPages", "total" } }` |

### POST `/receptionist/appointments`

| Property | Value |
|----------|-------|
| **Description** | Book a new appointment |
| **Auth Required** | Yes (Receptionist role) |
| **Request Body** | `{ "patientId", "doctorId", "appointmentType", "date", "startTime", "endTime", "notes" }` |

### PUT `/receptionist/appointments/:id`

| Property | Value |
|----------|-------|
| **Description** | Update an existing appointment |
| **Auth Required** | Yes (Receptionist role) |
| **Params** | `id` — Appointment ID |
| **Request Body** | `{ "patientId", "doctorId", "appointmentType", "date", "startTime", "endTime", "notes" }` |

### PATCH `/receptionist/appointments/:id/cancel`

| Property | Value |
|----------|-------|
| **Description** | Cancel an appointment |
| **Auth Required** | Yes (Receptionist role) |
| **Params** | `id` — Appointment ID |

### GET `/receptionist/queue`

| Property | Value |
|----------|-------|
| **Description** | Get all doctor queues |
| **Auth Required** | Yes (Receptionist role) |
| **Success Response** | `{ "success": true, "data": [{ "doctorId": "...", "entries": [QueueEntry] }] }` |

### GET `/receptionist/queue/:doctorId`

| Property | Value |
|----------|-------|
| **Description** | Get queue for a specific doctor |
| **Auth Required** | Yes (Receptionist role) |
| **Success Response** | `{ "success": true, "data": [QueueEntry] }` |

### PATCH `/receptionist/queue/:appointmentId/checkin`

| Property | Value |
|----------|-------|
| **Description** | Check in a patient to queue |
| **Auth Required** | Yes (Receptionist role) |

### PATCH `/receptionist/queue/:appointmentId/status`

| Property | Value |
|----------|-------|
| **Description** | Advance patient queue status |
| **Auth Required** | Yes (Receptionist role) |

---

## Admin Endpoints

### POST `/admin/doctors`

| Property | Value |
|----------|-------|
| **Description** | Create a new doctor account |
| **Auth Required** | Yes (Admin role) |
| **Request Body** | `{ "fullName", "email", "password", "specialty", ... }` |

### POST `/admin/receptionists`

| Property | Value |
|----------|-------|
| **Description** | Create a new receptionist account |
| **Auth Required** | Yes (Admin role) |
| **Request Body** | `{ "fullName", "email", "password", ... }` |

> **Note**: Additional admin endpoints for user management, pending accounts, activity reports, doctor management, and schedule management are consumed by the admin pages but the exact endpoint signatures are determined by the backend API.

---

# 8. Authentication & Authorization

## Login Flow

```
1. User submits email + password on Login page
2. POST /auth/login → Backend validates credentials
3. Backend returns { user, accessToken, refreshToken }
4. Tokens stored in localStorage via auth.js helpers
5. User object stored in AuthContext (React Context)
6. User redirected to role-specific dashboard:
   - admin       → /admin/dashboard
   - doctor      → /doctor/dashboard
   - receptionist → /reception/dashboard
```

## JWT Usage

| Token | Storage | Lifetime | Purpose |
|-------|---------|----------|---------|
| **Access Token** | localStorage | Short-lived (e.g., 15 min) | Authenticate API requests |
| **Refresh Token** | localStorage | Long-lived (e.g., 7 days) | Obtain new access tokens |

### Token Attachment

Every API request through `apiClient.js`:
```
Authorization: Bearer <accessToken>
```

### Automatic Token Refresh

```
1. API request returns 401 Unauthorized
2. apiClient intercepts the error
3. Calls POST /auth/refresh-token with refreshToken
4. On success: updates stored accessToken, retries original request
5. On failure: clears all tokens, redirects to /login
```

## Password Hashing

- Handled on the **backend** (bcrypt)
- Frontend sends plaintext password over HTTPS
- No passwords stored in frontend

## Roles

| Role | Access Level |
|------|-------------|
| `admin` | Full system access, staff management, reports |
| `doctor` | Patient records, appointments, medical data |
| `receptionist` | Patient registration, appointments, queue, billing |

## Protected Routes

The `ProtectedRoute` component:
1. Checks if user is authenticated (token exists in context)
2. Verifies user role matches required role(s)
3. Redirects to `/login` if unauthorized
4. Redirects to appropriate dashboard if wrong role

## Middleware (Frontend Route Guards)

```jsx
<Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
  {/* Admin routes */}
</Route>
<Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
  {/* Doctor routes */}
</Route>
<Route element={<ProtectedRoute allowedRoles={["receptionist"]} />}>
  {/* Receptionist routes */}
</Route>
```

## Security Flow Diagram

```
┌──────────┐     ┌──────────────┐     ┌──────────┐
│  Login   │────▶│  Auth API    │────▶│  Tokens  │
│  Page    │     │  /auth/login │     │  Stored  │
└──────────┘     └──────────────┘     └────┬─────┘
                                           │
              ┌────────────────────────────┘
              ▼
┌──────────────────┐     ┌─────────────────┐
│  apiClient.js    │────▶│  API Request    │
│  Attaches Bearer │     │  + JWT Header   │
└──────────────────┘     └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
            ┌──────────────┐          ┌──────────────┐
            │   200 OK     │          │   401 Error  │
            │   Return Data│          │   Try Refresh│
            └──────────────┘          └──────┬───────┘
                                             │
                               ┌─────────────┴─────────────┐
                               ▼                           ▼
                       ┌──────────────┐          ┌──────────────┐
                       │ Refresh OK   │          │ Refresh Fail │
                       │ Retry Request│          │ → /login     │
                       └──────────────┘          └──────────────┘
```

---

# 9. Business Logic

## Module: Authentication (`Login.jsx`, `ForgotPassword.jsx`)

- Login validates email/password against backend
- On success, tokens are stored and user is context-persisted
- Forgot password sends email with reset link
- Auth context provides `user`, `isAuthenticated`, `login()`, `logout()` globally

## Module: Admin Management

- **User Management**: View, search, and manage all system users
- **Doctor Management**: View list of doctors, manage doctor profiles
- **Patient Management**: Admin-level patient record viewing
- **Create Staff**: Create new doctor or receptionist accounts via dedicated forms
- **Pending Accounts**: Review and approve/reject pending staff registrations
- **Doctor Schedules**: Create and manage doctor availability time slots
- **Activity Reports**: View system-wide statistics and activity data

## Module: Doctor Workflow

- **Dashboard**: Displays today's stats (appointments total, waiting, with doctor, completed)
- **Appointments**: Lists all assigned appointments with status tracking
- **Patient Details**: Full patient view with tabs for:
  - Personal info (name, age, gender, contact)
  - Medical info (conditions, allergies)
  - Emergency contacts
  - Vitals (BP, temperature, heart rate, weight, height, SpO2)
  - Medications (add/edit prescriptions)
  - Notes (clinical notes with timestamps)
  - Health reports
  - Appointment history

## Module: Receptionist Workflow

- **Dashboard**: Stats cards (today's appointments, total patients, in queue), quick actions, live queue, appointments table, notifications
- **Appointments**: Full CRUD — search, filter by status/date, paginate, book new, edit, cancel
- **Queue Management**: Real-time queue per doctor, check-in patients, advance status (Waiting → With Doctor → Completed)
- **Patient Management**: Register new patients with full demographic/insurance data, search, filter by gender/type/status
- **Booking Requests**: Manage incoming booking requests
- **Patient Details**: View comprehensive patient information

## Module: Queue Management

```
Patient arrives → Receptionist checks in → Status: "Waiting"
                                            ↓
Receptionist advances status → Status: "With Doctor"
                                            ↓
Doctor completes consultation → Status: "Completed"
```

---

# 10. Validation

## Frontend Validation

| Field | Rules |
|-------|-------|
| Email | Required, valid email format (`type="email"`) |
| Password | Required, minimum 6 characters |
| Full Name | Required |
| Phone | Required, tel format |
| Age | Required, 0-150 range |
| Date | Required, valid date format |
| Time | Required, valid time format (HH:MM) |
| Patient ID | Required for appointment booking |
| Doctor ID | Required for appointment booking |

## Form-Level Validation

- All registration forms use HTML5 `required` attributes
- Custom validation in `handleSubmit` functions checks for required fields before API submission
- Error messages displayed inline below forms
- Submit buttons disabled during loading states

---

# 11. Middleware

## ProtectedRoute Component

**Execution**: Before any protected route renders

**Logic**:
1. Reads user from `AuthContext`
2. If no user/token → redirect to `/login`
3. If user role not in `allowedRoles` → redirect to appropriate dashboard
4. If authorized → render child routes via `<Outlet />`

## apiClient Interceptor

**Execution**: Before and after every API request

**Logic**:
1. **Pre-request**: Reads access token from localStorage, attaches to `Authorization` header
2. **Post-response**: If 401 error, attempts token refresh
3. **Refresh success**: Updates token, retries original request
4. **Refresh failure**: Clears auth data, redirects to `/login`

## DashboardLayout

**Execution**: Wraps all dashboard routes

**Logic**:
1. Renders `Sidebar` with role-based navigation
2. Renders `Header` with user info and logout
3. Renders child routes via `<Outlet />`

---

# 12. Error Handling

## Global Strategy

| Level | Method |
|-------|--------|
| **API Client** | Catches HTTP errors, handles 401 with token refresh |
| **Custom Hooks** | Try/catch blocks, store error in state, return to components |
| **Components** | Display error messages in UI (red text, error banners) |
| **Forms** | Display validation and submission errors inline |
| **Loading States** | Show loading indicators during async operations |

## Error Response Format

```json
{
  "success": false,
  "message": "Error description here"
}
```

## Error Handling Pattern (Hooks)

```javascript
const [error, setError] = useState("");

try {
  const res = await apiRequest("/endpoint");
  const result = await res.json();
  if (!result.success) {
    setError(result.message);
    return;
  }
  // Handle success
} catch (err) {
  setError(`Something went wrong: ${err.message}`);
} finally {
  setLoading(false);
}
```

---

# 13. File Uploads

> **Current Status**: The frontend includes placeholder UI for health reports and profile photos, but no file upload implementation was found in the codebase. File upload functionality appears to be planned but not yet implemented.

### Observed UI Elements

- Patient photo placeholder with default avatar
- Health reports section in patient details (display only)

### Recommendations

- Implement file upload via `FormData` and `multipart/form-data`
- Support image uploads for patient/doctor profiles
- Support document uploads for health reports
- Add file type validation (jpg, png, pdf)
- Add file size limits (e.g., 5MB)

---

# 14. Security

## Implemented Security Measures

| Measure | Implementation |
|---------|---------------|
| **JWT Authentication** | Access + refresh token pair stored in localStorage |
| **Token Refresh** | Automatic refresh on 401 responses |
| **Role-Based Access** | ProtectedRoute enforces role restrictions |
| **Password Hashing** | Handled server-side (bcrypt) |
| **CORS** | Configured on backend |
| **Input Validation** | HTML5 required fields + custom validation |
| **HTTPS** | Expected in production deployment |
| **Environment Variables** | Sensitive config via `.env` files (not committed) |

## Security Concerns & Recommendations

| Concern | Recommendation |
|---------|---------------|
| Tokens in localStorage | Consider httpOnly cookies for XSS protection |
| No CSRF protection | Implement CSRF tokens for state-changing requests |
| No rate limiting on frontend | Backend should implement rate limiting |
| Console.log statements | Remove debug `console.log` calls before production |
| No content security policy | Add CSP headers |
| No input sanitization | Add DOMPurify or similar for user-generated content |

---

# 15. Application Flow

## Startup Sequence

```
1. index.html loads
2. main.jsx renders <App /> into DOM
3. App.jsx:
   a. AuthContext wraps the entire app
   b. React Router initializes routes
   c. AuthContext checks for existing tokens in localStorage
   d. If tokens exist → validate and restore user session
   e. If no tokens → user is unauthenticated
4. Route matching:
   - "/" → redirect to /login
   - "/login" → Login page
   - "/forgot-password" → ForgotPassword page
   - "/admin/*" → ProtectedRoute(admin) → DashboardLayout → Admin pages
   - "/doctor/*" → ProtectedRoute(doctor) → DashboardLayout → Doctor pages
   - "/reception/*" → ProtectedRoute(receptionist) → DashboardLayout → Reception pages
```

## User Session Flow

```
Login → Store tokens → Set user in context → Redirect to dashboard
  │
  ├── Navigate app (protected routes check role)
  │
  ├── API calls (apiClient attaches JWT)
  │     ├── 200 → process data
  │     └── 401 → refresh token → retry or logout
  │
  └── Logout → Clear tokens → Clear context → Redirect to /login
```

---

# 16. Deployment

## Local Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with required variables
4. Start dev server: `npm run dev`

## Production Build

```bash
npm run build
```

Output is generated in `/dist` folder — a static SPA that can be served by any web server.

## Deployment Options

### Vercel / Netlify
1. Connect Git repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables in dashboard
5. Deploy

### Railway
1. Connect Git repository
2. Railway auto-detects Vite project
3. Add environment variables
4. Deploy automatically on push

### Manual Server (Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## MongoDB Atlas Configuration

- Create cluster on MongoDB Atlas
- Whitelist server IP addresses
- Create database user with appropriate permissions
- Use connection string in backend `MONGODB_URI` environment variable

---

# 17. Installation Guide

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **Backend API** server running (separate repository)

## Steps

```bash
# 1. Clone the repository
git clone https://github.com/Nader-Gamal3011/Nader_Portfolio.git

# 2. Navigate to project directory
cd final-project

# 3. Install dependencies
npm install

# 4. Create environment file
copy .env.example .env    # Windows
cp .env.example .env      # macOS/Linux

# 5. Edit .env with your configuration
# VITE_API_BASE_URL=http://localhost:5000/api

# 6. Start development server
npm run dev
```

---

# 18. Running the Project

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start Vite development server (hot reload) |
| `npm run build` | Create production build in `/dist` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code analysis |

---

# 19. Project Features

## Feature Checklist

### Authentication
- [x] User login with email/password
- [x] JWT access + refresh token system
- [x] Automatic token refresh on 401
- [x] Forgot password flow
- [x] Role-based route protection
- [x] Logout with session cleanup

### Admin Module
- [x] Admin dashboard with statistics
- [x] User management
- [x] Doctor management
- [x] Patient management (view)
- [x] Create staff accounts (doctors, receptionists)
- [x] Pending account approval
- [x] Doctor schedule management
- [x] Activity reports

### Doctor Module
- [x] Doctor dashboard with statistics
- [x] Appointment list and management
- [x] Patient details view
- [x] Update patient vitals
- [x] Update patient medications
- [x] Add patient notes
- [x] Health reports view
- [x] Calendar view
- [x] Doctor settings/profile

### Receptionist Module
- [x] Receptionist dashboard with statistics
- [x] Patient registration (full demographic data)
- [x] Patient list with search, filter, pagination
- [x] Appointment booking
- [x] Appointment editing
- [x] Appointment cancellation
- [x] Appointment search and filters
- [x] Real-time queue management
- [x] Patient check-in
- [x] Queue status advancement
- [x] Quick action buttons
- [x] Notification display

### UI/UX
- [x] Responsive sidebar navigation
- [x] Role-based menu items
- [x] Statistics card widgets
- [x] Status badges with color coding
- [x] Avatar with initials and color hashing
- [x] Loading states and skeletons
- [x] Error state displays
- [x] Modal dialogs for forms
- [x] Confirmation dialogs for destructive actions
- [x] Pagination controls
- [x] Search and filter toolbar

---

# 20. Future Improvements

## High Priority

| Improvement | Description |
|-------------|-------------|
| **Real-time Updates** | Implement WebSocket for live queue updates and notifications |
| **File Uploads** | Support profile images, health report documents, lab results |
| **Print Support** | Printable prescriptions, patient summaries, reports |
| **i18n / Localization** | Multi-language support (Arabic/English) |
| **Dark Mode** | Theme toggle for better accessibility |

## Medium Priority

| Improvement | Description |
|-------------|-------------|
| **Search Enhancement** | Global search across patients, doctors, appointments |
| **Notifications System** | Real-time push notifications for appointments and queue |
| **Billing Module** | Invoice generation, payment tracking, insurance claims |
| **Lab Results** | Integration with laboratory information system |
| **Prescription Print** | Generate printable prescription documents |
| **Appointment Reminders** | SMS/Email reminders for upcoming appointments |

## Low Priority

| Improvement | Description |
|-------------|-------------|
| **PWA Support** | Progressive Web App for offline access |
| **Data Export** | Export reports as PDF/Excel |
| **Audit Logging** | Track all data changes with user attribution |
| **Dashboard Customization** | Configurable dashboard widgets per role |
| **Advanced Analytics** | Charts for patient trends, appointment patterns |

---

# 21. Code Quality Review

## Strengths

| Area | Assessment |
|------|-----------|
| **Folder Organization** | Well-structured with clear separation (pages, components, hooks, config, utils) |
| **Custom Hooks** | Excellent abstraction of API logic into reusable hooks |
| **Component Reusability** | `StateDoctor`, `DashboardLayout`, `StatusBadge` are properly abstracted |
| **Configuration-Driven** | Stats cards and menus use config arrays, reducing code duplication |
| **Naming Conventions** | Consistent PascalCase for components, camelCase for hooks/utils |
| **API Abstraction** | Clean `apiClient` with centralized auth handling |
| **Role-Based Access** | Clear role separation in routing and navigation |

## Areas for Improvement

| Area | Issue | Recommendation |
|------|-------|----------------|
| **Debug Logs** | `console.log` statements in production code | Remove before deployment |
| **Error Handling** | Inconsistent error display patterns | Create shared `ErrorBanner` component |
| **Loading States** | Simple text-based loading | Implement skeleton loaders consistently |
| **Type Safety** | No TypeScript or PropTypes | Add PropTypes or migrate to TypeScript |
| **Testing** | No test files found | Add unit tests for hooks, integration tests for pages |
| **Code Duplication** | Avatar color/initials logic repeated in multiple files | Extract to shared utility |
| **State Management** | Context API only for auth | Consider Zustand or Redux for complex state |
| **Performance** | No memoization on expensive computations | Use `useMemo` and `useCallback` where needed |
| **Accessibility** | Limited ARIA attributes | Add proper ARIA labels and keyboard navigation |
| **Documentation** | No JSDoc comments | Add JSDoc to hooks and utility functions |

## Scalability Assessment

The architecture supports scaling through:
- Modular page structure (easy to add new modules)
- Custom hooks pattern (easy to add new API integrations)
- Configuration-driven UI (easy to modify dashboards)
- Clear role separation (easy to add new roles)

---

# 22. README.md

The following is the generated README content:

---

```markdown
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
VITE_DEFAULT_AVATAR_URL=
VITE_DEFAULT_PATIENT_PHOTO=
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

This project is licensed under the MIT License.

---

## 👤 Author

**Nader Gamal**
- GitHub: [@Nader-Gamal3011](https://github.com/Nader-Gamal3011)
```

---

*Documentation generated based on complete codebase analysis of the MediFlow Hospital Management System frontend.*