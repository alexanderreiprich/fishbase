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
  content VARCHAR(200),
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
  predators TEXT,          -- extrabeschreibung, optional
  image MEDIUMBLOB,
  type VARCHAR(15) NOT NULL,  -- 'fish', 'invertebrate' oder 'plant'
  length FLOAT,            -- nur für tiere
  food VARCHAR(100),       -- nur für tiere
  minheight FLOAT,         -- nur für pflanzen
  maxheight FLOAT          -- nur für pflanzen
);

CREATE TABLE predators (
  predator SMALLINT,
  victim SMALLINT,
  FOREIGN KEY (predator) REFERENCES inhabitants(id),
  FOREIGN KEY (victim) REFERENCES inhabitants(id),
  PRIMARY KEY (predator, victim)
);

CREATE TABLE inhabitants_aquariums (
  iid SMALLINT,
  aid SMALLINT,
  amount SMALLINT,
  FOREIGN KEY (iid) REFERENCES inhabitants(id),
  FOREIGN KEY (aid) REFERENCES aquariums(id),
  PRIMARY KEY (iid, aid)
);

CREATE TABLE terms (
  tid SMALLINT PRIMARY KEY AUTO_INCREMENT,
  term VARCHAR(100),
  oid SMALLINT,
  FOREIGN KEY (oid) REFERENCES terms(tid) --oberterm
);

CREATE TABLE synonyms (
  termid SMALLINT,
  symid SMALLINT,
  FOREIGN KEY (termid) REFERENCES terms(id),
  FOREIGN KEY (symid) REFERENCES terms(id),
  PRIMARY KEY (termid, symid)
);

