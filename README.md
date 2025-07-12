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
| **Deployment**| Frontend: Vercel *(optional)*, Backend: Render *(optional)* |

---

## 🛠️ Getting Started

### 📦 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- Git

---

### 📁 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/DevConnect.git

# Navigate to project
cd DevConnect-app

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

---

### 🔐 Set Up Environment Variables

If you don’t want to change the `.env` credentials, skip this step and move to next step

### 📄 Create a `.env` File

Inside the `/backend` directory, create a `.env` file with the following environment variables:

PORT = 7777
DB_Connection_String = 
FRONTEND_URL= 
BACKEND_URL=

Replace each value with your specific configuration details.

### Run the application backend (make sure you are in /backend directory) :
npm run dev

###Open your browser and navigate to http://localhost:5173 to view the app.
npm run dev
