CREATE DATABASE IF NOT EXISTS fishbase;
USE fishbase;

SET FOREIGN_KEY_CHECKS = 0;
SET SESSION sql_mode = '';
SET autocommit = 0;
START TRANSACTION;

DROP TABLE IF EXISTS users;

-- benutzertabelle erstellen
CREATE TABLE users (
  id SMALLINT PRIMARY KEY AUTO_INCREMENT,
  picture BLOB,
  username VARCHAR(20) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(80) NOT NULL,
  favoritefish SMALLINT,
  aquarium MEDIUMBLOB
);

DROP TABLE IF EXISTS aquariums;

-- aquarientabelle erstellen
CREATE TABLE aquariums (
  id SMALLINT PRIMARY KEY AUTO_INCREMENT,
  userid SMALLINT NOT NULL,
  name VARCHAR(50) NOT NULL,
  FOREIGN KEY (userid) REFERENCES users(id)
);

DROP TABLE IF EXISTS inhabitants;

-- artentabelle erstellen
CREATE TABLE inhabitants (
  id SMALLINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  latinname VARCHAR(100),
  habitat VARCHAR(50),
  color VARCHAR(30),
  image MEDIUMBLOB,
  type VARCHAR(15) NOT NULL,  -- 'fish', 'invertebrate' oder 'plant'
  length FLOAT,            -- nur für tiere
  food VARCHAR(100),       -- nur für tiere
  minheight FLOAT,         -- nur für pflanzen
  maxheight FLOAT          -- nur für pflanzen
);

DROP TABLE IF EXISTS predators;

-- verbindungstabelle zwischen predator und pray
CREATE TABLE predators (
  predator SMALLINT,
  victim SMALLINT,
  FOREIGN KEY (predator) REFERENCES inhabitants(id),
  FOREIGN KEY (victim) REFERENCES inhabitants(id),
  PRIMARY KEY (predator, victim)
);

DROP TABLE IF EXISTS inhabitants_aquariums;

-- verbindungstabelle, zeigt welche inhabitants in aquarien sind
CREATE TABLE inhabitants_aquariums (
  iid SMALLINT,
  aid SMALLINT,
  amount SMALLINT,
  FOREIGN KEY (iid) REFERENCES inhabitants(id),
  FOREIGN KEY (aid) REFERENCES aquariums(id),
  PRIMARY KEY (iid, aid)
);

DROP TABLE IF EXISTS terms;

-- tabelle für oberterme
CREATE TABLE terms (
  tid SMALLINT PRIMARY KEY AUTO_INCREMENT,
  term VARCHAR(100),
  oid SMALLINT,
  FOREIGN KEY (oid) REFERENCES terms(tid)
);

DROP TABLE IF EXISTS synonyms;

-- tabelle für synonyme
CREATE TABLE synonyms (
  termid SMALLINT,
  symid SMALLINT,
  FOREIGN KEY (termid) REFERENCES terms(tid),
  FOREIGN KEY (symid) REFERENCES terms(tid),
  PRIMARY KEY (termid, symid)
);

