# SmartMess 🍽️

A modern Hostel Mess Management System built with React and Node.js.

## 🌟 Features

- **Students**: View menus, rate meals, submit complaints, mark attendance
- **Admin**: Manage menus, view ratings, handle complaints, send notifications
- **Real-time**: Instant updates for menu and notifications

## 🛠️ Tech Stack

| Frontend | Backend | Database |
|----------|---------|----------|
| React 18 | Node.js | Supabase (PostgreSQL) |
| Vite | Express.js | |
| React Router | JWT Auth | |
| Axios | bcryptjs | |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/SmartMess.git
cd SmartMess
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local if needed
npm run dev
```

### 4. Open in browser
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel and Render.

## 📁 Project Structure

```
SmartMess/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── context/
│   └── package.json
│
├── backend/           # Node.js backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── config/
│   └── package.json
│
└── DEPLOYMENT.md      # Deployment guide
```

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-key
JWT_SECRET=your-jwt-secret
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📝 License

MIT License - feel free to use this project for learning!
