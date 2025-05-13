const jwt = require('jsonwebtoken');

// Middleware zur Authentifizierung
const auth = (req, res, next) => {
  try {
    // Token aus dem Authorization-Header extrahieren
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Keine Authentifizierung' });
    }

    // Token verifizieren
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Benutzer-ID zur Anfrage hinzufügen
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    console.error('Authentifizierungsfehler:', error);
    res.status(401).json({ message: 'Ungültiger Token' });
  }
};

module.exports = auth; 