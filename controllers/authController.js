import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('signup', { csrfToken: req.csrfToken(), errorMessage: 'Username already exists. Please choose another username.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.redirect('/login'); 
  } catch (error) {
    console.error('Error registering user:', error);
    res.render('signup', { csrfToken: req.csrfToken(), errorMessage: 'Registration failed. Please try again.' });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render('login', { csrfToken: req.csrfToken(), errorMessage: 'Authentication failed. Please check your username and password.' });
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, config.jwtSecret, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/dashboard'); // Redirection vers le tableau de bord après une connexion réussie
  } catch (error) {
    console.error('Error logging in user:', error);
    res.render('login', { csrfToken: req.csrfToken(), errorMessage: 'Login failed. Please try again.' });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.redirect('/'); 
};
