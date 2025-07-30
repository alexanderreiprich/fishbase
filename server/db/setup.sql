CREATE DATABASE IF NOT EXISTS fishbase;
USE fishbase;

SET FOREIGN_KEY_CHECKS = 0;
SET SESSION sql_mode = '';
SET autocommit = 0;
START TRANSACTION;

DROP TABLE IF EXISTS user;

-- benutzertabelle erstellen
CREATE TABLE user (
  id SMALLINT PRIMARY KEY AUTO_INCREMENT,
  picture BLOB,
  username VARCHAR(20) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(80) NOT NULL,
  favoritefish SMALLINT,
  tank MEDIUMBLOB
);

DROP TABLE IF EXISTS tank;

-- aquarientabelle erstellen
CREATE TABLE tank (
  id SMALLINT PRIMARY KEY AUTO_INCREMENT,
  userid SMALLINT NOT NULL,
  name VARCHAR(50) NOT NULL,
  FOREIGN KEY (userid) REFERENCES users(id)
);

DROP TABLE IF EXISTS inhabitant;


-- artentabelle erstellen
CREATE TABLE inhabitant (
  id SMALLINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  latinname VARCHAR(100),
  habitat VARCHAR(50),
  color VARCHAR(30),
  picture MEDIUMBLOB,
  type VARCHAR(15) NOT NULL,  -- 'fish', 'invertebrate' oder 'plant'
  length FLOAT,            -- nur für tiere
  food VARCHAR(100),       -- nur für tiere
  minheight FLOAT,         -- nur für pflanzen
  maxheight FLOAT          -- nur für pflanzen
);

DROP TABLE IF EXISTS water_quality;

-- wasserqualitäten, wird referenziert von habitat
CREATE TABLE water_quality (
  wid SMALLINT,
  iid SMALLINT,
  salinity DECIMAL,
  minTemperature DECIMAL,
  maxTemperature DECIMAL,
  minPh FLOAT,
  maxPh FLOAT,
  FOREIGN KEY (iid) REFERENCES inhabitants(id),
  PRIMARY KEY (wid)
);

DROP TABLE IF EXISTS aquariums;

-- aquarientabelle erstellen
CREATE TABLE aquariums (
  id SMALLINT PRIMARY KEY AUTO_INCREMENT,
  userid SMALLINT NOT NULL,
  waterqualityid SMALLINT NOT NULL,
  name VARCHAR(50) NOT NULL,
  capacity INT NOT NULL,
  FOREIGN KEY (userid) REFERENCES users(id),
  FOREIGN KEY (waterqualityid) REFERENCES water_quality(wid)
);

DROP TABLE IF EXISTS predator;

-- verbindungstabelle zwischen predator und pray
CREATE TABLE predator (
  predatorId SMALLINT,
  victimId SMALLINT,
  FOREIGN KEY (predatorId) REFERENCES inhabitant(id),
  FOREIGN KEY (victimId) REFERENCES inhabitant(id),
  PRIMARY KEY (predatorId, victimId)
);

DROP TABLE IF EXISTS tank_inhabitant;

-- verbindungstabelle, zeigt welche inhabitant in aquarien sind
CREATE TABLE tank_inhabitant (
  inhabitantId SMALLINT,
  tankId SMALLINT,
  amount SMALLINT,
  FOREIGN KEY (inhabitantId) REFERENCES inhabitant(id),
  FOREIGN KEY (tankId) REFERENCES tank(id),
  PRIMARY KEY (inhabitantId, tankId)
);

DROP TABLE IF EXISTS term;

-- tabelle für oberterme
CREATE TABLE term (
  id SMALLINT PRIMARY KEY AUTO_INCREMENT,
  expression VARCHAR(100),
  genericTermId SMALLINT,
  FOREIGN KEY (genericTermId) REFERENCES term(id)
);

DROP TABLE IF EXISTS synonym;

-- tabelle für synonyme
CREATE TABLE synonym (
  termid SMALLINT,
  symid SMALLINT,
  FOREIGN KEY (termid) REFERENCES term(id),
  FOREIGN KEY (symid) REFERENCES term(id),
  PRIMARY KEY (termid, symid)
);



