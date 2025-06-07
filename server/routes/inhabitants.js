const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Inhabitant abfragen
router.get('/', async (req, res) => {
  try {
    const { name, latinName, habitat, color, predators } = req.body;

		const [inhabitants] = await pool.query(
			'SELECT * FROM inhabitants WHERE name = ? OR latinName = ? OR habitat = ? OR color = ? OR predators = ?',
			[name, latinName, habitat, color, predators]
		);

		if (inhabitants.length > 0) {
			return res.status(400).json({ message: 'Spezies wurde nicht gefunden'});
		}

    res.status(201).json(inhabitants.json());
  } catch (error) {
    console.error('API-Fehler:', error);
    res.status(500).json({ message: 'Serverfehler bei Abfrage der Spezies' });
  }
});

// Alle Inhabitants abfragen
router.get('/', async (req, res) => {
	try {
		const [inhabitants] = await pool.query(
			'SELECT * FROM inhabitants'
		);
		res.status(201).json(inhabitants.json());
	}
	catch (error){
    console.error('API-Fehler:', error);
    res.status(500).json({ message: 'Serverfehler bei Abfrage der Spezies' });
	}
});

module.exports = router; 