# Datei-Upload Funktionalität - Beispiel

## Kontaktformular - Datei-Upload

### Features:
- **Max. 5 Dateien** pro Anfrage
- **Max. 10MB** pro Datei
- **Unterstützte Formate**: 
  - Dokumente: PDF, DOC, DOCX, TXT
  - Bilder: JPG, JPEG, PNG, GIF, BMP, WEBP

### Benutzerführung:
1. Status auswählen (Wohnungseigentümer)
2. Formular ausfüllen
3. Optional: Dateien hochladen
4. Anfrage senden

### Ticket-Ansicht (für Hausverwaltung):
```
Ticket #2024-001 - Heizungsproblem
Von: Max Mustermann
Kategorie: Wartung & Reparaturen
Datum: 07.08.2025

Nachricht:
"Die Heizung in Wohnung 3A funktioniert seit gestern nicht mehr..."

Anhänge (3):
📸 heizung_problem.jpg (2.1 MB)
📄 wartungsvertrag.pdf (1.5 MB) 
📸 thermostat_anzeige.jpg (1.8 MB)
```

### Technische Implementation:
- State Management für Datei-Upload
- Validierung (Dateigröße, -anzahl, -typ)
- Datei-Icons basierend auf Typ
- Drag & Drop (zukünftige Erweiterung)
- Vorschau für Bilder (zukünftige Erweiterung)