-- Einfügen von 40 beliebten Aquarienfischen
INSERT INTO inhabitant (name, latinname, habitat, color, type, length, food) VALUES
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
INSERT INTO inhabitant (name, latinname, habitat, color, type, length, food) VALUES
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
INSERT INTO inhabitant (name, latinname, habitat, color, type, minheight, maxheight) VALUES
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
INSERT INTO predator (predatorId, victimId) VALUES
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
INSERT INTO term (expression, genericTermId) VALUES
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
  ('Roter Zwergbuntbarsch', 7),
  -- einfügen von synonymen
  ('Neonsalmler', NULL),
  ('Millionenfisch', NULL),
  ('Platyfisch', NULL),
  ('Schwertträgerfisch', NULL),
  ('Kurzflossenmolly', NULL),
  ('Kardinalsalmler', NULL),
  ('Zebrafisch', NULL),
  ('Kampffisch', NULL),
  ('Segelflosser', NULL),
  ('Diskus', NULL),
  ('Saugwels', NULL),
  ('Zwergfadenfisch', NULL),
  ('Kupfersalmler', NULL),
  ('Flammen-Salmler', NULL),
  ('Axelrod-Salmler', NULL),
  ('Königs-Salmler', NULL),
  ('Rotschwanz', NULL),
  ('Blauer Neonsalmler', NULL),
  ('Roter Neonsalmler', NULL),
  ('Ramirezi', NULL),
  ('Kakadu-Buntbarsch', NULL),
  ('Honiggurami', NULL),
  ('Gefleckter Panzerwels', NULL),
  ('Pandawels', NULL),
  ('Goldpanzerwels', NULL),
  ('Roter Phantom', NULL),
  ('Schwarzer Phantom', NULL),
  ('Kupferbarbe', NULL),
  ('Tigerschärbling', NULL),
  ('Gefleckter Beilbauchfisch', NULL),
  ('Rotbauch-Beilbauchfisch', NULL),
  ('Erbsenkugelfisch', NULL),
  ('Apistogramma', NULL),
  ('Roter Apistogramma', NULL),
  ('Blauer Apistogramma', NULL),
  ('Gelber Apistogramma', NULL);


-- zuordnen der synonyme
INSERT INTO synonym(termid, symid) VALUES
  (48, 8),   
  (49, 9),   
  (50, 10),  
  (51, 11),  
  (52, 12),  
  (53, 13),  
  (54, 14),  
  (55, 15),  
  (56, 16),  
  (57, 17),  
  (58, 18),  
  (59, 29),  
  (60, 20),  
  (61, 21),  
  (62, 26), 
  (63, 23), 
  (64, 24),  
  (65, 25),  
  (66, 26),  
  (67, 27),  
  (68, 28),  
  (69, 19),  
  (70, 30),
  (71, 31),  
  (72, 32), 
  (73, 33),  
  (74, 34), 
  (75, 35),  
  (76, 36),  
  (77, 37),  
  (78, 38),  
  (79, 39),  
  (80, 40),  
  (81, 41), 
  (82, 42),  
  (83, 43);  
  
DROP TABLE IF EXISTS water_quality;

-- wasserqualitäten, wird referenziert von habitat
CREATE TABLE water_quality (
  id SMALLINT,
  inhabitantId SMALLINT,
  salinity FLOAT,
  minTemperature FLOAT,
  maxTemperature FLOAT,
  minPh FLOAT,
  maxPh FLOAT,
  FOREIGN KEY (inhabitantId) REFERENCES inhabitant(id),
  PRIMARY KEY (inhabitantId, id)
);

