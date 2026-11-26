# Immagini

Metti qui le tue foto con questi nomi (finché mancano, il sito mostra un colore di sfondo):

- `home/hero.jpg` — foto grande in cima alla home (orizzontale, almeno 1920 px di larghezza)
- `home/escursioni.jpg` — sfondo della card "Escursioni"
- `home/arrampicata.jpg` — sfondo della card "Arrampicata"
- `chi-sono/ritratto.jpg` — tua foto (verticale, rapporto 4:5)

## Escursioni

Per ogni percorso metti le foto in `escursioni/<id-percorso>/` con i nomi `1.jpg`, `2.jpg`, ...
(gli id sono in `data/percorsi.js`, ad esempio `escursioni/monte-barro-anello/1.jpg`).
Per aggiungere altre foto basta aggiungere una riga nell'elenco `foto` del percorso.

Le tracce in `gpx/` sono SEGNAPOSTO: sostituisci ogni file con la tua traccia esportata da Komoot,
mantenendo lo stesso nome, e incolla il link Komoot nel campo `komoot` del percorso.

## Arrampicata

Le foto in `arrampicata/<id-falesia>/` (`1.jpg`, `2.jpg`, ...) vengono da Wikimedia Commons con
licenza libera (CC0 / CC BY-SA): autore, licenza e link sono nel campo `credito` di ogni foto in
`data/falesie.js` e il sito li mostra sotto le immagini. Per usare una tua foto sostituisci il file
mantenendo il nome e togli il campo `credito`.
I dati delle vie ("Linea 1", "Linea 2", ...) sono DIMOSTRATIVI: sostituiscili in `data/falesie.js`.
Le nuove vie vanno aggiunte in fondo all'elenco e senza cambiare l'ordine di quelle esistenti,
altrimenti il logbook (che ricorda le vie per posizione) si sposta.
