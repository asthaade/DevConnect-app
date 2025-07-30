const express = require('express');
require('dotenv').config()
const connectDB = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const authRouter = require('./routes/auth.js');
const profileRouter = require('./routes/profile.js');
const requestRouter = require('./routes/request.js');
const userRouter = require('./routes/user.js');
const cors = require('cors');
const http = require("http");
const initializeSocket = require('./utils/socket.js');
const chatRouter = require('./routes/chat.js');


const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'], // ✅ correct spelling
  credentials: true
};

app.use(cors(corsOptions));
    
//app.options('*', cors(corsOptions));


app.use(express.json());
app.use(cookieParser());

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);
app.use('/',chatRouter)

const server = http.createServer(app);
initializeSocket(server);


connectDB()
.then(() => {
    console.log(`Database connection is established ${process.env.PORT} `);
    server.listen(process.env.PORT,(req,res)=>{
        console.log("server is successfully listening on port 7777");
    });
})
    .catch((err)=>{
        console.error("Database connection cannot be established");
});
