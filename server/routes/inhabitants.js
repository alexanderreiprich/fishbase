const express = require("express")
const router = express.Router()
const pool = require("../config/db")

// Alle Inhabitants abfragen
router.get("/all", async (req, res) => {
  try {
    console.log(`Route /all wurde aufgerufen`)
    const [inhabitants] = await pool.query("SELECT * FROM inhabitants")
    if (!inhabitants || inhabitants.length === 0) {
      console.log("Keine Daten gefunden!")
      return res.status(404).json({ message: "Keine Inhabitants gefunden" })
    }

    // Bilder in Base64 konvertieren
    const inhabitantsWithBase64 = inhabitants.map((inhabitant) => {
      const imageBase64 = inhabitant.image
        ? Buffer.from(inhabitant.image).toString("base64")
        : null

      return {
        ...inhabitant,
        image: imageBase64,
      }
    })

    res.status(200).json(inhabitantsWithBase64)
  } catch (error) {
    console.error("API-Fehler:", error)
    res.status(500).json({ message: "Serverfehler bei Abfrage der Spezies" })
  }
})

// Inhabitant nach ID abfragen
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    console.log(`Route /:id wurde aufgerufen mit ID: ${id}`)
    const [inhabitants] = await pool.query(
      "SELECT * FROM inhabitants WHERE id = ?",
      [id]
    )

    if (inhabitants.length === 0) {
      return res.status(404).json({ message: "Inhabitant nicht gefunden" })
    }

    // Bild in Base64 konvertieren
    const imageBase64 = inhabitants[0].image
      ? Buffer.from(inhabitants[0].image).toString("base64")
      : null

    const inhabitant = {
      ...inhabitants[0],
      image: imageBase64,
    }

    res.status(200).json(inhabitant)
  } catch (error) {
    console.error("API-Fehler:", error)
    res.status(500).json({ message: "Serverfehler bei Abfrage der Spezies" })
  }
})

// Inhabitant abfragen
router.post("/search", async (req, res) => {
  try {
    console.log("Route /search wurde aufgerufen")
    const {
      searchText,
      type,
      habitat,
      salinity,
      phValue,
      temperature,
      colors,
    } = req.body
    let result = []

    const wildcardSearch = "%" + searchText + "%"

    // Dynamische Query basierend auf colors
    let query = "SELECT * FROM Inhabitants A, water_quality B WHERE A.ID = B.IID AND (A.name LIKE ? AND A.type=? AND A.habitat=? AND B.salinity = ? AND B.mintemperature >= ? AND B.maxtemperature <= ? AND B.minph >= ? AND B.maxph <= ?)"
    let params = [wildcardSearch, type, habitat, salinity, temperature[0], temperature[1], phValue[0], phValue[1]]

    if (colors && colors.length > 0) {
      const colorConditions = colors.map(() => 'color LIKE ?').join(' OR ')
      query += ` AND (${colorConditions})`
      params.push(...colors.map(color => `%${color}%`))
    }

    const [inhabitants] = await pool.query(query, params)

    result = inhabitants
    if (inhabitants.length == 0) {
      // 2. Ist wenigstens eine Bedingung wahr?
      let fallbackQuery = "SELECT * FROM inhabitants WHERE name = ? OR type = ? OR habitat = ?"
      let fallbackParams = [searchText, type, habitat]
      
      if (colors && colors.length > 0) {
        const colorConditions = colors.map(() => 'color LIKE ?').join(' OR ')
        fallbackQuery += ` OR (${colorConditions})`
        fallbackParams.push(...colors.map(color => `%${color}%`))
      }

      const [inhabitants] = await pool.query(fallbackQuery, fallbackParams)
      result = inhabitants
      if (inhabitants.length == 0) {
        // 3. Ist der Suchtext irgendwo enthalten?
        let expandedSearchText = `%${req.body.searchText}%`
        let fuzzyQuery = "SELECT * FROM inhabitants WHERE name LIKE ? OR type = ? OR habitat = ?"
        let fuzzyParams = [expandedSearchText, type, habitat]
        
        if (colors && colors.length > 0) {
          const colorConditions = colors.map(() => 'color LIKE ?').join(' OR ')
          fuzzyQuery += ` OR (${colorConditions})`
          fuzzyParams.push(...colors.map(color => `%${color}%`))
        }

        const [inhabitants] = await pool.query(fuzzyQuery, fuzzyParams)
        result = inhabitants
        if (inhabitants.length == 0) {
          // 4. Fuzzy-Search und Stem-Search aktivieren
          return res
            .status(404)
            .json({ message: "Spezies wurde nicht gefunden" })
        }
      }
    }

    res.status(200).json(result)
  } catch (error) {
    console.error("API-Fehler:", error)
    res.status(500).json({ message: "Serverfehler bei Abfrage der Spezies" })
  }
})

module.exports = router
