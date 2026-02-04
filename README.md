# 🍽️ SmartMess - Hostel Mess Management System

<div align="center">

![SmartMess Banner](https://img.shields.io/badge/SmartMess-Mess_Management-4F46E5?style=for-the-badge&logo=restaurant&logoColor=white)

[![Live Demo](https://img.shields.io/badge/Live-Demo-22C55E?style=for-the-badge&logo=vercel)](https://smartmesslms.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend-API-8B5CF6?style=for-the-badge&logo=express)](https://smartmess-backend.onrender.com/api/health)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**A modern, full-stack web application for managing hostel mess operations, menu planning, and student feedback.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Problem Statement

### Current Challenges in Hostel Mess Management:

| Problem | Impact |
|---------|--------|
| **No Menu Visibility** | Students walk to mess blindly without knowing what's being served |
| **Zero Feedback Mechanism** | Mess management has no structured way to collect student feedback |
| **Manual Attendance Tracking** | Time-consuming paper-based attendance system prone to errors |
| **Poor Communication** | No platform for students to raise complaints or suggestions |
| **No Data Analytics** | Management lacks insights into food preferences and quality trends |
| **Inefficient Operations** | Difficulty in menu planning and resource allocation |

### Real-World Pain Points:
- 🚶 Students waste time walking to mess only to find undesirable food
- 📝 Feedback gets lost in informal WhatsApp groups or verbal complaints
- ⏰ Long queues during attendance marking
- 😞 Low student satisfaction due to lack of voice in mess operations
- 💰 Food wastage due to poor demand forecasting

---

## 💡 Solution

**SmartMess** is a comprehensive digital platform that bridges the gap between mess management and students, providing:

### For Students:
✅ **Real-time Menu Access** - Check today's breakfast, lunch, snacks, and dinner from anywhere  
✅ **Rating System** - Rate meals with 1-5 stars and add detailed comments  
✅ **Digital Attendance** - Mark attendance digitally with a single click  
✅ **Complaint Portal** - Raise and track complaints with status updates  
✅ **History Tracking** - View all past ratings and attendance records  

### For Administrators:
✅ **Menu Management** - Create and update daily/weekly menus easily  
✅ **Student Management** - Approve registrations, verify students, manage accounts  
✅ **Analytics Dashboard** - View ratings, trends, and student feedback at a glance  
✅ **Complaint Management** - Review and respond to student complaints  
✅ **Attendance Reports** - Track meal-wise attendance and generate reports  

### Key Benefits:
- 📱 **Mobile-First Design** - Access from any device, anywhere
- 🔐 **Secure Authentication** - JWT-based secure login system
- ⚡ **Real-Time Updates** - Instant menu changes and notifications
- 📊 **Data-Driven Decisions** - Analytics to improve food quality
- 🎨 **Modern UI/UX** - Intuitive interface with smooth animations

---

## ✨ Features

### 🎓 Student Features

| Feature | Description |
|---------|-------------|
| **User Registration** | Sign up with college email, roll number, hostel details |
| **Today's Menu** | View all 4 meals (Breakfast, Lunch, Snacks, Dinner) for today |
| **Weekly Menu** | Plan your week with 7-day menu calendar |
| **Rate Meals** | Give 1-5 star ratings with optional text comments |
| **My Ratings** | View, edit, or delete your past ratings |
| **Digital Attendance** | Mark attendance for each meal with one click |
| **Complaints Portal** | Submit complaints, view status, and track responses |
| **Profile Management** | Update personal information and preferences |

### 👨‍💼 Admin Features

| Feature | Description |
|---------|-------------|
| **Admin Dashboard** | Overview of students, ratings, complaints, and trends |
| **Menu Management** | Create/edit daily menus with drag-and-drop interface |
| **Student Verification** | Approve or reject student registrations |
| **Manage Students** | View all students, verify accounts, block users |
| **View Ratings** | See all ratings with filters by meal, date, rating |
| **Complaint Management** | Review complaints, update status, respond to students |
| **Attendance Reports** | Generate meal-wise and date-wise attendance reports |
| **Analytics** | View trends, average ratings, popular dishes |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI Library | 18.3.1 |
| **Vite** | Build Tool & Dev Server | 5.4.21 |
| **React Router** | Client-side Routing | 6.28.0 |
| **Axios** | HTTP Client | 1.7.9 |
| **Date-fns** | Date Manipulation | 4.1.0 |
| **React Hot Toast** | Toast Notifications | 2.4.1 |
| **React Icons** | Icon Library | 5.4.0 |
| **CSS Modules** | Component-level Styling | Built-in |

### Backend

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Node.js** | Runtime Environment | 18+ |
| **Express** | Web Framework | 4.21.2 |
| **Supabase** | PostgreSQL Database | Latest |
| **JWT** | Authentication | 9.0.2 |
| **Bcrypt** | Password Hashing | 5.1.1 |
| **Cors** | Cross-Origin Requests | 2.8.5 |
| **Dotenv** | Environment Variables | 16.4.7 |

### Database Schema

| Table | Fields | Purpose |
|-------|--------|---------|
| **students** | id, name, email, password, roll_number, hostel_name, room_number, phone_number, is_verified, created_at | Student accounts |
| **admins** | id, name, email, password, role, created_at | Admin accounts |
| **menus** | id, date, day, breakfast[], lunch[], snacks[], dinner[], created_at | Daily menus |
| **ratings** | id, student_id, menu_id, meal_type, rating, comment, created_at | Meal ratings |
| **attendance** | id, student_id, date, breakfast, lunch, snacks, dinner, created_at | Attendance records |
| **complaints** | id, student_id, title, description, status, admin_response, created_at | Complaints |

### DevOps & Deployment

| Service | Purpose | URL |
|---------|---------|-----|
| **Vercel** | Frontend Hosting | [smartmesslms.vercel.app](https://smartmesslms.vercel.app) |
| **Render** | Backend Hosting | [smartmess-backend.onrender.com](https://smartmess-backend.onrender.com) |
| **Supabase** | PostgreSQL Database | Cloud-hosted |
| **GitHub** | Version Control | [ggauravky/SmartMess](https://github.com/ggauravky/SmartMess) |
| **Git** | Source Control | Latest |

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         React Frontend (Vite + React Router)            │ │
│  │  • Student Dashboard  • Admin Dashboard  • Auth Pages   │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS/REST API
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Express.js Backend (Node.js)                  │ │
│  │  • Auth Routes  • Menu Routes  • Rating Routes          │ │
│  │  • JWT Middleware  • CORS Handler  • Error Handler      │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │ SQL Queries
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                         Data Layer                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Supabase PostgreSQL Database               │ │
│  │  • Students  • Admins  • Menus  • Ratings               │ │
│  │  • Attendance  • Complaints  • Notifications            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Project Structure

```
SmartMess/
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── layout/         # Layout components (Navbar, Footer)
│   │   │   └── ui/             # UI components (Button, Card, Modal)
│   │   ├── pages/              # Page components
│   │   │   ├── admin/          # Admin pages
│   │   │   ├── Landing.jsx     # Landing page
│   │   │   ├── Dashboard.jsx   # Student dashboard
│   │   │   └── ...
│   │   ├── context/            # React Context (Auth)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API service layer
│   │   ├── styles/             # Global styles
│   │   └── utils/              # Utility functions
│   ├── public/                 # Static assets
│   ├── package.json            # Frontend dependencies
│   └── vite.config.js          # Vite configuration
│
├── backend/                    # Express Backend
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   │   └── database.js     # Supabase client
│   │   ├── controllers/        # Route controllers
│   │   │   ├── adminController.js
│   │   │   └── studentController.js
│   │   ├── models/             # Database models
│   │   │   ├── Student.js
│   │   │   ├── Menu.js
│   │   │   └── Rating.js
│   │   ├── routes/             # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── adminRoutes.js
│   │   │   └── studentRoutes.js
│   │   ├── scripts/            # Utility scripts
│   │   │   └── createAdmin.js  # Admin creation script
│   │   └── server.js           # Express server entry
│   ├── .env                    # Environment variables
│   ├── package.json            # Backend dependencies
│   └── database_schema.sql     # Database schema
│
├── .gitignore                  # Git ignore file
├── DEPLOYMENT.md               # Deployment guide
└── README.md                   # This file
```

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Supabase Account** - [Sign up](https://supabase.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/ggauravky/SmartMess.git
cd SmartMess
```

### Step 2: Setup Backend

#### 2.1 Install Backend Dependencies

```bash
cd backend
npm install
```

#### 2.2 Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project
3. Go to **Project Settings** → **API**
4. Copy your **Project URL** and **anon/public key**

#### 2.3 Create Database Tables

Run the SQL schema from `backend/database_schema.sql` in Supabase SQL Editor:

```sql
-- Copy contents from backend/database_schema.sql and run in Supabase
```

#### 2.4 Configure Environment Variables

Create `.env` file in `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Admin Credentials (for createAdmin.js script)
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password
ADMIN_PHONE=0000000000
ADMIN_ROLE=superadmin
```

#### 2.5 Create Admin Account

```bash
npm run create-admin
```

#### 2.6 Start Backend Server

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 3: Setup Frontend

#### 3.1 Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

#### 3.2 Configure Environment Variables

Create `.env` file in `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

#### 3.3 Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on `http://localhost:3000` (or next available port)

### Step 4: Access the Application

- **Frontend**: Open [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Default Admin Credentials

Use the credentials you set in `backend/.env` file:
- **Email**: Value of `ADMIN_EMAIL`
- **Password**: Value of `ADMIN_PASSWORD`
- **Login URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 📖 Usage

### For Students

1. **Register**: Go to landing page → Click "Sign Up" → Fill registration form
2. **Wait for Approval**: Admin needs to verify your account
3. **Login**: Once approved, login with your credentials
4. **View Menu**: Check today's or weekly menu
5. **Mark Attendance**: Click attendance button for each meal
6. **Rate Meals**: Rate after eating, give 1-5 stars with comments
7. **Submit Complaints**: Go to Complaints page → Submit new complaint

### For Admins

1. **Login**: Go to `/admin/login` → Enter admin credentials
2. **Verify Students**: Dashboard → Manage Students → Verify pending registrations
3. **Create Menu**: Manage Menu → Select date → Add items for each meal
4. **View Ratings**: View Ratings → Filter by date, meal type, or rating
5. **Handle Complaints**: Complaints → Update status → Add response
6. **View Analytics**: Dashboard shows overview of all activities

---

## 🔌 API Documentation

### Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://smartmess-backend.onrender.com/api`

### Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Student registration | No |
| POST | `/auth/login` | Student login | No |
| POST | `/auth/logout` | Student logout | Yes |
| POST | `/admin/login` | Admin login | No |
| GET | `/auth/me` | Get current user | Yes |

#### Menu Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/menus/today` | Get today's menu | Yes |
| GET | `/menus/weekly` | Get weekly menu | Yes |
| GET | `/menus/date/:date` | Get menu by date | Yes |
| POST | `/admin/menus` | Create/update menu | Admin |
| DELETE | `/admin/menus/:id` | Delete menu | Admin |

#### Rating Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/ratings/my-ratings` | Get user's ratings | Yes |
| POST | `/ratings` | Create rating | Yes |
| PUT | `/ratings/:id` | Update rating | Yes |
| DELETE | `/ratings/:id` | Delete rating | Yes |
| GET | `/admin/ratings` | Get all ratings | Admin |

#### Student Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/students` | Get all students | Admin |
| PUT | `/admin/students/:id/verify` | Verify student | Admin |
| DELETE | `/admin/students/:id` | Delete student | Admin |

#### Attendance Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/attendance/today` | Get today's attendance | Yes |
| POST | `/attendance` | Mark attendance | Yes |
| GET | `/admin/attendance` | Get all attendance | Admin |

#### Complaint Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/complaints` | Get user complaints | Yes |
| POST | `/complaints` | Create complaint | Yes |
| PUT | `/complaints/:id` | Update complaint | Yes |
| GET | `/admin/complaints` | Get all complaints | Admin |
| PUT | `/admin/complaints/:id` | Update complaint status | Admin |

### Sample API Requests

#### Register Student

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "rollNumber": "21CS001",
  "hostelName": "Hostel A",
  "roomNumber": "A-101",
  "phoneNumber": "9876543210"
}
```

#### Get Today's Menu

```bash
GET /api/menus/today
Authorization: Bearer <token>
```

#### Rate a Meal

```bash
POST /api/ratings
Authorization: Bearer <token>
Content-Type: application/json

{
  "menuId": "menu-uuid",
  "mealType": "lunch",
  "rating": 4,
  "comment": "Good taste, nice quantity"
}
```

---

## 📸 Screenshots

### Landing Page
Beautiful, modern landing page with features, testimonials, and FAQ

### Student Dashboard
Clean dashboard showing today's menu, quick stats, and quick actions

### Today's Menu
View all 4 meals with ratings and ability to rate each meal

### Admin Dashboard
Comprehensive overview of students, ratings, complaints, and analytics

### Menu Management
Easy-to-use interface for creating and managing daily menus

### Rating Management
View all ratings with filters, search, and sorting options

---

## 🌐 Deployment

The application is deployed and live at:

- **Frontend**: [https://smartmesslms.vercel.app](https://smartmesslms.vercel.app)
- **Backend**: [https://smartmess-backend.onrender.com](https://smartmess-backend.onrender.com)

### Deployment Configuration

#### Frontend (Vercel)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_API_URL": "https://smartmess-backend.onrender.com/api"
  }
}
```

#### Backend (Render)

```yaml
services:
  - type: web
    name: smartmess-backend
    runtime: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/SmartMess.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Commit Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

4. **Push to Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open Pull Request**

### Coding Standards

- Use ES6+ features
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Gaurav Kumar**

- GitHub: [@ggauravky](https://github.com/ggauravky)
- Email: gkumaryadav526@gmail.com
- LinkedIn: [Gaurav Kumar](https://linkedin.com/in/ggauravky)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend library
- [Express](https://expressjs.com/) - Backend framework
- [Supabase](https://supabase.com/) - Database and authentication
- [Vercel](https://vercel.com/) - Frontend hosting
- [Render](https://render.com/) - Backend hosting
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library

---

## 📞 Support

For support, email gkumaryadav526@gmail.com or create an issue in the repository.

---

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] WhatsApp notifications
- [ ] Email notifications
- [ ] Payment integration for mess bills
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Export reports to PDF/Excel
- [ ] Push notifications
- [ ] Menu suggestions based on ratings
- [ ] Nutritional information
- [ ] Allergen warnings
- [ ] QR code for attendance

---

<div align="center">

**Made with ❤️ for better campus dining**

⭐ Star this repo if you find it helpful!

</div>
