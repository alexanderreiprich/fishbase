const pool = require('../config/db');

// Hilfsfunktionen für die Suche
async function getSynonymsAndNames(searchText) {
  // 1.1 Termtabelle nach Suchtext durchsuchen, Term-IDs hinzufügen
  const [termRows] = await pool.query(
    'SELECT id FROM term WHERE expression = ?',
    [searchText]
  );
  console.log('termrows :', termRows);

  // 1.2 Synonymtabelle nach Term-IDs durchsuchen, gefundene IDs hinzufügen
  let termIds = [];
  if (termRows.length > 0) {
    termIds.push(termRows[0].id);
    console.log('id at termids index 0 ', termIds[0]);
    const [synonymRows] = await pool.query(
      'SELECT symid FROM synonym WHERE termid = ? UNION SELECT termid FROM synonyms WHERE symid = ?',
      [termIds[0], termRows[0].id]
    );
    synonymRows.forEach((row) => termIds.push(row.symId || row.termid));
  }
  console.log('termIds: ', termIds);

  // 1.3 Termtabelle nach Namen durchsuchen, basierend auf den gesammlten IDs
  let names = [searchText];
  if (termIds.length > 0) {
    const [nameRows] = await pool.query(
      `SELECT expression FROM term WHERE id IN (${termIds
        .map(() => '?')
        .join(',')})`,
      termIds
    );
    names = nameRows.map((row) => row.term);
  }

  return names;
}

async function searchWithExactMatch(
  names,
  type,
  habitat,
  temperature,
  phValue,
  colors
) {
  // Dynamische Query basierend auf ausgefüllten Feldern
  let whereClauses = ['A.id = B.inhabitantId'];
  let params = [];

  if (names && names.length > 0 && names[0] != null) {
    whereClauses.push(`A.name IN (${names.map(() => '?').join(',')})`);
    params.push(...names);
  }
  if (
    temperature &&
    temperature.length === 2 &&
    temperature[0] != null &&
    temperature[1] != null
  ) {
    whereClauses.push('B.minTemperature >= ? AND B.maxTemperature <= ?');
    params.push(temperature[0], temperature[1]);
  }
  if (
    phValue &&
    phValue.length === 2 &&
    phValue[0] != null &&
    phValue[1] != null
  ) {
    whereClauses.push('B.minPh >= ? AND B.maxPh <= ?');
    params.push(phValue[0], phValue[1]);
  }
  if (colors && colors.length > 0) {
    const colorConditions = colors.map(() => 'A.color LIKE ?').join(' OR ');
    whereClauses.push(`(${colorConditions})`);
    params.push(...colors.map((color) => `%${color}%`));
  }
  if (type) {
    whereClauses.push('A.type = ?');
    params.push(type);
  }
  if (habitat) {
    whereClauses.push('A.habitat = ?');
    params.push(habitat);
  }

  let query = `SELECT * FROM inhabitant A, water_quality B WHERE ${whereClauses.join(
    ' AND '
  )}`;
  const [inhabitants] = await pool.query(query, params);
  return inhabitants;
}

async function searchWithNarrowTerms(searchText) {
  const [narrowterms] = await pool.query(
    'SELECT id FROM term WHERE expression = ? AND id <= 7',
    [searchText]
  );
  if (narrowterms.length > 0) {
    const [inhabitants] = await pool.query(
      'SELECT i.* FROM inhabitant i JOIN term t on i.name = t.expression WHERE t.genericTermId = ?',
      [narrowterms[0].id]
    );
    return inhabitants;
  }
  return [];
}

