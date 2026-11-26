// Elenco dei percorsi. Per aggiungerne uno: copia un blocco, cambia i dati,
// metti la traccia in gpx/ e le foto in img/escursioni/<id>/.
// Km, dislivello e durata si calcolano da soli dal file GPX.
// Le tracce attuali sono SEGNAPOSTO: sostituiscile con le tue esportate da Komoot.

const DIFFICOLTA = {
  T: { nome: "Turistico", desc: "Sentieri semplici e ben segnati, adatti a tutti." },
  E: { nome: "Escursionistico", desc: "Sentieri di montagna, serve un minimo di allenamento." },
  EE: { nome: "Per escursionisti esperti", desc: "Tratti esposti o su roccia: serve esperienza e piede fermo." },
  EEA: { nome: "Con attrezzatura", desc: "Passaggi attrezzati: servono set da ferrata e casco." },
};

const MONTAGNE = ["Grignetta", "Grigna", "Resegone", "Cornizzolo", "Monte Barro"];

const PERCORSI = [
  {
    id: "monte-barro-anello",
    nome: "Anello del Monte Barro",
    montagna: "Monte Barro",
    difficolta: "T",
    partenza: { nome: "Valmadrera, parcheggi della rotonda", lat: 45.8463847, lon: 9.3692270 },
    rifugi: ["Rifugio Pianezzo"],
    periodo: "Tutto l'anno",
    descrizione:
      "Il giro perfetto per cominciare: sentieri larghi, bei panorami sul lago di Lecco e sul Resegone e un'ora e mezza di cammino da una cima all'altra. Ottimo anche in inverno quando in quota c'è neve.",
    punti: ["Vista sul lago di Annone", "Parco Monte Barro", "Adatto a famiglie"],
    attrezzatura: ["Scarpe da trekking", "Acqua", "Giacca leggera"],
    komoot: "https://www.komoot.com/tour/3384854331?ref=itd&share_token=abgKGFrJmrL9kqiYi1SU1sEINsnwsNHFnPzYuTizVbUfmuPlI0&ref=its&t_s=referral&t_cid=route_share&t_ref_username=3580012547827",
    gpx: "gpx/monte-barro-anello.gpx",
    foto: [
      { file: "img/escursioni/monte-barro-anello/1.jpg", didascalia: "Sentiero per la vetta" },
      { file: "img/escursioni/monte-barro-anello/2.jpg", didascalia: "Alba dalla vetta" },
      { file: "img/escursioni/monte-barro-anello/3.jpg", didascalia: "Vista dei laghi" },
    ],
  },
  {
    id: "cornizzolo-valmadrera",
    nome: "Cornizzolo da Valmadrera",
    montagna: "Cornizzolo",
    difficolta: "E",
    partenza: { nome: "Valmadrera", lat: 45.846173, lon: 9.354534 },
    rifugi: ["Rifugio SEV"],
    periodo: "Marzo – novembre",
    descrizione:
      "Un anello lungo e faticoso: da Valmadrera si sale tra i boschi passando dalla cascata del torrente Toscio, fino alla dorsale del Cornizzolo con il Rifugio SEV. Dall'alto il panorama abbraccia il lago di Lecco, le Grigne e i laghi della Brianza. Servono gamba e fiato: sono oltre 1100 m di dislivello.",
    punti: ["Cascata del Torrente Toscio", "Rifugio SEV", "Dorsale panoramica", "Vista sul lago di Lecco"],
    attrezzatura: ["Scarponi", "Bastoncini", "Giacca antipioggia"],
    komoot: "https://www.komoot.com/it-it/tour/3385051024?share_token=aAlXttgTCcFnxeeWrpkanruWMH8k21gJQ4oCfW5cFU9ralh05M&ref=wtd&t_s=referral&t_cid=route_share&t_ref_username=3580012547827",
    gpx: "gpx/cornizzolo-valmadrera.gpx",
    foto: [
      { file: "img/escursioni/cornizzolo-valmadrera/1.jpg", didascalia: "Rifugio SEV e la dorsale" },
      { file: "img/escursioni/cornizzolo-valmadrera/2.jpg", didascalia: "Croce di vetta" },
      { file: "img/escursioni/cornizzolo-valmadrera/3.jpg", didascalia: "La dorsale al tramonto" },
    ],
  },
  {
    id: "resegone-erve",
    nome: "Resegone da Erve",
    montagna: "Resegone",
    difficolta: "E",
    partenza: { nome: "Erve, Piazza Giorgio La Pira", lat: 45.820651, lon: 9.451966 },
    rifugi: ["Rifugio Azzoni"],
    periodo: "Maggio – ottobre",
    descrizione:
      "Salita lunga e regolare verso la Punta Cermenati, la cima più alta del Resegone. Il sentiero sale ripido nel bosco e poi sui prati della cresta, con il lago di Lecco sempre alle spalle.",
    punti: ["Punta Cermenati", "Rifugio Azzoni", "Panorama sul lago"],
    attrezzatura: ["Scarponi", "Bastoncini", "Acqua 2 L", "Cappello"],
    komoot: "https://www.komoot.com/it-it/tour/3384896608?ref%5B0%5D=itd&ref%5B1%5D=its&t_s=referral&t_cid=route_share&t_ref_username=3580012547827",
    gpx: "gpx/resegone-erve.gpx",
    foto: [
      { file: "img/escursioni/resegone-erve/1.jpg", didascalia: "Cresta del Resegone" },
      { file: "img/escursioni/resegone-erve/2.jpg", didascalia: "Vista dalla cresta" },
    ],
  },
  {
    id: "resinelli-rosalba",
    nome: "Rifugio Rosalba dai Piani Resinelli",
    montagna: "Grignetta",
    difficolta: "E",
    partenza: { nome: "Piani Resinelli", lat: 45.905406, lon: 9.394146 },
    rifugi: ["Rifugio Rosalba"],
    periodo: "Giugno – ottobre",
    descrizione:
      "Anello dai Piani Resinelli al Rifugio Rosalba, sotto la Grignetta. Si sale per il Sentiero dei Morti, tra roccette e tratti ripidi, e si torna dal Sentiero delle Foppe. Dal rifugio la vista spazia sul lago e sulle creste della Grignetta: una bella uscita in giornata, senza arrivare in vetta.",
    punti: ["Sentiero dei Morti", "Rifugio Rosalba", "Sentiero delle Foppe"],
    attrezzatura: ["Scarponi", "Casco leggero consigliato", "Giacca", "Bastoncini"],
    komoot: "https://www.komoot.com/it-it/tour/1385994398?share_token=ardKDCzKGm555L4t1N2MUtvve2ryVsJphIzHkW5BcHFEL7EqxL&ref=wtd&t_s=referral&t_cid=route_share&t_ref_username=3580012547827",
    gpx: "gpx/resinelli-rosalba.gpx",
    foto: [
      { file: "img/escursioni/resinelli-rosalba/1.jpg", didascalia: "I prati dei Piani Resinelli" },
      { file: "img/escursioni/resinelli-rosalba/2.jpg", didascalia: "Panorama dal Rifugio Rosalba" },
      { file: "img/escursioni/resinelli-rosalba/3.jpg", didascalia: "La Grigna Settentrionale" },
    ],
  },
  {
    id: "grignone-pasturo",
    nome: "Grigna Settentrionale da Pasturo",
    montagna: "Grigna",
    difficolta: "EE",
    partenza: { nome: "Pasturo, parcheggio", lat: 45.949004, lon: 9.445271 },
    rifugi: ["Rifugio Riva-Girani"],
    periodo: "Giugno – ottobre",
    descrizione:
      "Il Grignone, 2410 m: salita lunga e impegnativa che passa dal bivacco Riva Girani. Il tratto finale è ripido e roccioso. In cima si apre un panorama enorme, dalle Alpi alla pianura padana.",
    punti: ["Bivacco Riva Girani", "Vetta a 2410 m", "Panorama alpino"],
    attrezzatura: ["Scarponi rigidi", "Bastoncini", "Casco", "Giacca pesante", "Acqua 2 L"],
    komoot: "https://www.komoot.com/tour/3384914115?ref=itd&share_token=a2rc0a9fSd2CR6dfQWcHFBcukJ6mEFyFqZ60r0mmG3i0uvArAT&ref=its&t_s=referral&t_cid=route_share&t_ref_username=3580012547827",
    gpx: "gpx/grignone-pasturo.gpx",
    foto: [
      { file: "img/escursioni/grignone-pasturo/1.jpg", didascalia: "Rifugio Brioschi" },
      { file: "img/escursioni/grignone-pasturo/2.jpg", didascalia: "Vista della Grignetta" },
      { file: "img/escursioni/grignone-pasturo/3.jpg", didascalia: "Vista del lago" },
      { file: "img/escursioni/grignone-pasturo/4.jpg", didascalia: "Buca delle Grigne" },
    ],
  },
  {
    id: "grignetta-direttissima",
    nome: "Grignetta, Direttissima dal canalone Porta",
    montagna: "Grignetta",
    difficolta: "EEA",
    partenza: { nome: "Piani Resinelli, parcheggio", lat: 45.911403, lon: 9.399281 },
    rifugi: ["Rifugio Rosalba"],
    periodo: "Giugno – ottobre",
    descrizione:
      "La Direttissima alla Grignetta nella variante dal canalone Porta: si risale il canalone tra rocce e detriti, poi un tratto tecnico su roccia porta al Sigaro Dones e al Torrione Magnaghi. Si scende per il sentiero Cermenati. Esposto e impegnativo: servono esperienza, casco e piede sicuro, e meglio evitarlo con roccia bagnata o poca visibilità.",
    punti: ["Canalone Porta", "Sigaro Dones", "Cima del Torrione Magnaghi", "Discesa dal sentiero Cermenati"],
    attrezzatura: ["Set da ferrata", "Casco", "Guanti", "Scarponi", "Acqua 2 L"],
    komoot: "https://www.komoot.com/it-it/tour/3385043383?share_token=agmjv0qTi21gqP2yopMwXJoAtkHawKWjXK19r1VfTLFKtPoMdA&ref=wtd&t_s=referral&t_cid=route_share&t_ref_username=3580012547827",
    gpx: "gpx/grignetta-direttissima.gpx",
    foto: [
      { file: "img/escursioni/grignetta-direttissima/1.jpg", didascalia: "Vista della Grigna Settentrionale" },
      { file: "img/escursioni/grignetta-direttissima/2.jpg", didascalia: "Canalone Porta" },
      { file: "img/escursioni/grignetta-direttissima/3.jpg", didascalia: "Sezione tecnica" },
      { file: "img/escursioni/grignetta-direttissima/4.jpg", didascalia: "Cima del Torrione Magnaghi" },
    ],
  },
];
