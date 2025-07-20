const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Alle Inhabitants abfragen
router.get("/all", async (req, res) => {
  try {
    console.log(`Route /all wurde aufgerufen`);
    const [inhabitants] = await pool.query("SELECT * FROM inhabitants");
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
    const [inhabitants] = await pool.query(
      "SELECT * FROM inhabitants WHERE id = ?",
      [id]
    );

    if (inhabitants.length === 0) {
      return res.status(404).json({ message: "Inhabitant nicht gefunden" });
    }

    // Bild in Base64 konvertieren
    const imageBase64 = inhabitants[0].image
      ? Buffer.from(inhabitants[0].image).toString("base64")
      : null;

    const inhabitant = {
      ...inhabitants[0],
      image: imageBase64,
    };

    res.status(200).json(inhabitant);
  } catch (error) {
    console.error("API-Fehler:", error);
    res.status(500).json({ message: "Serverfehler bei Abfrage der Spezies" });
  }
});

// Inhabitant abfragen
router.post("/search", async (req, res) => {
  try {
    console.log("Route /search wurde aufgerufen");
    const { searchText, type, habitat, color, salinity, phValue, temperature } =
      req.body;
    let result = [];

    // 1. Synonyme hinzufügen
    // 1.1 Termtabelle nach Suchtext durchsuchen, Term-IDs hinzufügen
    const [termRows] = await pool.query(
      "SELECT tid FROM terms WHERE term = ?",
      [searchText]
    );
    console.log(termRows);
    // 1.2 Synonymtabelle nach Term-IDs durchsuchen, gefundene IDs hinzufügen
    let termIds = []
    if (termRows.length > 0) {
      termIds.push(termRows[0].tid);
      console.log(termIds[0]);
      const [synonymRows] = await pool.query(
        "SELECT symid FROM synonyms WHERE termid = ? UNION SELECT termid FROM synonyms WHERE symid = ?",
        [termIds[0].tid, termRows[0].tid]
      );
      synonymRows.forEach(row => termIds.push(row.symId || row.termid));
    }
    console.log(termIds);
    // 1.3 Termtabelle nach Namen durchsuchen, basierend auf den gesammlten IDs
    let names = [searchText];
    if (termIds.length > 0) {
      const [nameRows] = await pool.query(
        `SELECT term FROM terms WHERE tid IN (${termIds.map(() => '?').join(',')})`,
        termIds
      );
      names = nameRows.map(row => row.term);
    }
    console.log(names);
    // 2. Sind alle Bedingungen wahr?
    const [inhabitants] = await pool.query(
      `SELECT * FROM inhabitants WHERE name IN (${names.map(() => '?').join(',')}) AND type = ? AND habitat = ? AND color = ?`, // TODO: Include Water Quality and Predators
      [...names, type, habitat, color]
    );
    result = inhabitants;
    if (result.length == 0) {
      // 3. Fuzzy Search und Stemsearch, Narrow Term
      const [narrowterms] = await pool.query(
        "SELECT tid FROM terms WHERE term = ? AND tid <= 7",
        [searchText]
      );
      if (narrowterms.length > 0) {
        const [inhabitants] = await pool.query(
          "SELECT i.* FROM inhabitants i JOIN terms t on i.name = t.term WHERE t.oid = ?",
          [narrowterms[0].id]
        );
        result = inhabitants;
      }
      // TODO: Stemsearch
      // TODO: Fuzzy Search
      if (result.length == 0) {
        // 4. Ist wenigstens eine Bedingung wahr?
        // TODO: Soll LIKE benutzt werden?
        let expandedSearchText = `%${req.body.searchText}%`;
        const [inhabitants] = await pool.query(
          "SELECT * FROM inhabitants WHERE name = ? OR type = ? OR habitat = ? OR color = ?",
          [expandedSearchText, type, habitat, color]
        );
        result = inhabitants;
        if (result.length == 0) {
          // 5. Suche ergibt keine Ergebnisse
          return res
            .status(404)
            .json({ message: "Spezies wurde nicht gefunden" });
        }
      }
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("API-Fehler:", error);
    res.status(500).json({ message: "Serverfehler bei Abfrage der Spezies" });
  }
});

module.exports = router;
