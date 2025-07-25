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

router.post("/search", async (req, res) => {
  try {
    console.log("Route /search wurde aufgerufen");
    const { searchText } = req.body;

    const [users] = await pool.query(
      "SELECT id, picture, username, favoritefish, aquarium FROM users WHERE username LIKE ?",
      [`%${searchText}%`]
    );
    if (users.length == 0) {
      return res
        .status(404)
        .json({message: "Keine User gefunden"});
    }

    // Bilder in Base64 konvertieren
    const usersWithBase64 = users.map((user) => {
      const imageBase64 = user.picture
        ? Buffer.from(user.picture).toString("base64")
        : null;

      const aquariumBase64 = user.aquarium
        ? Buffer.from(user.aquarium).toString("base64")
        : null;

      return {
        ...user,
        picture: imageBase64,
        aquarium: aquariumBase64,
      };
    });

    res.status(200).json(usersWithBase64);
  } catch (error) {
    console.error("API-Fehler:", error);
    res.status(500).json({message: "Serverfehler bei der Abfrage der User"});
  }
});

router.get("/all", async (req, res) => {
  try {
    console.log("Route /all wurde aufgerufen");

    const [users] = await pool.query(
      "SELECT id, picture, username FROM users",
      [searchText]
    );

    if (users.length == 0) {
      return res
        .status(404)
        .json({message: "Keine User gefunden"});
    }

    // Bilder in Base64 konvertieren
    const usersWithBase64 = users.map((user) => {
      const imageBase64 = user.picture
        ? Buffer.from(user.picture).toString("base64")
        : null;

      return {
        ...user,
        picture: imageBase64,
      };
    });

    res.status(200).json(usersWithBase64);
  } catch (error) {
    console.error("API-Fehler:", error);
    res.status(500).json({message: "Serverfehler bei der Abfrage der User"});
  }
});

router.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Route users/:id wurde aufgerufen mit ID: ${id}`);
    const [users] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User nicht gefunden" });
    }

    // Bild in Base64 konvertieren
    const imageBase64 = users[0].picture
      ? Buffer.from(users[0].picture).toString("base64")
      : null;

    const aquariumBase64 = users[0].aquarium
      ? Buffer.from(users[0].aquarium).toString("base64")
      : null;

    const user = {
      ...users[0],
      picture: imageBase64,
      aquarium: aquariumBase64,
    };

    res.status(200).json(user);
  } catch (error) {
    console.error("API-Fehler:", error);
    res.status(500).json({message: "Serverfehler bei der Abfrage der User"});
  }
});

// Profilbild aktualisieren
router.put("/profile/picture", async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Keine Authentifizierung' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { picture } = req.body;

    if (!picture) {
      return res.status(400).json({ message: 'Kein Bild übermittelt' });
    }

    // Base64 zu Buffer konvertieren
    const imageBuffer = Buffer.from(picture, 'base64');

    // Bild in der Datenbank aktualisieren
    await pool.query(
      'UPDATE users SET picture = ? WHERE id = ?',
      [imageBuffer, decoded.userId]
    );

    res.json({ message: 'Profilbild erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Profilbilds:', error);
    res.status(500).json({ message: 'Serverfehler beim Aktualisieren des Profilbilds' });
  }
});

// Aquarium-Bild aktualisieren
router.put("/profile/aquarium", async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Keine Authentifizierung' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { aquarium } = req.body;

    if (!aquarium) {
      return res.status(400).json({ message: 'Kein Bild übermittelt' });
    }

    // Base64 zu Buffer konvertieren
    const imageBuffer = Buffer.from(aquarium, 'base64');

    // Bild in der Datenbank aktualisieren
    await pool.query(
      'UPDATE users SET aquarium = ? WHERE id = ?',
      [imageBuffer, decoded.userId]
    );

    res.json({ message: 'Aquarium-Bild erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Aquarium-Bildes:', error);
    res.status(500).json({ message: 'Serverfehler beim Aktualisieren des Aquarium-Bildes' });
  }
});

// Lieblingsfisch aktualisieren
router.put("/profile/favoritefish", async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Keine Authentifizierung' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { favoritefish } = req.body;

    // Lieblingsfisch in der Datenbank aktualisieren
    await pool.query(
      'UPDATE users SET favoritefish = ? WHERE id = ?',
      [favoritefish, decoded.userId]
    );

    res.json({ message: 'Lieblingsfisch erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Lieblingsfisches:', error);
    res.status(500).json({ message: 'Serverfehler beim Aktualisieren des Lieblingsfisches' });
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

    // Bild in Base64 konvertieren
    const imageBase64 = users[0].picture
      ? Buffer.from(users[0].picture).toString("base64")
      : null;

    const aquariumBase64 = users[0].aquarium
      ? Buffer.from(users[0].aquarium).toString("base64")
      : null;

    const user = {
      ...users[0],
      picture: imageBase64,
      aquarium: aquariumBase64,
    };

    res.json(user);
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzerinformationen:', error);
    res.status(401).json({ message: 'Ungültiger Token' });
  }
});



module.exports = router; 