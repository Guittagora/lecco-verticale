// Elenco delle falesie. Le zone sono reali, ma coordinate approssimative e vie ("Linea N")
// sono DIMOSTRATIVE: sostituiscile con i tuoi dati man mano che li raccogli.
// Foto da Wikimedia Commons: ogni foto ha un campo `credito` (autore, licenza, pagina del file)
// che il sito mostra sotto le immagini, come richiesto dalle licenze CC BY / BY-SA.
// Se usi una foto tua, togli pure il campo `credito`.
//
// Per aggiungere una falesia copia un blocco. Le vie si scrivono come
//   ["Nome via", "grado", lunghezza in m, numero di rinvii]
// Gli identificativi delle vie (usati dal logbook) sono <id-falesia>-<posizione>:
// aggiungi le nuove vie IN FONDO all'elenco e non cambiare l'ordine, altrimenti
// le vie già segnate come fatte si spostano.

function creaVie(idFalesia, lista) {
  return lista.map(([nome, grado, lunghezza, rinvii], i) => ({
    id: `${idFalesia}-${i + 1}`,
    nome,
    grado,
    lunghezza,
    rinvii,
  }));
}

const FALESIE = [
  {
    id: "medale",
    nome: "Medale",
    zona: "Lecco",
    lat: 45.8527,
    lon: 9.4219,
    roccia: "Calcare",
    esposizione: "Sud",
    periodo: "Ottobre – aprile",
    altezza: 120,
    avvicinamento: { minuti: 10, parcheggio: "Parcheggio sotto la parete", descrizione: "Breve sentiero ripido dal parcheggio fino alla base della parete." },
    descrizione: "La palestra storica degli alpinisti lecchesi: placche verticali di calcare compatto con vie lunghe e ben protette. Soleggiata d'inverno, molto calda in estate.",
    foto: [
      { file: "img/arrampicata/medale/1.jpg", didascalia: "La parete sud del San Martino, dove si trova Medale", credito: { autore: "Resegun", licenza: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:San_Martino_Lecco_Parete.jpg" } },
      { file: "img/arrampicata/medale/2.jpg", didascalia: "Il San Martino sopra Lecco d'inverno", credito: { autore: "Bernini Massimo", licenza: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Lecco_e_il_Monte_San_Martino.JPG" } },
    ],
    vie: creaVie("medale", [
      ["Linea 1", "5b", 30, 9],
      ["Linea 2", "5c", 32, 10],
      ["Linea 3", "6a", 35, 11],
      ["Linea 4", "6a+", 35, 11],
      ["Linea 5", "6b", 38, 12],
      ["Linea 6", "6c", 40, 13],
      ["Linea 7", "7a", 40, 13],
    ]),
  },
  {
    id: "antimedale",
    nome: "Antimedale",
    zona: "Lecco",
    lat: 45.8548,
    lon: 9.4265,
    roccia: "Calcare",
    esposizione: "Sud-Ovest",
    periodo: "Ottobre – aprile",
    altezza: 60,
    avvicinamento: { minuti: 15, parcheggio: "Parcheggio di Rancio alto", descrizione: "Sentiero nel bosco di circa un quarto d'ora, con qualche gradino su roccia." },
    descrizione: "Falesia di vie corte e continue, ideale per chi comincia o vuole scaldarsi prima di Medale. Qualche via sporca in primavera.",
    foto: [
      { file: "img/arrampicata/antimedale/1.jpg", didascalia: "Il San Martino visto dal lago", credito: { autore: "Maupao70", licenza: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Monte_San_Martino.jpg" } },
    ],
    vie: creaVie("antimedale", [
      ["Linea 1", "4", 20, 6],
      ["Linea 2", "5a", 22, 7],
      ["Linea 3", "5b", 25, 8],
      ["Linea 4", "5c", 25, 8],
      ["Linea 5", "6a", 28, 9],
      ["Linea 6", "6b", 28, 9],
    ]),
  },
  {
    id: "sasso-preguda",
    nome: "Sasso di Preguda",
    zona: "Mandello del Lario",
    lat: 45.9181,
    lon: 9.3231,
    roccia: "Calcare",
    esposizione: "Sud-Est",
    periodo: "Tutto l'anno (esclusi i mesi più caldi)",
    altezza: 80,
    avvicinamento: { minuti: 5, parcheggio: "Parcheggio ai piedi del sasso", descrizione: "Pochi passi dal parcheggio, a due minuti dal lago." },
    descrizione: "Un grande masso sopra il lago di Lecco: vie di tutti i livelli, ottima aria e panorama sul lago. Molto frequentata nei fine settimana.",
    foto: [
      { file: "img/arrampicata/sasso-preguda/1.jpg", didascalia: "Il Sasso di Preguda, lato sud-ovest", credito: { autore: "Kaitu", licenza: "CC0", url: "https://commons.wikimedia.org/wiki/File:Sasso_di_Preguda,_SW_side.jpg" } },
      { file: "img/arrampicata/sasso-preguda/2.jpg", didascalia: "Il sasso e la chiesetta di Sant'Isidoro", credito: { autore: "Vassena Silvia", licenza: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Sasso_di_Preguda_con_chiesetta_S._Isidoro.jpg" } },
    ],
    vie: creaVie("sasso-preguda", [
      ["Linea 1", "5a", 25, 8],
      ["Linea 2", "5c", 28, 9],
      ["Linea 3", "6a+", 30, 10],
      ["Linea 4", "6b+", 32, 11],
      ["Linea 5", "6c+", 35, 12],
      ["Linea 6", "7b", 35, 12],
    ]),
  },
  {
    id: "rocca-baiedo",
    nome: "Rocca di Baiedo",
    zona: "Pasturo",
    lat: 45.9362,
    lon: 9.4131,
    roccia: "Calcare",
    esposizione: "Sud",
    periodo: "Primavera e autunno",
    altezza: 90,
    avvicinamento: { minuti: 20, parcheggio: "Parcheggio di Baiedo", descrizione: "Salita nel bosco per circa venti minuti, ben segnata." },
    descrizione: "Falesia ai piedi della Grignetta con vie lunghe di continuità. Più tranquilla e meno affollata delle falesie sul lago.",
    foto: [
      { file: "img/arrampicata/rocca-baiedo/1.jpg", didascalia: "La Rocca di Baiedo dalla piana di Pasturo", credito: { autore: "Ysogo", licenza: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Pasturo_-_Rocca_di_Baiedo_-20220825_112949.jpg" } },
      { file: "img/arrampicata/rocca-baiedo/2.jpg", didascalia: "Le placche della Rocca", credito: { autore: "Ysogo", licenza: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Rocca_di_Baiedo_-_Valsassina_-_Italy.jpg" } },
    ],
    vie: creaVie("rocca-baiedo", [
      ["Linea 1", "5c", 35, 11],
      ["Linea 2", "6a", 38, 12],
      ["Linea 3", "6b", 40, 13],
      ["Linea 4", "6c", 40, 13],
      ["Linea 5", "7a+", 42, 14],
    ]),
  },
];