-- Einfügen von 40 beliebten Aquarienfischen
INSERT INTO inhabitants (name, latinname, habitat, color, predators, type, length, food) VALUES
('Neonfisch', 'Paracheirodon innesi', 'Südamerika', 'Blau-Rot', '1,2,3', 'fish', 3.5, 'Flocken, Lebendfutter'),
('Guppy', 'Poecilia reticulata', 'Südamerika', 'Bunt', '1,2,3', 'fish', 4.0, 'Flocken, Lebendfutter'),
('Platy', 'Xiphophorus maculatus', 'Mittelamerika', 'Orange', '1,2,3', 'fish', 5.0, 'Flocken, Lebendfutter'),
('Schwertträger', 'Xiphophorus hellerii', 'Mittelamerika', 'Rot', '1,2,3', 'fish', 10.0, 'Flocken, Lebendfutter'),
('Molly', 'Poecilia sphenops', 'Mittelamerika', 'Schwarz', '1,2,3', 'fish', 6.0, 'Flocken, Lebendfutter'),
('Kardinalfisch', 'Tanichthys albonubes', 'Asien', 'Rot-Blau', '1,2,3', 'fish', 4.0, 'Flocken, Lebendfutter'),
('Zebrabärbling', 'Danio rerio', 'Asien', 'Blau-Gold', '1,2,3', 'fish', 5.0, 'Flocken, Lebendfutter'),
('Siamesischer Kampffisch', 'Betta splendens', 'Asien', 'Bunt', '1,2,3', 'fish', 6.0, 'Flocken, Lebendfutter'),
('Skalar', 'Pterophyllum scalare', 'Südamerika', 'Silber', '1,2,3', 'fish', 15.0, 'Flocken, Lebendfutter'),
('Diskusfisch', 'Symphysodon discus', 'Südamerika', 'Bunt', '1,2,3', 'fish', 20.0, 'Flocken, Lebendfutter'),
('Antennenwels', 'Ancistrus dolichopterus', 'Südamerika', 'Braun', '1,2,3', 'fish', 12.0, 'Algen, Tabletten'),
('Prachtgurami', 'Trichogaster lalius', 'Asien', 'Blau-Rot', '1,2,3', 'fish', 8.0, 'Flocken, Lebendfutter'),
('Kupferfisch', 'Hasemania nana', 'Südamerika', 'Kupfer', '1,2,3', 'fish', 4.0, 'Flocken, Lebendfutter'),
('Roter von Rio', 'Hyphessobrycon flammeus', 'Südamerika', 'Rot', '1,2,3', 'fish', 4.0, 'Flocken, Lebendfutter'),
('Schwarzband-Salmler', 'Gymnocorymbus ternetzi', 'Südamerika', 'Schwarz-Weiß', '1,2,3', 'fish', 5.0, 'Flocken, Lebendfutter'),
('Königssalmler', 'Inpaichthys kerri', 'Südamerika', 'Blau', '1,2,3', 'fish', 4.0, 'Flocken, Lebendfutter'),
('Feuerschwanz', 'Aphyocharax anisitsi', 'Südamerika', 'Rot', '1,2,3', 'fish', 5.0, 'Flocken, Lebendfutter'),
('Blauer Neon', 'Paracheirodon simulans', 'Südamerika', 'Blau', '1,2,3', 'fish', 3.0, 'Flocken, Lebendfutter'),
('Roter Neon', 'Paracheirodon axelrodi', 'Südamerika', 'Rot', '1,2,3', 'fish', 3.0, 'Flocken, Lebendfutter'),
('Schmetterlingsbuntbarsch', 'Microgeophagus ramirezi', 'Südamerika', 'Bunt', '1,2,3', 'fish', 7.0, 'Flocken, Lebendfutter'),
('Kakadu-Zwergbuntbarsch', 'Apistogramma cacatuoides', 'Südamerika', 'Gelb', '1,2,3', 'fish', 8.0, 'Flocken, Lebendfutter'),
('Zwergfadenfisch', 'Colisa lalia', 'Asien', 'Blau-Rot', '1,2,3', 'fish', 6.0, 'Flocken, Lebendfutter'),
('Marmorierter Panzerwels', 'Corydoras paleatus', 'Südamerika', 'Grau', '1,2,3', 'fish', 7.0, 'Tabletten, Lebendfutter'),
('Panda-Panzerwels', 'Corydoras panda', 'Südamerika', 'Schwarz-Weiß', '1,2,3', 'fish', 5.0, 'Tabletten, Lebendfutter'),
('Goldener Panzerwels', 'Corydoras aeneus', 'Südamerika', 'Gold', '1,2,3', 'fish', 6.0, 'Tabletten, Lebendfutter'),
('Roter Phantomsalmler', 'Hyphessobrycon sweglesi', 'Südamerika', 'Rot', '1,2,3', 'fish', 4.0, 'Flocken, Lebendfutter'),
('Schwarzer Phantomsalmler', 'Hyphessobrycon megalopterus', 'Südamerika', 'Schwarz', '1,2,3', 'fish', 4.0, 'Flocken, Lebendfutter'),
('Kupferroter Sumatrabarbe', 'Puntius oligolepis', 'Asien', 'Kupfer', '1,2,3', 'fish', 5.0, 'Flocken, Lebendfutter'),
('Sumatrabarbe', 'Puntius tetrazona', 'Asien', 'Gelb-Schwarz', '1,2,3', 'fish', 6.0, 'Flocken, Lebendfutter'),
('Marmorierter Beilbauchfisch', 'Carnegiella strigata', 'Südamerika', 'Silber', '1,2,3', 'fish', 4.0, 'Flocken, Lebendfutter'),
('Roter Beilbauchfisch', 'Carnegiella marthae', 'Südamerika', 'Rot', '1,2,3', 'fish', 4.0, 'Flocken, Lebendfutter'),
('Zwergkugelfisch', 'Carinotetraodon travancoricus', 'Asien', 'Gelb', '1,2,3', 'fish', 3.0, 'Lebendfutter, Schnecken'),
('Zwergbuntbarsch', 'Apistogramma borellii', 'Südamerika', 'Blau', '1,2,3', 'fish', 7.0, 'Flocken, Lebendfutter'),
('Roter Zwergbuntbarsch', 'Apistogramma agassizii', 'Südamerika', 'Rot', '1,2,3', 'fish', 8.0, 'Flocken, Lebendfutter'),
('Blauer Zwergbuntbarsch', 'Apistogramma trifasciata', 'Südamerika', 'Blau', '1,2,3', 'fish', 7.0, 'Flocken, Lebendfutter'),
('Gelber Zwergbuntbarsch', 'Apistogramma nijsseni', 'Südamerika', 'Gelb', '1,2,3', 'fish', 7.0, 'Flocken, Lebendfutter'),
('Roter Zwergbuntbarsch', 'Apistogramma cacatuoides', 'Südamerika', 'Rot', '1,2,3', 'fish', 8.0, 'Flocken, Lebendfutter'),
('Blauer Zwergbuntbarsch', 'Apistogramma macmasteri', 'Südamerika', 'Blau', '1,2,3', 'fish', 7.0, 'Flocken, Lebendfutter'),
('Gelber Zwergbuntbarsch', 'Apistogramma viejita', 'Südamerika', 'Gelb', '1,2,3', 'fish', 7.0, 'Flocken, Lebendfutter'),
('Roter Zwergbuntbarsch', 'Apistogramma hongsloi', 'Südamerika', 'Rot', '1,2,3', 'fish', 8.0, 'Flocken, Lebendfutter');

