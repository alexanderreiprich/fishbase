// server/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const usersRoutes = require('./routes/users');

app.use('/api/users', usersRoutes);

// Server starten
app.listen(PORT, () => {
  console.log(`Server runs on port ${PORT}`);
});