-- Einfügen von 40 beliebten Aquarienfischen
INSERT INTO inhabitants (name, latinname, habitat, color, type, length, food) VALUES
('Neonfisch', 'Paracheirodon innesi', 'Südamerika', 'Blau-Rot', 'fish', 3.5, 'Flocken, Lebendfutter'),
('Guppy', 'Poecilia reticulata', 'Südamerika', 'Bunt', 'fish', 4.0, 'Flocken, Lebendfutter'),
('Platy', 'Xiphophorus maculatus', 'Mittelamerika', 'Orange', 'fish', 5.0, 'Flocken, Lebendfutter'),
('Schwertträger', 'Xiphophorus hellerii', 'Mittelamerika', 'Rot', 'fish', 10.0, 'Flocken, Lebendfutter'),
('Molly', 'Poecilia sphenops', 'Mittelamerika', 'Schwarz', 'fish', 6.0, 'Flocken, Lebendfutter'),
('Kardinalfisch', 'Tanichthys albonubes', 'Asien', 'Rot-Blau', 'fish', 4.0, 'Flocken, Lebendfutter'),
('Zebrabärbling', 'Danio rerio', 'Asien', 'Blau-Gold', 'fish', 5.0, 'Flocken, Lebendfutter'),
('Siamesischer Kampffisch', 'Betta splendens', 'Asien', 'Bunt', 'fish', 6.0, 'Flocken, Lebendfutter'),
('Skalar', 'Pterophyllum scalare', 'Südamerika', 'Silber', 'fish', 15.0, 'Flocken, Lebendfutter'),
('Diskusfisch', 'Symphysodon discus', 'Südamerika', 'Bunt', 'fish', 20.0, 'Flocken, Lebendfutter'),
('Antennenwels', 'Ancistrus dolichopterus', 'Südamerika', 'Braun', 'fish', 12.0, 'Algen, Tabletten'),
('Prachtgurami', 'Trichogaster lalius', 'Asien', 'Blau-Rot', 'fish', 8.0, 'Flocken, Lebendfutter'),
('Kupferfisch', 'Hasemania nana', 'Südamerika', 'Kupfer', 'fish', 4.0, 'Flocken, Lebendfutter'),
('Roter von Rio', 'Hyphessobrycon flammeus', 'Südamerika', 'Rot', 'fish', 4.0, 'Flocken, Lebendfutter'),
('Schwarzband-Salmler', 'Gymnocorymbus ternetzi', 'Südamerika', 'Schwarz-Weiß', 'fish', 5.0, 'Flocken, Lebendfutter'),
('Königssalmler', 'Inpaichthys kerri', 'Südamerika', 'Blau', 'fish', 4.0, 'Flocken, Lebendfutter'),
('Feuerschwanz', 'Aphyocharax anisitsi', 'Südamerika', 'Rot', 'fish', 5.0, 'Flocken, Lebendfutter'),
('Blauer Neon', 'Paracheirodon simulans', 'Südamerika', 'Blau', 'fish', 3.0, 'Flocken, Lebendfutter'),
('Roter Neon', 'Paracheirodon axelrodi', 'Südamerika', 'Rot', 'fish', 3.0, 'Flocken, Lebendfutter'),
('Schmetterlingsbuntbarsch', 'Microgeophagus ramirezi', 'Südamerika', 'Bunt', 'fish', 7.0, 'Flocken, Lebendfutter'),
('Kakadu-Zwergbuntbarsch', 'Apistogramma cacatuoides', 'Südamerika', 'Gelb', 'fish', 8.0, 'Flocken, Lebendfutter'),
('Zwergfadenfisch', 'Colisa lalia', 'Asien', 'Blau-Rot', 'fish', 6.0, 'Flocken, Lebendfutter'),
('Marmorierter Panzerwels', 'Corydoras paleatus', 'Südamerika', 'Grau', 'fish', 7.0, 'Tabletten, Lebendfutter'),
('Panda-Panzerwels', 'Corydoras panda', 'Südamerika', 'Schwarz-Weiß', 'fish', 5.0, 'Tabletten, Lebendfutter'),
('Goldener Panzerwels', 'Corydoras aeneus', 'Südamerika', 'Gold', 'fish', 6.0, 'Tabletten, Lebendfutter'),
('Roter Phantomsalmler', 'Hyphessobrycon sweglesi', 'Südamerika', 'Rot', 'fish', 4.0, 'Flocken, Lebendfutter'),
('Schwarzer Phantomsalmler', 'Hyphessobrycon megalopterus', 'Südamerika', 'Schwarz', 'fish', 4.0, 'Flocken, Lebendfutter'),
('Kupferroter Sumatrabarbe', 'Puntius oligolepis', 'Asien', 'Kupfer', 'fish', 5.0, 'Flocken, Lebendfutter'),
('Sumatrabarbe', 'Puntius tetrazona', 'Asien', 'Gelb-Schwarz', 'fish', 6.0, 'Flocken, Lebendfutter'),
('Marmorierter Beilbauchfisch', 'Carnegiella strigata', 'Südamerika', 'Silber', 'fish', 4.0, 'Flocken, Lebendfutter'),
('Roter Beilbauchfisch', 'Carnegiella marthae', 'Südamerika', 'Rot', 'fish', 4.0, 'Flocken, Lebendfutter'),
('Zwergkugelfisch', 'Carinotetraodon travancoricus', 'Asien', 'Gelb', 'fish', 3.0, 'Lebendfutter, Schnecken'),
('Zwergbuntbarsch', 'Apistogramma borellii', 'Südamerika', 'Blau', 'fish', 7.0, 'Flocken, Lebendfutter'),
('Roter Zwergbuntbarsch', 'Apistogramma agassizii', 'Südamerika', 'Rot', 'fish', 8.0, 'Flocken, Lebendfutter'),
('Blauer Zwergbuntbarsch', 'Apistogramma trifasciata', 'Südamerika', 'Blau', 'fish', 7.0, 'Flocken, Lebendfutter'),
('Gelber Zwergbuntbarsch', 'Apistogramma nijsseni', 'Südamerika', 'Gelb', 'fish', 7.0, 'Flocken, Lebendfutter'),
('Roter Zwergbuntbarsch', 'Apistogramma cacatuoides', 'Südamerika', 'Rot', 'fish', 8.0, 'Flocken, Lebendfutter'),
('Blauer Zwergbuntbarsch', 'Apistogramma macmasteri', 'Südamerika', 'Blau', 'fish', 7.0, 'Flocken, Lebendfutter'),
('Gelber Zwergbuntbarsch', 'Apistogramma viejita', 'Südamerika', 'Gelb', 'fish', 7.0, 'Flocken, Lebendfutter'),
('Roter Zwergbuntbarsch', 'Apistogramma hongsloi', 'Südamerika', 'Rot', 'fish', 8.0, 'Flocken, Lebendfutter');

