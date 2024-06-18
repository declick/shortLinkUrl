import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import jsonwebtoken from 'jsonwebtoken';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import urlRoutes from './routes/urlRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import activityLogRoutes from './routes/activityLogRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; 
import pricingRoute from './routes/pricingRoute.js';
import csrfProtection from './middleware/csrfMiddleware.js';
import {authMiddleware,  attachUser  } from './middleware/authMiddleware.js';
import handleJwtError from './middleware/errorMiddleware.js';
import disableCache from './middleware/cacheControl.js'; 


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(csrfProtection);
app.use(express.json());

app.use(disableCache);

app.use(authMiddleware);
app.use(attachUser);

app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.locals.user = null;
      } else {
        res.locals.user = decoded;
      }
      next();
    });
  } else {
    res.locals.user = null;
    next();
  }
});


// Définir les routes spécifiques
app.use('/', homeRoutes);
app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/', analyticsRoutes);
app.use('/', profileRoutes);
app.use('/', adminRoutes);
app.use('/', activityLogRoutes);
app.use('/', pricingRoute);
app.use('/', userRoutes);
app.use('/', urlRoutes);

app.use(handleJwtError);

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default io;
