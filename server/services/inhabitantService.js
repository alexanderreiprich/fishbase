const pool = require('../config/db');

// Hilfsfunktionen für die Suche
async function getSynonymsAndNames(searchText) {
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
  
  return names;
}

async function searchWithExactMatch(names, type, habitat, temperature, phValue, colors) {
  // Dynamische Query basierend auf colors
  let query = `SELECT * FROM inhabitants A, water_quality B WHERE A.id = B.iid AND (A.name IN (${names.map(() => '?').join(',')}) AND A.type=? AND A.habitat=? AND B.minTemperature >= ? AND B.maxTemperature <= ? AND B.minPh >= ? AND B.maxPh <= ?)`;
  let params = [...names, type, habitat, temperature[0], temperature[1], phValue[0], phValue[1]]

  if (colors && colors.length > 0) {
    const colorConditions = colors.map(() => 'color LIKE ?').join(' OR ')
    query += ` AND (${colorConditions})`
    params.push(...colors.map(color => `%${color}%`))
  }
  
  const [inhabitants] = await pool.query(query, params);
  return inhabitants;
}

async function searchWithNarrowTerms(searchText) {
  const [narrowterms] = await pool.query(
    "SELECT tid FROM terms WHERE term = ? AND tid <= 7",
    [searchText]
  );
  if (narrowterms.length > 0) {
    const [inhabitants] = await pool.query(
      "SELECT i.* FROM inhabitants i JOIN terms t on i.name = t.term WHERE t.oid = ?",
      [narrowterms[0].id]
    );
    return inhabitants;
  }
  return [];
}

async function searchWithWildcards(names, type, habitat, temperature, phValue, colors) {
  // Erstelle Wildcard-Bedingungen für alle Namen
	let nameConditions = "";
	let nameParams = [];
	if (names[0] == null) {
		// Keine Namenssuche - nur andere Kriterien
		nameConditions = "";
	}
	else {
		nameConditions = names.map(() => 'A.name LIKE ?').join(' OR ');
		nameParams = names.map(name => `%${name}%`);
	}
  
	// TODO: Clean this up

	// Dynamische Query basierend auf ob Namenssuche vorhanden ist
  let query;
  let params;
  
  // Basis-Query ohne Klammern
  if (nameConditions) {
    // Mit Namenssuche
    query = `SELECT * FROM inhabitants A, water_quality B WHERE A.id = B.iid AND (${nameConditions} OR A.type = ? OR A.habitat = ? OR (B.minTemperature >= ? AND B.maxTemperature <= ?) OR (B.minPh >= ? AND B.maxPh <= ?)`;
    params = [...nameParams, type, habitat, temperature[0], temperature[1], phValue[0], phValue[1]];
  } else {
    // Nur andere Kriterien
    query = `SELECT * FROM inhabitants A, water_quality B WHERE A.id = B.iid AND (A.type = ? OR A.habitat = ? OR (B.minTemperature >= ? AND B.maxTemperature <= ?) OR (B.minPh >= ? AND B.maxPh <= ?)`;
    params = [type, habitat, temperature[0], temperature[1], phValue[0], phValue[1]];
  }

  // Farben hinzufügen
  if (colors && colors.length > 0) {
    const colorConditions = colors.map(() => 'A.color LIKE ?').join(' OR ')
    query += ` OR (${colorConditions})`
    params.push(...colors.map(color => `%${color}%`))
  }
  
  // Klammer schließen
  query += `)`
  
  const [inhabitants] = await pool.query(query, params);
  return inhabitants;
}

// Hauptsuchfunktion
async function searchInhabitants(searchParams) {
  const { searchText, type, habitat, salinity, phValue, temperature, colors } = searchParams;
  let result = [];

  // 1. Synonyme hinzufügen
  const names = await getSynonymsAndNames(searchText);

  // 2. Sind alle Bedingungen wahr?
  result = await searchWithExactMatch(names, type, habitat, temperature, phValue, colors);

  if (result.length == 0) {
    // 3. Fuzzy Search und Stemsearch, Narrow Term
    result = await searchWithNarrowTerms(searchText);

    if (result.length == 0) {
      // 4. Ist wenigstens eine Bedingung wahr?
      result = await searchWithWildcards(names, type, habitat, temperature, phValue, colors);
    }
  }

  return result;
}

// Einzelne Inhabitant abfragen
async function getInhabitantById(id) {
  const [inhabitant] = await pool.query(
    "SELECT * FROM inhabitants WHERE id = ?",
    [id]
  );
  return inhabitant[0];
}

// Alle Inhabitants abfragen
async function getAllInhabitants() {
  const [inhabitants] = await pool.query("SELECT * FROM inhabitants");
  return inhabitants;
}

module.exports = {
  searchInhabitants,
  getInhabitantById,
  getAllInhabitants,
  getSynonymsAndNames,
  searchWithExactMatch,
  searchWithNarrowTerms,
  searchWithWildcards
};
