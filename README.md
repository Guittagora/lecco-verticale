# Lecco Verticale

Sito statico su escursioni e falesie attorno a Lecco (Grigne, Resegone, Cornizzolo, Monte Barro),
scritto in HTML, CSS e JavaScript puro, senza framework né build.

## Funzionalità

- **Escursioni**: elenco filtrabile dei percorsi, scheda con mappa della traccia GPX, profilo
  altimetrico, meteo dei prossimi giorni, galleria fotografica e checklist dello zaino.
- **Arrampicata**: mappa interattiva delle falesie, scheda di ogni falesia con elenco vie, gradi
  colorati per difficoltà, avvicinamento, meteo e foto.
- **Logbook personale**: segna le vie fatte con data, voto e nota; statistiche e grafico per grado;
  esporta e importa in JSON. I dati restano nel browser (`localStorage`).
- Tema chiaro/scuro, layout responsive, pagine "Chi sono" ed "Esci con me".

## Tecnologie

- HTML, CSS (custom properties, grid) e JavaScript vanilla
- [Leaflet](https://leafletjs.com/) con mappe [OpenTopoMap](https://opentopomap.org/)
- Meteo da [Open-Meteo](https://open-meteo.com/) (nessuna chiave API)
- Parsing GPX lato client

## Avvio in locale

```bash
python3 serve.py
```

poi apri <http://localhost:8000>. Qualsiasi server statico va bene (anche GitHub Pages).

## Struttura

```
index.html, chi-sono.html, esci-con-me.html
escursioni/     pagine della sezione escursioni
arrampicata/    mappa, scheda falesia, galleria, logbook
data/           percorsi.js e falesie.js: i contenuti del sito
js/  css/       script e stile
gpx/            tracce dei percorsi
img/            foto (vedi img/LEGGIMI.md)
```

Per aggiungere un percorso o una falesia basta modificare `data/percorsi.js` o `data/falesie.js`.

## Note e crediti

- Vie e gradi delle falesie sono dimostrativi.
- Le foto delle falesie vengono da Wikimedia Commons (CC0 / CC BY-SA); autori e licenze sono
  indicati sotto ogni immagine e in `data/falesie.js`.
- Mappe © OpenTopoMap (CC-BY-SA), dati © contributori OpenStreetMap.
