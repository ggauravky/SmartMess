# Testing Admin APIs

## 📚 What is API Testing?
Testing APIs means sending requests to our server and checking if we get the correct response.

## 🛠️ Tools for Testing
We'll use **Thunder Client** (VS Code extension) or **Postman** or **curl commands**

---

## 🔗 API Endpoints

### Base URL
```
http://localhost:5000
```

---

## 1️⃣ ADD NEW STUDENT

**Endpoint:** `POST http://localhost:5000/api/admin/students`

**Request Body (JSON):**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "rollNumber": "2021001",
  "password": "password123",
  "hostelName": "Hostel A",
  "roomNumber": "101",
  "phoneNumber": "9876543210"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Student added successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "rollNumber": "2021001",
    "isVerified": false
  }
}
```

**PowerShell Command:**
```powershell
$body = @{
  name = "Rahul Sharma"
  email = "rahul@example.com"
  rollNumber = "2021001"
  password = "password123"
  hostelName = "Hostel A"
  roomNumber = "101"
  phoneNumber = "9876543210"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/admin/students" -Method POST -Body $body -ContentType "application/json"
```

---

## 2️⃣ GET ALL STUDENTS

**Endpoint:** `GET http://localhost:5000/api/admin/students`

**Expected Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "rollNumber": "2021001",
      "isVerified": false,
      "createdAt": "2026-02-03T10:30:00.000Z"
    }
  ]
}
```

**PowerShell Command:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/students" -Method GET
```

**Get only unverified students:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/students?verified=false" -Method GET
```

---

## 3️⃣ VERIFY STUDENT

**Endpoint:** `PUT http://localhost:5000/api/admin/students/{studentId}/verify`

Replace `{studentId}` with actual student ID from previous response.

**Example:** `PUT http://localhost:5000/api/admin/students/507f1f77bcf86cd799439011/verify`

**No Request Body Needed**

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Student verified successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "isVerified": true
  }
}
```

**PowerShell Command:**
```powershell
# Replace STUDENT_ID_HERE with actual ID
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/students/STUDENT_ID_HERE/verify" -Method PUT
```

---

## 4️⃣ ADD MENU

**Endpoint:** `POST http://localhost:5000/api/admin/menu`

**Request Body (JSON):**
```json
{
  "date": "2026-02-03",
  "day": "Monday",
  "breakfast": {
    "items": ["Poha", "Tea", "Banana"],
    "timing": "7:00 AM - 9:00 AM"
  },
  "lunch": {
    "items": ["Dal", "Rice", "Roti", "Aloo Sabji"],
    "timing": "12:00 PM - 2:00 PM"
  },
  "snacks": {
    "items": ["Samosa", "Tea"],
    "timing": "4:00 PM - 5:00 PM"
  },
  "dinner": {
    "items": ["Dal", "Rice", "Roti", "Paneer"],
    "timing": "7:00 PM - 9:00 PM"
  },
  "specialNote": "Today's special: Gulab Jamun"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Menu added successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "date": "2026-02-03T00:00:00.000Z",
    "day": "Monday",
    "breakfast": {
      "items": ["Poha", "Tea", "Banana"],
      "timing": "7:00 AM - 9:00 AM"
    },
    "lunch": {
      "items": ["Dal", "Rice", "Roti", "Aloo Sabji"],
      "timing": "12:00 PM - 2:00 PM"
    }
  }
}
```

**PowerShell Command:**
```powershell
$menuBody = @{
  date = "2026-02-03"
  day = "Monday"
  breakfast = @{
    items = @("Poha", "Tea", "Banana")
    timing = "7:00 AM - 9:00 AM"
  }
  lunch = @{
    items = @("Dal", "Rice", "Roti", "Aloo Sabji")
    timing = "12:00 PM - 2:00 PM"
  }
  snacks = @{
    items = @("Samosa", "Tea")
    timing = "4:00 PM - 5:00 PM"
  }
  dinner = @{
    items = @("Dal", "Rice", "Roti", "Paneer")
    timing = "7:00 PM - 9:00 PM"
  }
  specialNote = "Today's special: Gulab Jamun"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:5000/api/admin/menu" -Method POST -Body $menuBody -ContentType "application/json"
```

---

## 🎯 Testing Steps

1. **Make sure your server is running:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Option A: Use Thunder Client (Recommended)**
   - Install Thunder Client extension in VS Code
   - Create a new request
   - Copy the endpoint and body from above
   - Click Send

3. **Option B: Use PowerShell**
   - Copy the PowerShell commands from above
   - Run them in your terminal

4. **Test in this order:**
   - First add a student
   - Then get all students
   - Copy the student ID from response
   - Verify that student
   - Add a menu

---

## ❌ Common Errors

**Error 400:** Missing required fields → Check your request body

**Error 404:** Student not found → Check if student ID is correct

**Error 500:** Server error → Check server logs in terminal

---

## 📝 Notes

- Make sure MongoDB is connected
- Server should show "✅ MongoDB Connected Successfully"
- Each time you add a student, email and rollNumber must be unique
- Save student IDs from responses for verification

---

## 🎓 What Did We Learn?

- **POST** - Create new data
- **GET** - Read/fetch data
- **PUT** - Update existing data
- **Request Body** - Data we send to server
- **Response** - Data server sends back
- **Status Codes:**
  - 200 = Success
  - 201 = Created
  - 400 = Bad Request
  - 404 = Not Found
  - 500 = Server Error