-- wasserqualitäten pro fisch
INSERT INTO water_quality (id, inhabitantId, salinity, minTemperature, maxTemperature, minPh, maxPh) VALUES 
(0,(SELECT id FROM inhabitant WHERE name='Neonfisch'), 0, 22, 25, 6.0, 7.0),
(1,(SELECT id FROM inhabitant WHERE name='Guppy') ,0,24,28,6.8,7.8),
(2,(SELECT id FROM inhabitant WHERE name='Platy') ,0,21,27,7.0,8.5),
(3,(SELECT id FROM inhabitant WHERE name='Schwertträger') ,0,22,28,7.0,8.0),
(4,(SELECT id FROM inhabitant WHERE name='Molly') ,0,24,28,7.0,8.2),
(5,(SELECT id FROM inhabitant WHERE name='Kardinalfisch'),0,23,27,5.5,7.0),
(6,(SELECT id FROM inhabitant WHERE name='Zebrabärbling'),0,22,28,6.5,7.5),
(7,(SELECT id FROM inhabitant WHERE name='Siamesischer Kampffisch'),0,24,30,6.5,7.5),
(8,(SELECT id FROM inhabitant WHERE name='Skalar'),0,24,28,6.5,7.5),
(9,(SELECT id FROM inhabitant WHERE name='Diskusfisch'),0,28,30,6.0,7.0),
(10,(SELECT id FROM inhabitant WHERE name='Antennenwels'),0,22,25,6.5,7.5),
(11,(SELECT id FROM inhabitant WHERE name='Prachtgurami'),0,24,28,6.0,7.5),
(12,(SELECT id FROM inhabitant WHERE name='Kupferfisch'),0,24,27,6.0,7.0),
(13,(SELECT id FROM inhabitant WHERE name='Roter von Rio'),0,24,28,6.5,7.5),
(14,(SELECT id FROM inhabitant WHERE name='Schwarzband-Salmler'),0,23,27,6.0,7.0),
(15,(SELECT id FROM inhabitant WHERE name='Königssalmler'),0,23,27,6.0,7.0),
(16,(SELECT id FROM inhabitant WHERE name='Feuerschwanz'),0,24,27,6.5,7.5),
(17,(SELECT id FROM inhabitant WHERE name='Blauer Neon'),0,24,26,5.5,6.5),
(18,(SELECT id FROM inhabitant WHERE name='Roter Neon'),0,26,28,5.0,6.5),
(19,(SELECT id FROM inhabitant WHERE name='Schmetterlingsbuntbarsch'),0,26,30,6.0,7.0),
(20,(SELECT id FROM inhabitant WHERE name='Kakadu-Zwergbuntbarsch'),0,24,28,6.0,7.5),
(21,(SELECT id FROM inhabitant WHERE name='Zwergfadenfisch'),0,24,28,6.0,7.5),
(22,(SELECT id FROM inhabitant WHERE name='Marmorierter Panzerwels'),0,22,26,6.5,7.5),
(23,(SELECT id FROM inhabitant WHERE name='Panda-Panzerwels'),0,22,25,6.0,7.5),
(24,(SELECT id FROM inhabitant WHERE name='Goldener Panzerwels'),0,22,26,6.0,7.5),
(25,(SELECT id FROM inhabitant WHERE name='Roter Phantomsalmler'),0,23,27,6.0,7.0),
(26,(SELECT id FROM inhabitant WHERE name='Schwarzer Phantomsalmler'),0,23,27,6.0,7.0),
(27,(SELECT id FROM inhabitant WHERE name='Kupferroter Sumatrabarbe'),0,24,27,6.5,7.5),
(28,(SELECT id FROM inhabitant WHERE name='Sumatrabarbe'),0,24,27,6.5,7.5),
(29,(SELECT id FROM inhabitant WHERE name='Marmorierter Beilbauchfisch'),0,24,28,6.0,7.0),
(30,(SELECT id FROM inhabitant WHERE name='Roter Beilbauchfisch'),0,24,28,6.0,7.0),
(31,(SELECT id FROM inhabitant WHERE name='Zwergkugelfisch'),0,24,28,7.0,7.5),
(32,(SELECT id FROM inhabitant WHERE name='Zwergbuntbarsch'),0,24,28,6.0,7.5);

