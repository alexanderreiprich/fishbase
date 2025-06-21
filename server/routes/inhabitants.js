const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Alle Inhabitants abfragen
router.get('/all', async (req, res) => {
	try {		
    console.log(`Route /all wurde aufgerufen`);
		const [inhabitants] = await pool.query(
			'SELECT * FROM inhabitants'
		);
		if (!inhabitants || inhabitants.length === 0) {
			console.log("Keine Daten gefunden!");
			return res.status(404).json({ message: 'Keine Inhabitants gefunden' });
		}

		// Bilder in Base64 konvertieren
		const inhabitantsWithBase64 = inhabitants.map(inhabitant => {
			const imageBase64 = inhabitant.image ? 
				Buffer.from(inhabitant.image).toString('base64') : 
				null;
			
			return {
				...inhabitant,
				image: imageBase64
			};
		});

		res.status(200).json(inhabitantsWithBase64);
	}
	catch (error){
    console.error('API-Fehler:', error);
    res.status(500).json({ message: 'Serverfehler bei Abfrage der Spezies' });
	}
});

// Inhabitant nach ID abfragen
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Route /:id wurde aufgerufen mit ID: ${id}`);
    const [inhabitants] = await pool.query('SELECT * FROM inhabitants WHERE id = ?', [id]);
    
    if (inhabitants.length === 0) {
      return res.status(404).json({ message: 'Inhabitant nicht gefunden' });
    }

    // Bild in Base64 konvertieren
    const imageBase64 = inhabitants[0].image ? 
      Buffer.from(inhabitants[0].image).toString('base64') : 
      null;

    const inhabitant = {
      ...inhabitants[0],
      image: imageBase64
    };

    res.status(200).json(inhabitant);
  } catch (error) {
		console.error('API-Fehler:', error);
		res.status(500).json({ message: 'Serverfehler bei Abfrage der Spezies' });
	}
});

// Inhabitant abfragen
router.post('/search', async (req, res) => {
  try {
    console.log("Route /search wurde aufgerufen");
    const { searchText, type, habitat, color, salinity, phValue, temperature } = req.body;
		console.log(req.body);
		const [inhabitants] = await pool.query(
			'SELECT * FROM inhabitants WHERE name = ?', // TODO: Include Water Quality
			[searchText]
		);
		console.log(inhabitants);

		if (inhabitants.length == 0) {
			return res.status(400).json({ message: 'Spezies wurde nicht gefunden'});
		}

    res.status(200).json(inhabitants);
  } catch (error) {
    console.error('API-Fehler:', error);
    res.status(500).json({ message: 'Serverfehler bei Abfrage der Spezies' });
  }
});

module.exports = router; 