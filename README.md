# Full Stack Event Calendar Application

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A secure, multi-user, full-stack calendar application built with a Vanilla JS frontend and a Node.js/Express/MongoDB backend. It features persistent data storage and JWT-based authentication, allowing users to manage their personal events securely.

---

### ✨ Live Demo

**[https://sriparna05.github.io/event-calendar/](https://sriparna05.github.io/event-calendar/)**

---

### 🚀 Key Features

- **Secure User Authentication:** JWT-based signup and login system ensures user data is protected.
- **Persistent Data Storage:** User accounts and events are stored securely in a MongoDB Atlas database.
- **Private, User-Specific Calendars:** Each user only has access to their own events.
- **Full CRUD Functionality:** Users can Create, Read, Update, and Delete their events.
- **Interactive Calendar Interface:** Built with FullCalendar.js, supporting month, week, and list views.
- **Modern Dark Theme:** A clean, sober UI for a great user experience.
- **Responsive Welcome Screen:** An inviting landing page for new, logged-out users.

---

### 🛠️ Tech Stack

- **Frontend:**
  - HTML5
  - CSS3 (with Custom Properties for theming)
  - Vanilla JavaScript (ES6+)
  - [FullCalendar.js](https://fullcalendar.io/)
- **Backend:**
  - [Node.js](https://nodejs.org/)
  - [Express.js](https://expressjs.com/)
  - [Mongoose](https://mongoosejs.com/) (ODM for MongoDB)
  - [JSON Web Token (JWT)](https://jwt.io/) for authentication
  - [bcrypt.js](https://github.com/dcodeIO/bcrypt.js) for password hashing
- **Database:**
  - [MongoDB Atlas](https://www.mongodb.com/atlas) (Cloud Database)
- **Deployment:**
  - Backend API deployed on [Render](https://render.com/).

---

### 🏗️ Project Architecture

The application follows a classic client-server architecture.

```
  [ Frontend (Browser) ]
  (HTML, CSS, JS, FullCalendar)
           |
           | (HTTPS API Requests with JWT)
           v
  [ Backend (Render Server) ]
  (Node.js, Express.js)
           |
           | (Mongoose)
           v
  [ Database (MongoDB Atlas) ]
```

---

### ⚙️ Setup and Local Installation

To run this project on your local machine, follow these steps:

**1. Prerequisites:**

- [Node.js](https://nodejs.org/en/download/) (v14 or later)
- [Git](https://git-scm.com/downloads)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account.

**2. Clone the Repository:**

```bash
git clone https://github.com/Sriparna05/event-calendar.git
cd event-calendar
```

**3. Install Backend Dependencies:**

```bash
npm install
```

**4. Set Up Environment Variables:**

- Create a file named `.env` in the root of the project directory.
- Copy the contents of `.env.example` into it and fill in your details.

**`.env.example`**

```env
# Get this from your MongoDB Atlas dashboard -> Connect -> Connect your application
MONGO_URI=mongodb+srv://<username>:<password>@yourcluster.mongodb.net/yourDatabaseName?retryWrites=true&w=majority

# Create a long, random, and secret string for signing tokens
JWT_SECRET=your_super_secret_jwt_key
```

**5. Run the Backend Server:**

```bash
node server.js
```

The server should now be running on `http://localhost:3000`.

**6. Update API Endpoint for Local Development:**

- For local testing, you need to point the frontend to your local server. In `index.html`, temporarily change the `API_BASE_URL` constant:
  ```javascript
  // Change this:
  const API_BASE_URL = "https://event-calendar-s7cb.onrender.com/api";
  // To this:
  const API_BASE_URL = "http://localhost:3000/api";
  ```
  _Remember to change it back when you want to use the live deployed version!_

**7. Run the Frontend:**

- Simply open the `index.html` file in your web browser. You can use an extension like VS Code's "Live Server" for a better experience.

---

### 📖 API Endpoints

All event endpoints are protected and require a valid JWT in the `Authorization: Bearer <token>` header.

| Method   | Endpoint           | Protected | Description                            |
| -------- | ------------------ | --------- | -------------------------------------- |
| `POST`   | `/api/auth/signup` | No        | Register a new user.                   |
| `POST`   | `/api/auth/login`  | No        | Log in a user and get a token.         |
| `GET`    | `/api/events`      | Yes       | Get all events for the logged-in user. |
| `POST`   | `/api/events`      | Yes       | Create a new event.                    |
| `PUT`    | `/api/events/:id`  | Yes       | Update an existing event.              |
| `DELETE` | `/api/events/:id`  | Yes       | Delete an event.                       |