-- Einfügen von 15 beliebten wirbellosen Aquarientieren
INSERT INTO inhabitants (name, latinname, habitat, color, type, length, food) VALUES
('Rote Posthornschnecke', 'Planorbella duryi', 'Südamerika', 'Rot', 'invertebrate', 2.5, 'Algen, Futterreste'),
('Gelbe Posthornschnecke', 'Planorbella duryi', 'Südamerika', 'Gelb', 'invertebrate', 2.5, 'Algen, Futterreste'),
('Turmdeckelschnecke', 'Melanoides tuberculata', 'Asien', 'Braun', 'invertebrate', 3.0, 'Algen, Futterreste'),
('Apfelschnecke', 'Pomacea bridgesii', 'Südamerika', 'Gelb', 'invertebrate', 5.0, 'Algen, Gemüse'),
('Blaue Apfelschnecke', 'Pomacea bridgesii', 'Südamerika', 'Blau', 'invertebrate', 5.0, 'Algen, Gemüse'),
('Amano-Garnele', 'Caridina multidentata', 'Asien', 'Transparent', 'invertebrate', 5.0, 'Algen, Futterreste'),
('Rote Zwerggarnele', 'Neocaridina davidi', 'Asien', 'Rot', 'invertebrate', 2.5, 'Algen, Futterreste'),
('Gelbe Zwerggarnele', 'Neocaridina davidi', 'Asien', 'Gelb', 'invertebrate', 2.5, 'Algen, Futterreste'),
('Blaue Zwerggarnele', 'Neocaridina davidi', 'Asien', 'Blau', 'invertebrate', 2.5, 'Algen, Futterreste'),
('Bambusgarnele', 'Atyopsis moluccensis', 'Asien', 'Braun', 'invertebrate', 7.0, 'Filtrierer, Mikroorganismen'),
('Rote Nashorngarnele', 'Caridina gracilirostris', 'Asien', 'Rot', 'invertebrate', 3.0, 'Algen, Futterreste'),
('Tiger-Garnele', 'Caridina cantonensis', 'Asien', 'Schwarz-Weiß', 'invertebrate', 3.0, 'Algen, Futterreste'),
('Bienen-Garnele', 'Caridina cantonensis', 'Asien', 'Schwarz-Weiß', 'invertebrate', 3.0, 'Algen, Futterreste'),
('Rote Rennschnecke', 'Neritina natalensis', 'Afrika', 'Rot', 'invertebrate', 2.5, 'Algen'),
('Zebra-Rennschnecke', 'Neritina natalensis', 'Afrika', 'Schwarz-Weiß', 'invertebrate', 2.5, 'Algen');

