const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Alle Inhabitants abfragen
router.get('/all', async (req, res) => {
	try {		
    console.log(`Route /all wurde aufgerufen`);
		const [inhabitants] = await pool.query(
			'SELECT * FROM inhabitants LIMIT 10' // TODO: Limit rausnehmen
		);
		if (!inhabitants || inhabitants.length === 0) {
			console.log("Keine Daten gefunden!");
			return res.status(404).json({ message: 'Keine Inhabitants gefunden' });
		}

		// Debug-Log für das erste Bild
		if (inhabitants[0].image) {
			console.log("Erstes Bild:", {
				hasImage: true,
				imageType: typeof inhabitants[0].image,
				imageLength: inhabitants[0].image.length,
				isBuffer: Buffer.isBuffer(inhabitants[0].image)
			});
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
router.get('/', async (req, res) => {
  try {
    console.log("Route / wurde aufgerufen");
    const { name, latinName, habitat, color, predators } = req.body;

		const [inhabitants] = await pool.query(
			'SELECT * FROM inhabitants WHERE name = ? OR latinName = ? OR habitat = ? OR color = ? OR predators = ?',
			[name, latinName, habitat, color, predators]
		);

		if (inhabitants.length > 0) {
			return res.status(400).json({ message: 'Spezies wurde nicht gefunden'});
		}

    res.status(200).json(inhabitants);
  } catch (error) {
    console.error('API-Fehler:', error);
    res.status(500).json({ message: 'Serverfehler bei Abfrage der Spezies' });
  }
});

module.exports = router; 