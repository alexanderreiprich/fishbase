const express = require("express");
const router = express.Router();
const inhabitantService = require("../services/inhabitantService");

// Alle Inhabitants abfragen
router.get("/all", async (req, res) => {
  try {
    console.log(`Route /all wurde aufgerufen`);
    const inhabitants = await inhabitantService.getAllInhabitants();

    if (!inhabitants || inhabitants.length === 0) {
      console.log("Keine Daten gefunden!");
      return res.status(404).json({ message: "Keine Inhabitants gefunden" });
    }

    // Bilder in Base64 konvertieren
    const inhabitantsWithBase64 = inhabitants.map((inhabitant) => {
      const imageBase64 = inhabitant.image
        ? Buffer.from(inhabitant.image).toString("base64")
        : null;

      return {
        ...inhabitant,
        image: imageBase64,
      };
    });

    res.status(200).json(inhabitantsWithBase64);
  } catch (error) {
    console.error("API-Fehler:", error);
    res.status(500).json({ message: "Serverfehler bei Abfrage der Spezies" });
  }
});

// Inhabitant nach ID abfragen
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Route /:id wurde aufgerufen mit ID: ${id}`);
    const inhabitant = await inhabitantService.getInhabitantById(id);

    if (!inhabitant) {
      return res.status(404).json({ message: "Inhabitant nicht gefunden" });
    }

    // Bild in Base64 konvertieren
    const imageBase64 = inhabitant.image
      ? Buffer.from(inhabitant.image).toString("base64")
      : null;

    const inhabitantWithBase64 = {
      ...inhabitant,
      image: imageBase64,
    };

    res.status(200).json(inhabitantWithBase64);
  } catch (error) {
    console.error("API-Fehler:", error);
    res.status(500).json({ message: "Serverfehler bei Abfrage der Spezies" });
  }
});

// Abfrage, welche Predators der Inhabitant hat
router.get("/predators/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Route predators/:id wurde aufgerufen mit ID: ${id}`);
    const [predators] = await pool.query(
      "SELECT i.* FROM predators p JOIN inhabitants i ON p.predator = i.id WHERE p.victim = ?",
      [id]
    );

    res.status(200).json(predators);
  } catch (error) {
    console.error("API-Fehler:", error);
    res.status(500).json({ message: "Serverfehler bei Abfrage der Predators" });
  }
});

// Abfrage, welche Victims der Inhabitant hat
router.get("/victims/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Route victims/:id wurde aufgerufen mit ID: ${id}`);
    const [victims] = await pool.query(
      "SELECT i.* FROM predators p JOIN inhabitants i ON p.victim = i.id WHERE p.predator = ?",
      [id]
    );

    res.status(200).json(victims);
  } catch (error) {
    console.error("API-Fehler:", error);
    res.status(500).json({ message: "Serverfehler bei Abfrage der Victims" });
  }
});

// Inhabitant abfragen
router.post("/search", async (req, res) => {
  try {
    console.log("Route /search wurde aufgerufen");
    const searchParams = req.body;
    console.log(searchParams);
    const result = await inhabitantService.searchInhabitants(searchParams);

    if (result.length == 0) {
      return res.status(404).json({ message: "Spezies wurde nicht gefunden" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("API-Fehler:", error);
    res.status(500).json({ message: "Serverfehler bei Abfrage der Spezies" });
  }
});

module.exports = router;