-- wasserqualitäten pro wirbellose
INSERT INTO water_quality (id, inhabitantId, salinity, minTemperature, maxTemperature, minPh, maxPh) VALUES
(33,(SELECT id FROM inhabitant WHERE name='Rote Posthornschnecke'),0,18,28,6.5,8.0),
(34,(SELECT id FROM inhabitant WHERE name='Gelbe Posthornschnecke'),0,18,28,6.5,8.0),
(35,(SELECT id FROM inhabitant WHERE name='Turmdeckelschnecke'),0,20,28,6.5,7.5),
(36,(SELECT id FROM inhabitant WHERE name='Apfelschnecke'),0,22,28,6.5,8.0),
(37,(SELECT id FROM inhabitant WHERE name='Blaue Apfelschnecke'),0,22,28,6.5,8.0),
(38,(SELECT id FROM inhabitant WHERE name='Amano-Garnele'),0,20,27,6.5,7.5),
(39,(SELECT id FROM inhabitant WHERE name='Rote Zwerggarnele'),0,20,26,6.0,7.5),
(40,(SELECT id FROM inhabitant WHERE name='Gelbe Zwerggarnele'),0,20,26,6.0,7.5),
(41,(SELECT id FROM inhabitant WHERE name='Blaue Zwerggarnele'),0,20,26,6.0,7.5),
(42,(SELECT id FROM inhabitant WHERE name='Bambusgarnele'),0,22,28,6.5,7.5),
(43,(SELECT id FROM inhabitant WHERE name='Rote Nashorngarnele'),0,22,28,6.5,7.5),
(44,(SELECT id FROM inhabitant WHERE name='Tiger-Garnele'),0,20,25,6.0,7.2),
(45,(SELECT id FROM inhabitant WHERE name='Bienen-Garnele'),0,20,25,5.5,6.5),
(46,(SELECT id FROM inhabitant WHERE name='Rote Rennschnecke'),0,22,28,6.5,8.0),
(47,(SELECT id FROM inhabitant WHERE name='Zebra-Rennschnecke'),0,22,28,6.5,8.0); 

