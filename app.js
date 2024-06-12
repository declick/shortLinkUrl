import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import jsonwebtoken from 'jsonwebtoken';
import { Server } from 'socket.io';
import http from 'http';
import authRoutes from './routes/authRoutes.js';
import urlRoutes from './routes/urlRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';  // Assurez-vous que ce chemin est correct
import homeRoutes from './routes/homeRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import config from './config/config.js';
import csrfProtection from './middleware/csrfMiddleware.js';
import authMiddleware from './middleware/authMiddleware.js';
import { handleJwtError } from './middleware/errorMiddleware.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(config.mongodbUri).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use(cors({
  origin: 'http://your-frontend-domain.com',
  credentials: true,
}));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(csrfProtection); // Middleware CSRF après cookieParser

// Middleware to pass authenticated user to views
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jsonwebtoken.verify(token, config.jwtSecret, (err, decoded) => {
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

// Routes
app.use('/', homeRoutes);
app.use('/', authRoutes);
app.use('/', dashboardRoutes);  // Assurez-vous que ce chemin est correct
app.use('/', urlRoutes);
app.use('/', analyticsRoutes);

// Error handling middleware
app.use(handleJwtError);

const PORT = config.port;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default io; // Exportez io pour l'utiliser ailleurs
