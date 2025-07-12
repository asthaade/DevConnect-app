# 💬 DevConnect – A MERN-Based Developer Social Network

**DevConnect** is a real-time social networking platform built with the **MERN stack (MongoDB, Express.js, React.js, Node.js)**. Designed for developers, the app enables users to **connect**, **send/accept requests**, and **chat in real time** with their connections.

With a sleek UI built using **Tailwind CSS** and **DaisyUI**, DevConnect creates an engaging and responsive user experience across all devices.

---

## 🚀 Features

- 🔐 **User Authentication** – Secure login/register using JWT
- 🤝 **Send & Accept Connection Requests** – Build your developer network
- 💬 **1:1 Real-Time Chat** – Chat live with accepted connections using Socket.IO
- 👀 **Message Status** – Sent, delivered, and seen indicators
- 👤 **Profile View/Edit** – View and manage user profiles
- 📱 **Responsive Design** – Works great on all screen sizes

---

## 🧑‍💻 Tech Stack

| Layer         | Tech Stack                         |
|---------------|------------------------------------|
| **Frontend**  | React.js, Tailwind CSS, DaisyUI, React Router |
| **Backend**   | Node.js, Express.js                |
| **Database**  | MongoDB Atlas                      |
| **Authentication** | JWT, Bcrypt                   |
| **Real-Time Chat** | Socket.IO                     |
| **Deployment**|  Render  |

---

## 🛠️ Getting Started

### 📦 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- Git

---

### 📁 Installation

# Clone the repository

```bash
git clone https://github.com/yourusername/DevConnect.git
```

# Navigate to project

```bash
cd DevConnect-app
```

1. Install backend dependencies
```bash
cd backend
npm install
```

2. Install frontend dependencies  
```bash
cd frontend 
npm install
```
##3. If you don’t want to change the `.env` credentials, skip this step and move to next step##

4.Set up environment variables:
Create a config.env file after creating a config folder in the backend directory, containing the following variables:

```bash
PORT = 
DB_Connection_String = 
FRONTEND_URL= 
BACKEND_URL=
```

Replace each value with your specific configuration details.

5. Run the application backend (make sure you are in /backend directory) :
```bash
npm run dev
```

6. Run the application frontend (make sure you are in /frontend directory) :
```bash
npm run dev
```
7. Open your browser and navigate to http://localhost:5173 to view the app.

---

## 🌟 Support

If you like this project, **please give a star ⭐ to the repository** — it helps others discover it and motivates continued development!

---

## 📬 Contact

**Astha Ade** – [GitHub Profile](https://github.com/asthaade)

**Project Repository:** [DevConnect on GitHub](https://github.com/asthaade/DevConnect)