-- wasserqualitäten pro pflanzen
INSERT INTO water_quality (id, inhabitantId, salinity, minTemperature, maxTemperature, minPh, maxPh) VALUES
(48,(SELECT id FROM inhabitant WHERE name='Amazonas-Schwertpflanze'),0,22,28,6.5,7.5),
(49,(SELECT id FROM inhabitant WHERE name='Kleiner Wasserkelch'),0,22,28,6.0,7.5),
(50,(SELECT id FROM inhabitant WHERE name='Roter Wasserkelch'),0,22,28,6.0,7.5),
(51,(SELECT id FROM inhabitant WHERE name='Javafarn'),0,20,28,6.0,7.5),
(52,(SELECT id FROM inhabitant WHERE name='Javamoos'),0,18,28,5.5,8.0),
(53,(SELECT id FROM inhabitant WHERE name='Anubias barteri'),0,22,28,6.0,7.5),
(54,(SELECT id FROM inhabitant WHERE name='Anubias nana'),0,22,28,6.0,7.5),
(55,(SELECT id FROM inhabitant WHERE name='Vallisneria spiralis'),0,20,28,6.0,8.0),
(56,(SELECT id FROM inhabitant WHERE name='Rotala rotundifolia'),0,22,28,6.0,7.5),
(57,(SELECT id FROM inhabitant WHERE name='Ludwigia repens'),0,20,28,6.0,7.5),
(58,(SELECT id FROM inhabitant WHERE name='Hornkraut'),0,15,30,6.0,7.5),
(59,(SELECT id FROM inhabitant WHERE name='Wasserpest'),0,15,28,6.5,7.5),
(60,(SELECT id FROM inhabitant WHERE name='Brasilianisches Tausendblatt'),0,22,28,6.0,7.5),
(61,(SELECT id FROM inhabitant WHERE name='Kleefarn'),0,20,28,6.0,7.5),
(62,(SELECT id FROM inhabitant WHERE name='Zwergspeerblatt'),0,22,28,6.0,7.5),
(63,(SELECT id FROM inhabitant WHERE name='Roter Tigerlotus'),0,22,28,6.5,7.5),
(64,(SELECT id FROM inhabitant WHERE name='Grüner Tigerlotus'),0,22,28,6.5,7.5),
(65,(SELECT id FROM inhabitant WHERE name='Bacopa caroliniana'),0,22,28,6.0,7.5),
(66,(SELECT id FROM inhabitant WHERE name='Bacopa monnieri'),0,22,28,6.0,7.5),
(67,(SELECT id FROM inhabitant WHERE name='Hygrophila polysperma'),0,20,28,6.0,7.5),
(68,(SELECT id FROM inhabitant WHERE name='Hygrophila corymbosa'),0,22,28,6.0,7.5),
(69,(SELECT id FROM inhabitant WHERE name='Lilaeopsis brasiliensis'),0,22,28,6.0,7.5),
(70,(SELECT id FROM inhabitant WHERE name='Eleocharis parvula'),0,20,28,6.0,7.5),
(71,(SELECT id FROM inhabitant WHERE name='Eleocharis acicularis'),0,15,26,6.0,7.5),
(72,(SELECT id FROM inhabitant WHERE name='Hemianthus callitrichoides'),0,22,28,6.0,7.0),
(73,(SELECT id FROM inhabitant WHERE name='Glossostigma elatinoides'),0,22,28,5.5,7.0),
(74,(SELECT id FROM inhabitant WHERE name='Riccia fluitans'),0,20,28,6.0,7.5),
(75,(SELECT id FROM inhabitant WHERE name='Pogostemon helferi'),0,22,28,6.0,7.5),
(76,(SELECT id FROM inhabitant WHERE name='Pogostemon erectus'),0,22,28,6.0,7.5),
(77,(SELECT id FROM inhabitant WHERE name='Alternanthera reineckii'),0,22,28,6.0,7.5),
(79,(SELECT id FROM inhabitant WHERE name='Bucephalandra sp.'),0,22,28,6.0,7.0),
(81,(SELECT id FROM inhabitant WHERE name='Cryptocoryne parva'),0,22,28,6.0,7.5),
(82,(SELECT id FROM inhabitant WHERE name='Cryptocoryne undulata'),0,22,28,6.0,7.5),
(83,(SELECT id FROM inhabitant WHERE name='Cryptocoryne crispatula'),0,22,28,6.0,7.5),
(84,(SELECT id FROM inhabitant WHERE name='Echinodorus tenellus'),0,22,28,6.5,7.5),
(85,(SELECT id FROM inhabitant WHERE name='Echinodorus ozelot'),0,22,28,6.5,7.5),
(86,(SELECT id FROM inhabitant WHERE name='Echinodorus red flame'),0,22,28,6.5,7.5),
(87,(SELECT id FROM inhabitant WHERE name='Limnophila sessiliflora'),0,22,28,6.0,7.5),
(88,(SELECT id FROM inhabitant WHERE name='Limnophila aromatica'),0,22,28,6.0,7.5),
(89,(SELECT id FROM inhabitant WHERE name='Rotala macrandra'),0,22,28,6.0,7.0),
(90,(SELECT id FROM inhabitant WHERE name='Rotala wallichii'),0,22,28,6.0,7.0),
(91,(SELECT id FROM inhabitant WHERE name='Rotala indica'),0,22,28,6.0,7.5),
(92,(SELECT id FROM inhabitant WHERE name='Ludwigia arcuata'),0,22,28,6.0,7.5),
(93,(SELECT id FROM inhabitant WHERE name='Ludwigia glandulosa'),0,22,28,6.0,7.5),
(94,(SELECT id FROM inhabitant WHERE name='Proserpinaca palustris'),0,22,28,6.0,7.0),
(95,(SELECT id FROM inhabitant WHERE name='Tonina fluviatilis'),0,24,28,5.5,6.5),
(96,(SELECT id FROM inhabitant WHERE name='Myriophyllum tuberculatum'),0,22,28,6.0,7.0),
(97,(SELECT id FROM inhabitant WHERE name='Cabomba caroliniana'),0,22,28,6.0,7.5);


-- TODO: INSERT INTO inhabitant WHERE id = water_quality.iid (id AS water_quality) VALUES




-- nachher ausführbar mit mysql -u root -p fishbase
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;