#!/usr/bin/env python3
"""
Aquarium Bilder Downloader
Lädt automatisch Bilder für Aquarientiere und -pflanzen von öffentlichen Quellen herunter
"""

import requests
import csv
import os
import time
from pathlib import Path
import hashlib
from PIL import Image
import io

class AquariumImageDownloader:
    def __init__(self, output_dir="../images"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.log_file = self.output_dir / "download_log.csv"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'AquariumImageDownloader/1.0 (Educational Purpose)'
        })
        
        # Log-Datei initialisieren
        if not self.log_file.exists():
            with open(self.log_file, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow(['Species', 'Source', 'Image_URL', 'Local_Path', 'License', 'Status'])
    
    def sanitize_filename(self, name):
        """Bereinigt Dateinamen für das Dateisystem"""
        return "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).rstrip()
    
    def get_image_hash(self, image_data):
        """Erstellt Hash für Duplikatserkennung"""
        return hashlib.md5(image_data).hexdigest()
    
    def download_and_save_image(self, url, species_name, source, license_info="Unknown"):
        """Lädt ein Bild herunter und speichert es"""
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            # Bildformat prüfen
            try:
                img = Image.open(io.BytesIO(response.content))
                if img.format.lower() not in ['jpeg', 'jpg', 'png', 'webp']:
                    return False, "Unsupported format"
            except Exception:
                return False, "Invalid image"
            
            # Dateiname erstellen
            clean_name = self.sanitize_filename(species_name)
            file_extension = url.split('.')[-1].split('?')[0].lower()
            if file_extension not in ['jpg', 'jpeg', 'png', 'webp']:
                file_extension = 'jpg'
            
            # Duplikatsprüfung
            image_hash = self.get_image_hash(response.content)
            filename = f"{clean_name}_{image_hash[:8]}.{file_extension}"
            filepath = self.output_dir / filename
            
            if filepath.exists():
                return True, "Already exists"
            
            # Bild speichern
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            # Log-Eintrag
            self.log_download(species_name, source, url, str(filepath), license_info, "Success")
            return True, str(filepath)
            
        except Exception as e:
            self.log_download(species_name, source, url, "", license_info, f"Error: {str(e)}")
            return False, str(e)
    
    def log_download(self, species, source, url, local_path, license_info, status):
        """Protokolliert Downloads"""
        with open(self.log_file, 'a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([species, source, url, local_path, license_info, status])
    
    def search_wikimedia_commons(self, species_name, max_images=3):
        """Sucht Bilder auf Wikimedia Commons"""
        print(f"Suche auf Wikimedia Commons: {species_name}")
        
        # Wikimedia Commons API
        api_url = "https://commons.wikimedia.org/w/api.php"
        
        # Suche nach Kategorien und Dateien
        search_params = {
            'action': 'query',
            'format': 'json',
            'list': 'search',
            'srsearch': f'"{species_name}" filetype:bitmap',
            'srnamespace': 6,  # File namespace
            'srlimit': max_images * 2
        }
        
        try:
            response = self.session.get(api_url, params=search_params, timeout=30)
            data = response.json()
            
            downloaded = 0
            for item in data.get('query', {}).get('search', []):
                if downloaded >= max_images:
                    break
                
                file_title = item['title']
                
                # Datei-Info abrufen
                file_params = {
                    'action': 'query',
                    'format': 'json',
                    'titles': file_title,
                    'prop': 'imageinfo',
                    'iiprop': 'url|size|mime'
                }
                
                file_response = self.session.get(api_url, params=file_params, timeout=30)
                file_data = file_response.json()
                
                pages = file_data.get('query', {}).get('pages', {})
                for page in pages.values():
                    imageinfo = page.get('imageinfo', [])
                    if imageinfo:
                        image_url = imageinfo[0].get('url')
                        if image_url:
                            success, result = self.download_and_save_image(
                                image_url, species_name, "Wikimedia Commons", "CC/Public Domain"
                            )
                            if success:
                                downloaded += 1
                                print(f"  ✓ Heruntergeladen: {result}")
                            else:
                                print(f"  ✗ Fehler: {result}")
                
                time.sleep(0.5)  # Rate limiting
            
            return downloaded
            
        except Exception as e:
            print(f"  ✗ Wikimedia Commons Fehler: {e}")
            return 0
    
    def search_inaturalist(self, species_name, max_images=2):
        """Sucht Bilder auf iNaturalist"""
        print(f"Suche auf iNaturalist: {species_name}")
        
        try:
            # Erst nach der Art suchen
            taxa_url = "https://api.inaturalist.org/v1/taxa"
            taxa_params = {
                'q': species_name,
                'rank': 'species',
                'per_page': 1
            }
            
            response = self.session.get(taxa_url, params=taxa_params, timeout=30)
            taxa_data = response.json()
            
            if not taxa_data.get('results'):
                print(f"  ⚠ Keine Art gefunden für: {species_name}")
                return 0
            
            taxon_id = taxa_data['results'][0]['id']
            
            # Beobachtungen mit Fotos suchen
            obs_url = "https://api.inaturalist.org/v1/observations"
            obs_params = {
                'taxon_id': taxon_id,
                'photos': 'true',
                'quality_grade': 'research',
                'per_page': max_images,
                'order': 'votes'
            }
            
            obs_response = self.session.get(obs_url, params=obs_params, timeout=30)
            obs_data = obs_response.json()
            
            downloaded = 0
            for obs in obs_data.get('results', []):
                if downloaded >= max_images:
                    break
                
                photos = obs.get('photos', [])
                for photo in photos[:1]:  # Nur ein Foto pro Beobachtung
                    if downloaded >= max_images:
                        break
                    
                    # Mittlere Auflösung verwenden
                    image_url = photo.get('url', '').replace('square', 'medium')
                    if image_url:
                        license_info = photo.get('license_code', 'Unknown')
                        success, result = self.download_and_save_image(
                            image_url, species_name, "iNaturalist", license_info
                        )
                        if success:
                            downloaded += 1
                            print(f"  ✓ Heruntergeladen: {result}")
                        else:
                            print(f"  ✗ Fehler: {result}")
                
                time.sleep(0.5)
            
            return downloaded
            
        except Exception as e:
            print(f"  ✗ iNaturalist Fehler: {e}")
            return 0
    
    def process_species_list(self, species_list, max_images_per_species=3):
        """Verarbeitet eine Liste von Arten"""
        print(f"Verarbeite {len(species_list)} Arten...")
        print(f"Bilder werden gespeichert in: {self.output_dir.absolute()}")
        print("-" * 50)
        
        total_downloaded = 0
        
        for i, species in enumerate(species_list, 1):
            print(f"\n[{i}/{len(species_list)}] {species}")
            
            species_downloaded = 0
            
            # Wikimedia Commons durchsuchen
            downloaded = self.search_wikimedia_commons(species, max_images=max_images_per_species)
            species_downloaded += downloaded
            
            # Wenn noch Bilder benötigt werden, iNaturalist durchsuchen
            if species_downloaded < max_images_per_species:
                remaining = max_images_per_species - species_downloaded
                downloaded = self.search_inaturalist(species, max_images=remaining)
                species_downloaded += downloaded
            
            total_downloaded += species_downloaded
            print(f"  → {species_downloaded} Bilder für {species} gefunden")
            
            # Kurze Pause zwischen den Arten
            time.sleep(1)
        
        print(f"\n{'='*50}")
        print(f"Fertig! {total_downloaded} Bilder insgesamt heruntergeladen")
        print(f"Log-Datei: {self.log_file}")
        print(f"Bilder-Ordner: {self.output_dir.absolute()}")
    
    def load_species_from_csv(self, csv_file, species_column=0):
        """Lädt Artenliste aus CSV-Datei"""
        species_list = []
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            for row in reader:
                if len(row) > species_column and row[species_column].strip():
                    species_list.append(row[species_column].strip())
        return species_list

def main():
    """Hauptfunktion"""
    downloader = AquariumImageDownloader()
    
    # Beispiel-Artenliste (können Sie durch Ihre eigene ersetzen)
    species_list = [
        "Poecilia reticulata",  # Guppy
        "Betta splendens",      # Kampffisch
        "Neon tetra",           # Neonsalmler
        "Corydoras paleatus",   # Panzerwels
        "Anubias barteri",      # Anubias (Pflanze)
        "Vallisneria spiralis", # Vallisnerie (Pflanze)
    ]
    
    # Alternative: Aus CSV-Datei laden
    # Erstellen Sie eine CSV-Datei namens 'species_list.csv' mit einer Spalte für die Artennamen
    csv_file = "species_list.csv"
    if os.path.exists(csv_file):
        print(f"Lade Artenliste aus {csv_file}")
        species_list = downloader.load_species_from_csv(csv_file)
    else:
        print("Verwende Beispiel-Artenliste")
        print("Tipp: Erstellen Sie eine 'species_list.csv' Datei mit Ihren Arten")
    
    # Bilder herunterladen
    downloader.process_species_list(species_list, max_images_per_species=3)

if __name__ == "__main__":
    # Benötigte Pakete installieren
    required_packages = ["requests", "Pillow"]
    
    print("Aquarium Bilder Downloader")
    print("=" * 30)
    print("\nBenötigte Python-Pakete:")
    for package in required_packages:
        print(f"  pip install {package}")
    
    print("\nStelle sicher, dass alle Pakete installiert sind, dann starte das Skript erneut.")
    
    try:
        import requests
        from PIL import Image
        print("\n✓ Alle Pakete sind installiert!")
        main()
    except ImportError as e:
        print(f"\n✗ Fehlende Abhängigkeit: {e}")
        print("Bitte installiere die benötigten Pakete mit:")
        print("pip install requests Pillow")