-- Einfügen von 50 beliebten Aquarienpflanzen
INSERT INTO inhabitants (name, latinname, habitat, color, type, minheight, maxheight) VALUES
('Amazonas-Schwertpflanze', 'Echinodorus bleheri', 'Südamerika', 'Grün', 'plant', 30.0, 50.0),
('Kleiner Wasserkelch', 'Cryptocoryne wendtii', 'Asien', 'Grün-Braun', 'plant', 10.0, 20.0),
('Roter Wasserkelch', 'Cryptocoryne wendtii', 'Asien', 'Rot-Braun', 'plant', 10.0, 20.0),
('Javafarn', 'Microsorum pteropus', 'Asien', 'Grün', 'plant', 15.0, 30.0),
('Javamoos', 'Taxiphyllum barbieri', 'Asien', 'Grün', 'plant', 2.0, 5.0),
('Anubias barteri', 'Anubias barteri', 'Afrika', 'Grün', 'plant', 15.0, 25.0),
('Anubias nana', 'Anubias barteri var. nana', 'Afrika', 'Grün', 'plant', 5.0, 10.0),
('Vallisneria spiralis', 'Vallisneria spiralis', 'Europa', 'Grün', 'plant', 30.0, 50.0),
('Rotala rotundifolia', 'Rotala rotundifolia', 'Asien', 'Rot', 'plant', 20.0, 40.0),
('Ludwigia repens', 'Ludwigia repens', 'Nordamerika', 'Rot-Grün', 'plant', 20.0, 40.0),
('Hornkraut', 'Ceratophyllum demersum', 'Weltweit', 'Grün', 'plant', 30.0, 100.0),
('Wasserpest', 'Egeria densa', 'Südamerika', 'Grün', 'plant', 30.0, 100.0),
('Brasilianisches Tausendblatt', 'Myriophyllum aquaticum', 'Südamerika', 'Grün', 'plant', 20.0, 40.0),
('Kleefarn', 'Marsilea hirsuta', 'Australien', 'Grün', 'plant', 5.0, 10.0),
('Zwergspeerblatt', 'Anubias barteri var. nana', 'Afrika', 'Grün', 'plant', 5.0, 10.0),
('Roter Tigerlotus', 'Nymphaea lotus', 'Afrika', 'Rot', 'plant', 20.0, 40.0),
('Grüner Tigerlotus', 'Nymphaea lotus', 'Afrika', 'Grün', 'plant', 20.0, 40.0),
('Bacopa caroliniana', 'Bacopa caroliniana', 'Nordamerika', 'Grün', 'plant', 20.0, 40.0),
('Bacopa monnieri', 'Bacopa monnieri', 'Asien', 'Grün', 'plant', 15.0, 30.0),
('Hygrophila polysperma', 'Hygrophila polysperma', 'Asien', 'Grün', 'plant', 20.0, 40.0),
('Hygrophila corymbosa', 'Hygrophila corymbosa', 'Asien', 'Grün', 'plant', 30.0, 50.0),
('Lilaeopsis brasiliensis', 'Lilaeopsis brasiliensis', 'Südamerika', 'Grün', 'plant', 5.0, 10.0),
('Eleocharis parvula', 'Eleocharis parvula', 'Nordamerika', 'Grün', 'plant', 5.0, 10.0),
('Eleocharis acicularis', 'Eleocharis acicularis', 'Weltweit', 'Grün', 'plant', 10.0, 20.0),
('Hemianthus callitrichoides', 'Hemianthus callitrichoides', 'Kuba', 'Grün', 'plant', 3.0, 5.0),
('Glossostigma elatinoides', 'Glossostigma elatinoides', 'Australien', 'Grün', 'plant', 2.0, 5.0),
('Riccia fluitans', 'Riccia fluitans', 'Weltweit', 'Grün', 'plant', 1.0, 3.0),
('Pogostemon helferi', 'Pogostemon helferi', 'Asien', 'Grün', 'plant', 5.0, 10.0),
('Pogostemon erectus', 'Pogostemon erectus', 'Asien', 'Grün', 'plant', 20.0, 40.0),
('Alternanthera reineckii', 'Alternanthera reineckii', 'Südamerika', 'Rot', 'plant', 20.0, 40.0),
('Alternanthera reineckii mini', 'Alternanthera reineckii', 'Südamerika', 'Rot', 'plant', 10.0, 20.0),
('Bucephalandra sp.', 'Bucephalandra sp.', 'Asien', 'Grün', 'plant', 5.0, 15.0),
('Bucephalandra sp. Red', 'Bucephalandra sp.', 'Asien', 'Rot', 'plant', 5.0, 15.0),
('Cryptocoryne parva', 'Cryptocoryne parva', 'Asien', 'Grün', 'plant', 5.0, 10.0),
('Cryptocoryne undulata', 'Cryptocoryne undulata', 'Asien', 'Grün-Braun', 'plant', 10.0, 20.0),
('Cryptocoryne crispatula', 'Cryptocoryne crispatula', 'Asien', 'Grün', 'plant', 20.0, 40.0),
('Echinodorus tenellus', 'Echinodorus tenellus', 'Südamerika', 'Grün', 'plant', 5.0, 10.0),
('Echinodorus ozelot', 'Echinodorus ozelot', 'Südamerika', 'Grün-Rot', 'plant', 20.0, 40.0),
('Echinodorus red flame', 'Echinodorus red flame', 'Südamerika', 'Rot', 'plant', 20.0, 40.0),
('Limnophila sessiliflora', 'Limnophila sessiliflora', 'Asien', 'Grün', 'plant', 20.0, 40.0),
('Limnophila aromatica', 'Limnophila aromatica', 'Asien', 'Rot-Grün', 'plant', 20.0, 40.0),
('Rotala macrandra', 'Rotala macrandra', 'Asien', 'Rot', 'plant', 20.0, 40.0),
('Rotala wallichii', 'Rotala wallichii', 'Asien', 'Rot', 'plant', 20.0, 40.0),
('Rotala indica', 'Rotala indica', 'Asien', 'Rot-Grün', 'plant', 20.0, 40.0),
('Ludwigia arcuata', 'Ludwigia arcuata', 'Nordamerika', 'Rot', 'plant', 20.0, 40.0),
('Ludwigia glandulosa', 'Ludwigia glandulosa', 'Nordamerika', 'Rot', 'plant', 20.0, 40.0),
('Proserpinaca palustris', 'Proserpinaca palustris', 'Nordamerika', 'Rot-Grün', 'plant', 20.0, 40.0),
('Tonina fluviatilis', 'Tonina fluviatilis', 'Südamerika', 'Grün', 'plant', 20.0, 40.0),
('Myriophyllum tuberculatum', 'Myriophyllum tuberculatum', 'Asien', 'Rot', 'plant', 20.0, 40.0),
('Cabomba caroliniana', 'Cabomba caroliniana', 'Südamerika', 'Grün', 'plant', 30.0, 50.0);

