const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Hinzufügen eines neuen Aquariums
router.post('/user/:id', async (req, res) => {
  try {
		const { id } = req.params;
    const { capacity, name } = req.body;
		console.log(`Route POST aquariums/user/:id wurde aufgerufen mit ID: ${id}`);

    const [result] = await pool.query(
      'INSERT INTO aquariums (userid, capacity, name) VALUES (?, ?, ?)',
      [id, capacity, name]
    );

    res.status(201).json({
      message: 'Aquarium erfolgreich erstellt'
    });
  } catch (error) {
    console.error('Fehler:', error);
    res.status(500).json({ message: 'Serverfehler bei der Aquarienerstellung' });
  }
});

// Abfragen der Aquarien eines Nutzers
router.get('/user/:id', async (req, res) => {
	try {
		const { id } = req.params;
		console.log(`Route GET aquariums/user/:id wurde aufgerufen mit ID: ${id}`);
    const [aquariums] = await pool.query(
      "SELECT * FROM aquariums WHERE userid = ?",
      [id]
    );
		if (aquariums.length === 0) {
      return res.status(404).json({ message: "Keine Aquarien gefunden" });
    }

		// Für jedes Aquarium die Inhabitant laden
		const aquariumsWithInhabitants = await Promise.all(
			aquariums.map(async (aquarium) => {
				const [inhabitants] = await pool.query(
					"SELECT iid, amount FROM inhabitants_aquariums WHERE aid = ?",
					[aquarium.id]
				);
				
				// Inhabitant-IDs als kommagetrennten String erstellen
				const inhabitantIds = inhabitants.map(inh => inh.iid).join(',');
				
				return {
					...aquarium,
					inhabitants: inhabitantIds
				};
			})
		);

		res.status(200).json(aquariumsWithInhabitants);

	} catch (error) {
		console.error('Fehler:', error);
    res.status(500).json({ message: 'Serverfehler bei der Aquarienabfrage' });
	}
});

// Inhabitant zu einem Aquarium hinzufügen
router.post('/add', async (req, res) => {
  try {
    const { aquariumId, inhabitantId, amount } = req.body;
		console.log(`Route aquariums/add wurde aufgerufen`);

    // Prüfen ob das Aquarium existiert
    const [aquarium] = await pool.query(
      'SELECT * FROM aquariums WHERE id = ?',
      [aquariumId]
    );

    if (aquarium.length === 0) {
      return res.status(404).json({ message: 'Aquarium nicht gefunden' });
    }

    // Prüfen ob der Inhabitant existiert
    const [inhabitant] = await pool.query(
      'SELECT * FROM inhabitants WHERE id = ?',
      [inhabitantId]
    );

    if (inhabitant.length === 0) {
      return res.status(404).json({ message: 'Inhabitant nicht gefunden' });
    }

    // Prüfen ob die Beziehung bereits existiert
    const [existingRelation] = await pool.query(
      'SELECT * FROM inhabitants_aquariums WHERE iid = ? AND aid = ?',
      [inhabitantId, aquariumId]
    );

    if (existingRelation.length > 0) {
      // Wenn bereits vorhanden, Menge aktualisieren
      await pool.query(
        'UPDATE inhabitants_aquariums SET amount = amount + ? WHERE iid = ? AND aid = ?',
        [amount, inhabitantId, aquariumId]
      );
    } else {
      // Neue Beziehung erstellen
      await pool.query(
        'INSERT INTO inhabitants_aquariums (iid, aid, amount) VALUES (?, ?, ?)',
        [inhabitantId, aquariumId, amount]
      );
    }

    res.status(200).json({ 
      message: 'Inhabitant erfolgreich zum Aquarium hinzugefügt'
    });

  } catch (error) {
    console.error('Fehler:', error);
    res.status(500).json({ message: 'Serverfehler beim Hinzufügen des Inhabitants' });
  }
});

module.exports = router;