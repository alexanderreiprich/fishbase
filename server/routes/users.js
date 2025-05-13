const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Registrierung eines neuen Benutzers
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Überprüfen, ob der Benutzer bereits existiert
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Benutzer existiert bereits' });
    }

    // Passwort hashen
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Benutzer in die Datenbank einfügen
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    // JWT Token erstellen
    const token = jwt.sign(
      { userId: result.insertId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Benutzer erfolgreich registriert',
      token,
      user: {
        id: result.insertId,
        username,
        email
      }
    });
  } catch (error) {
    console.error('Registrierungsfehler:', error);
    res.status(500).json({ message: 'Serverfehler bei der Registrierung' });
  }
});

// Login eines Benutzers
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Benutzer in der Datenbank suchen
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Ungültige Anmeldedaten' });
    }

    const user = users[0];

    // Passwort überprüfen
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Ungültige Anmeldedaten' });
    }

    // JWT Token erstellen
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Erfolgreich angemeldet',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login-Fehler:', error);
    res.status(500).json({ message: 'Serverfehler beim Login' });
  }
});

// Benutzerinformationen abrufen (geschützter Endpunkt)
router.get('/me', async (req, res) => {
  try {
    // Token aus dem Authorization-Header extrahieren
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Keine Authentifizierung' });
    }

    // Token verifizieren
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Benutzerinformationen abrufen
    const [users] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzerinformationen:', error);
    res.status(401).json({ message: 'Ungültiger Token' });
  }
});

module.exports = router; 