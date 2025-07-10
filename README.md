

# EduConnect: AI-Based Learning Platform

EduConnect is a full-stack web application built to transform how educational institutions manage academic workflows. It is designed to streamline internal communication, boost student engagement, and empower teachers with AI-powered tools to track learning and performance — all within a user-friendly interface.

---

## 🧠 Why EduConnect?

In many institutions, there's a disconnect between students and faculty when it comes to academic support, updates, and individual learning progress. EduConnect bridges that gap.

### ❓ Problems Solved

- 🔄 **Fragmented communication**: Centralizes announcements, events, internships, and club info.
- 📉 **Ineffective remedial teaching**: Allows performance-based tracking of remedial classes.
- ❓ **Delayed academic doubt resolution**: Real-time Q&A module with chatbot + teacher validation.
- 🔐 **Generic user access**: Role-based login with RVCE email verification and JWT security.

---

## 🚀 Features at a Glance

- 🔐 **Secure Login & JWT Auth**
- 📢 **Announcement Management**
- 🏫 **Department and Club Listings**
- 📅 **Event & Internship Board**
- 💬 **Q&A Chatbot System**
- 🧑‍🏫 **Remedial Classes with Assignment & Reporting**
- 📁 **File Uploads (Images + Docs)**
- 🧠 **AI-generated answers + Teacher Approval Workflow**
- 📊 **Performance Reports for Teachers**
- 🎨 **Responsive UI with Role-Based Dashboards**

---

## 🏗️ Architecture Overview

```plaintext
[React Frontend] ---> [Express API Server] ---> [MongoDB Database]
        |                      ↑
        ↓                      |
  Context API          JWT / Auth Middleware
        |
        ↓
  Role-based Navigation
```

---

## 🤖 AI Chatbot + Q&A Integration

- Frontend provides a chatbot UI or redirection to an external chatbot service (like Streamlit).
- Students can ask:
  - Common questions → Answered from hardcoded DB entries
  - Custom academic doubts → Stored in DB, reviewed by AI & validated by teachers
- Teachers access a dashboard to review/edit responses and approve them.
- Students are notified when answers are updated.

---

## 👩‍🏫 Remedial Class System

- Teachers can post assignments specifically for remedial students.
- Students submit answers, and teachers can review and assign marks.
- Backend aggregates data to generate a **performance report** for tracking student progress.
- This helps identify which students need additional help and adapt teaching accordingly.

---

## ⚙️ Tech Stack

### Frontend
- React.js
- Context API
- CSS

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Multer, dotenv, CORS, Helmet, Morgan

### AI & Chatbot 
- Streamlit or Python-based chatbot app
- AI API for initial response generation
- Manual teacher approval workflow

---

## 📂 Project Structure

```bash
EduConnect/
│
├── api/                    # Backend source code
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express route handlers
│   ├── controllers/        # Logic handling (optional modular structure)
│   ├── public/             # Static file serving
│   ├── index.js            # Express app entry point
│   └── .env                # Environment config
│
└── client/                 # React frontend
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── pages/          # Route-based page components
    │   ├── context/        # Global state management (Auth)
    │   ├── apiCalls.js     # Axios API call logic
    │   ├── dummyData.js    # Dummy content for testing
    │   └── index.js        # Entry point for React
```

---

## 🔧 Getting Started

### ✅ Backend Setup (API)

1. Navigate to the backend:
   ```bash
   cd api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `api/` directory with:
   ```env
   MONGO_URL=your_mongodb_uri
   NODE_ENV=development
   JWT_SECRET=your_secret_key
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   The server runs on: `http://localhost:8800`

---

### ✅ Frontend Setup (Client)

1. Navigate to the frontend:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React app:
   ```bash
   npm start
   ```
   The app runs on: `http://localhost:3000`

---

## 🔐 Environment Variables

### Backend (`api/.env`)
```env
MONGO_URL=your_mongodb_connection
NODE_ENV=development
JWT_SECRET=your_jwt_secret
```

---

## 🌐 API Endpoints

| Resource       | Endpoint                | Methods     | Description                      |
|----------------|-------------------------|-------------|----------------------------------|
| Auth           | `/api/auth`             | POST        | Register/Login                   |
| Users          | `/api/users`            | GET, POST   | User management                  |
| Posts          | `/api/posts`            | GET, POST   | Social-style posts               |
| Announcements  | `/api/announcements`    | GET, POST   | Announcement creation & fetch    |
| Departments    | `/api/departments`      | GET, POST   | Department info                  |
| Clubs          | `/api/clubs`            | GET, POST   | Club listings                    |
| Events         | `/api/events`           | GET, POST   | Event listings                   |
| Internships    | `/api/internships`      | GET, POST   | Internship listings              |
| Q&A            | `/api/qa`               | GET, POST   | Query management for students    |
| Remedial       | `/api/remedial`         | GET, POST   | Remedial classes assignments     |
| Upload Files   | `/api/upload`           | POST        | Upload images/documents          |
| Serve Files    | `/images/:filename`     | GET         | Serve uploaded images            |
| Serve Docs     | `/documents/:filename`  | GET         | Serve uploaded documents         |

---



## 📊 Modules Overview

### 👨‍🏫 Remedial Classes
- Teachers post assignments.
- Students submit their work.
- Teachers evaluate and assign marks.
- Performance report generated for targeted support.

### 💬 Q&A Forum
- Students submit questions.
- AI chatbot or teachers provide answers.
- Teachers moderate/approve/edit responses.

### 🎓 Internships & Events
- List internship and event opportunities.
- Easily browsable for students.

---



## 🚀 Planned Future Enhancements

- 📲 Mobile app (React Native or Flutter)
- 📈 Analytics dashboard for attendance, engagement
- 🔔 Real-time notifications system
- 🗂️ Document & assignment library per course
- 🧠 Full AI-driven feedback for students
- 🧪 Auto-evaluation of assignments using ML (MOST Priority)
- 🧑‍💻 Admin interface for multi-department controls

---

## 🤝 Contributing

PRs and ideas are welcomed  

```bash
1. Fork the repo
2. Create a branch: git checkout -b feature/YourFeature
3. Commit: git commit -m "Added feature"
4. Push: git push origin feature/YourFeature
5. Submit PR
```

---

## 📄 License

This project is licensed under the MIT License.

---

## 📬 Contact / Maintainers

Created by:
- Ranchit Sharma
- ranchitsharma36@gmail.com

---


