const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const path = require("path");

async function insertImages() {
  // Datenbankverbindung herstellen
  const connection = await mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
  });

  try {
    // Verzeichnis mit den Bildern
    const imagesDir = path.join(__dirname, "images");
    let latinNames = [];
    // Alle Dateien im Verzeichnis lesen
    const files = await fs.readdir(imagesDir);
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        // Bild einlesen
        const imagePath = path.join(imagesDir, file);
        const imageBuffer = await fs.readFile(imagePath);

        // Dateinamen ohne Endung und Suffix als Suchkriterium verwenden
        const fileName = path.parse(file).name;
        const latinName = fileName.split("_")[0]; // Extrahiert den Teil vor dem Unterstrich
        if (!latinNames.includes(latinName)) {
          // Bild in die Datenbank einfügen
          await connection.execute(
            "UPDATE inhabitants SET image = ? WHERE latinname = ?",
            [imageBuffer, latinName]
          );
        } else {
          await connection.execute(
            "UPDATE inhabitants SET image = ? WHERE name = ?",
            [imageBuffer, fileName.split("_")[1]]
          );
        }
        latinNames.push(latinName);
        console.log(`Bild für ${latinName} eingefügt`);
      }
    }
    console.log(`Alle Bilder wurden erfolgreich eingefügt`);
  } catch (error) {
    console.error("Fehler beim Einfügen der Bilder:", error);
  } finally {
    await connection.end();
  }
}

insertImages();