-- einfügen von predator relationships
INSERT INTO predators (predator, victim) VALUES
  (8, 1),
  (8, 2),
  (8, 6),
  (8, 18),
  (8, 19),
  (8, 30),
  (9, 1),
  (9, 2),
  (9, 6),
  (9, 13),
  (9, 14),
  (9, 15),
  (9, 16),
  (9, 18),
  (9, 19),
  (9, 25),
  (9, 26),
  (10, 1),
  (10, 2),
  (10, 6),
  (10, 13),
  (10, 14),
  (10, 18),
  (10, 19),
  (10, 25),
  (10, 26),
  (28, 1),
  (28, 6),
  (28, 18),
  (28, 19),
  (31, 1),
  (31, 18),
  (31, 19);

-- einfügen von oberbegriffen
INSERT INTO terms (term, oid) VALUES
  ('Buntbarsch', NULL),
  ('Bärbling', NULL),
  ('Labyrinthfisch', NULL),
  ('Lebendgebärender Zahnkarpfen', NULL),
  ('Panzerwels', NULL),
  ('Salmler', NULL),
  ('Zierfisch', NULL),
  ('Neonfisch', 6),
  ('Guppy', 4),
  ('Platy', 4),
  ('Schwertträger', 4),
  ('Molly', 4),
  ('Kardinalfisch', 7),
  ('Zebrabärbling', 2),
  ('Siamesischer Kampffisch', 3),
  ('Skalar', 1),
  ('Diskusfisch', 1),
  ('Antennenwels', 7),
  ('Prachtgurami', 7),
  ('Kupferfisch', 7),
  ('Roter von Rio', 7),
  ('Schwarzband-Salmler', 6),
  ('Königssalmler', 7),
  ('Feuerschwanz', 6),
  ('Blauer Neon', 6),
  ('Roter Neon', 6),
  ('Schmetterlingsbuntbarsch', 7),
  ('Kakadu-Zwergbuntbarsch', 7),
  ('Zwergfadenfisch', 7),
  ('Marmorierter Panzerwels', 5),
  ('Panda-Panzerwels', 5),
  ('Goldener Panzerwels', 5),
  ('Roter Phantomsalmler', 7),
  ('Schwarzer Phantomsalmler', 7),
  ('Kupferroter Sumatrabarbe', 7),
  ('Sumatrabarbe', 7),
  ('Marmorierter Beilbauchfisch', 6),
  ('Roter Beilbauchfisch', 6),
  ('Zwergkugelfisch', 7),
  ('Zwergbuntbarsch', 7),
  ('Roter Zwergbuntbarsch', 7),
  ('Blauer Zwergbuntbarsch', 7),
  ('Gelber Zwergbuntbarsch', 7),
  ('Roter Zwergbuntbarsch', 7),
  ('Blauer Zwergbuntbarsch', 7),
  ('Gelber Zwergbuntbarsch', 7),
  ('Roter Zwergbuntbarsch', 7);

-- nachher ausführbar mit mysql -u root -p fishbase
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;