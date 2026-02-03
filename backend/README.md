# SmartMess Backend

## What is this?

This is the backend (server-side) of the Hostel Mess Management System.

## Folder Structure

```
backend/├── src/│   ├── config/         # Configuration files (database connection)│   ├── models/         # Database schemas (will add in Phase 2)│   ├── routes/         # API endpoints (will add in Phase 3)│   ├── controllers/    # Business logic (will add in Phase 3)│   └── server.js       # Main server file├── .env               # Environment variables (secret keys, database URL)├── .gitignore         # Files to ignore in git└── package.json       # Project dependencies
```

## How to Run

### Step 1: Install Dependencies

```bash
cd backendnpm install
```

### Step 2: Setup MongoDB

-   **Option 1**: Install MongoDB locally
-   **Option 2**: Use MongoDB Atlas (cloud) - Create free account at mongodb.com/atlas

### Step 3: Update .env file`​`

Update the MONGODB_URI in .env file with your connection string

### Step 4: Start the Server

```bash
npm run dev
```

The server will start on [http://localhost:5000](http://localhost:5000)

## Testing

Open your browser and go to: [http://localhost:5000](http://localhost:5000)You should see a welcome message!