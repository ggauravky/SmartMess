# SmartMess Frontend

A modern, responsive React frontend for the SmartMess - Digital Mess Management System.

## Features

- 🍽️ View daily and weekly mess menus
- ⭐ Rate meals with star ratings and comments
- 📊 Track your rating history
- 👤 User authentication and profile management
- 📱 Fully responsive design

## Tech Stack

- **React 18** - UI Library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **React Icons** - Icon library
- **date-fns** - Date formatting
- **CSS Modules** - Scoped styling

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── layout/         # Layout components (Navbar, Layout)
│   ├── ui/             # Reusable UI components
│   └── MealCard.jsx    # Meal display component
├── context/
│   └── AuthContext.jsx # Authentication context
├── hooks/
│   └── useApi.js       # Custom API hook
├── pages/
│   ├── Landing.jsx     # Landing page
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── Dashboard.jsx   # Main dashboard
│   ├── TodayMenu.jsx   # Today's menu
│   ├── WeeklyMenu.jsx  # Weekly menu
│   ├── RateMeal.jsx    # Rate meal page
│   ├── MyRatings.jsx   # User ratings history
│   └── Profile.jsx     # User profile
├── services/
│   └── api.js          # API configuration
├── styles/
│   └── index.css       # Global styles
├── utils/
│   ├── constants.js    # App constants
│   └── helpers.js      # Utility functions
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License