async function searchWithWildcards(
  names,
  type,
  habitat,
  temperature,
  phValue,
  colors
) {
  let whereClauses = ['A.id = B.inhabitantId'];
  let params = [];

  if (names && names.length > 0 && names[0] != null) {
    const nameConditions = names.map(() => 'A.name LIKE ?').join(' OR ');
    whereClauses.push(`(${nameConditions})`);
    params.push(...names.map((name) => `%${name}%`));
  }
  if (
    temperature &&
    temperature.length === 2 &&
    temperature[0] != 0 &&
    temperature[1] != 1
  ) {
    whereClauses.push('B.minTemperature >= ? AND B.maxTemperature <= ?');
    params.push(temperature[0], temperature[1]);
  }
  if (phValue && phValue.length === 2 && phValue[0] != 0 && phValue[1] != 1) {
    whereClauses.push('B.minPh >= ? AND B.maxPh <= ?');
    params.push(phValue[0], phValue[1]);
  }
  if (colors && colors.length > 0) {
    const colorConditions = colors.map(() => 'A.color LIKE ?').join(' OR ');
    whereClauses.push(`(${colorConditions})`);
    params.push(...colors.map((color) => `%${color}%`));
  }
  if (type) {
    whereClauses.push('A.type = ?');
    params.push(type);
  }
  if (habitat) {
    whereClauses.push('A.habitat = ?');
    params.push(habitat);
  }

  let query = `SELECT * FROM inhabitant A, water_quality B WHERE ${whereClauses.join(
    ' AND '
  )}`;
  const [inhabitants] = await pool.query(query, params);
  return inhabitants;
}

async function searchWithOrConstraint(
  names,
  type,
  habitat,
  temperature,
  phValue,
  colors
) {
  let whereClauses = ['A.id = B.inhabitantId'];
  let orConditions = [];
  let params = [];

  if (names && names.length > 0 && names[0] != null) {
    whereClauses.push(names.map(() => 'A.name LIKE ?'));
    params.push(...names.map((name) => `%${name}%`));
  }
  if (
    temperature &&
    temperature.length === 2 &&
    temperature[0] != null &&
    temperature[1] != null
  ) {
    orConditions.push('(B.minTemperature >= ? AND B.maxTemperature <= ?)');
    params.push(temperature[0], temperature[1]);
  }
  if (
    phValue &&
    phValue.length === 2 &&
    phValue[0] != null &&
    phValue[1] != null
  ) {
    orConditions.push('(B.minPh >= ? AND B.maxPh <= ?)');
    params.push(phValue[0], phValue[1]);
  }
  if (colors && colors.length > 0) {
    orConditions.push(colors.map(() => 'A.color LIKE ?').join(' OR '));
    params.push(...colors.map((color) => `%${color}%`));
  }
  if (type) {
    orConditions.push('A.type = ?');
    params.push(type);
  }
  if (habitat) {
    orConditions.push('A.habitat = ?');
    params.push(habitat);
  }

  let query = `SELECT * FROM inhabitant A, water_quality B WHERE ${whereClauses.join(
    ' AND '
  )} AND (${orConditions.join(' OR ')})`;
  const [inhabitants] = await pool.query(query, params);
  return inhabitants;
}

// Hauptsuchfunktion
async function searchInhabitants(searchParams) {
  const { searchText, type, habitat, salinity, phValue, temperature, colors } =
    searchParams;
  let result = [];

  // 1. Synonyme hinzufügen
  const names = await getSynonymsAndNames(searchText);

  // 2. Sind alle Bedingungen wahr?
  result = await searchWithExactMatch(
    names,
    type,
    habitat,
    temperature,
    phValue,
    colors
  );

  if (result.length == 0) {
    // 3. Narrow Term
    result = await searchWithNarrowTerms(searchText);

    if (result.length == 0) {
      // 4. Wildcards
      result = await searchWithWildcards(
        names,
        type,
        habitat,
        temperature,
        phValue,
        colors
      );

      if (result.length == 0) {
        // 5. Ist wenigstens eine Bedingung wahr?
        result = await searchWithOrConstraint(
          names,
          type,
          habitat,
          temperature,
          phValue,
          colors
        );
      }
    }
  }

  return result;
}

// Einzelne Inhabitant abfragen
async function getInhabitantById(id) {
  const [inhabitant] = await pool.query(
    'SELECT * FROM inhabitant WHERE id = ?',
    [id]
  );
  return inhabitant[0];
}

// Alle Inhabitants abfragen
async function getAllInhabitants() {
  const [inhabitants] = await pool.query('SELECT * FROM inhabitant');
  return inhabitants;
}

module.exports = {
  searchInhabitants,
  getInhabitantById,
  getAllInhabitants,
  getSynonymsAndNames,
  searchWithExactMatch,
  searchWithNarrowTerms,
  searchWithWildcards,
};