-- Einfügen von 15 beliebten wirbellosen Aquarientieren
INSERT INTO inhabitants (name, latinname, habitat, color, predators, type, length, food) VALUES
('Rote Posthornschnecke', 'Planorbella duryi', 'Südamerika', 'Rot', '1,2,3', 'invertebrate', 2.5, 'Algen, Futterreste'),
('Gelbe Posthornschnecke', 'Planorbella duryi', 'Südamerika', 'Gelb', '1,2,3', 'invertebrate', 2.5, 'Algen, Futterreste'),
('Turmdeckelschnecke', 'Melanoides tuberculata', 'Asien', 'Braun', '1,2,3', 'invertebrate', 3.0, 'Algen, Futterreste'),
('Apfelschnecke', 'Pomacea bridgesii', 'Südamerika', 'Gelb', '1,2,3', 'invertebrate', 5.0, 'Algen, Gemüse'),
('Blaue Apfelschnecke', 'Pomacea bridgesii', 'Südamerika', 'Blau', '1,2,3', 'invertebrate', 5.0, 'Algen, Gemüse'),
('Amano-Garnele', 'Caridina multidentata', 'Asien', 'Transparent', '1,2,3', 'invertebrate', 5.0, 'Algen, Futterreste'),
('Rote Zwerggarnele', 'Neocaridina davidi', 'Asien', 'Rot', '1,2,3', 'invertebrate', 2.5, 'Algen, Futterreste'),
('Gelbe Zwerggarnele', 'Neocaridina davidi', 'Asien', 'Gelb', '1,2,3', 'invertebrate', 2.5, 'Algen, Futterreste'),
('Blaue Zwerggarnele', 'Neocaridina davidi', 'Asien', 'Blau', '1,2,3', 'invertebrate', 2.5, 'Algen, Futterreste'),
('Bambusgarnele', 'Atyopsis moluccensis', 'Asien', 'Braun', '1,2,3', 'invertebrate', 7.0, 'Filtrierer, Mikroorganismen'),
('Rote Nashorngarnele', 'Caridina gracilirostris', 'Asien', 'Rot', '1,2,3', 'invertebrate', 3.0, 'Algen, Futterreste'),
('Tiger-Garnele', 'Caridina cantonensis', 'Asien', 'Schwarz-Weiß', '1,2,3', 'invertebrate', 3.0, 'Algen, Futterreste'),
('Bienen-Garnele', 'Caridina cantonensis', 'Asien', 'Schwarz-Weiß', '1,2,3', 'invertebrate', 3.0, 'Algen, Futterreste'),
('Rote Rennschnecke', 'Neritina natalensis', 'Afrika', 'Rot', '1,2,3', 'invertebrate', 2.5, 'Algen'),
('Zebra-Rennschnecke', 'Neritina natalensis', 'Afrika', 'Schwarz-Weiß', '1,2,3', 'invertebrate', 2.5, 'Algen');

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

-- nachher ausführbar mit mysql -u root -p fishbase
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;