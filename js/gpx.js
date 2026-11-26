// Lettura delle tracce GPX: distanza, dislivello, durata stimata e profilo altimetrico.

const _cacheGpx = {};

function caricaGpx(url) {
  if (!_cacheGpx[url]) {
    // "no-cache": il browser ricontrolla sempre che il file non sia cambiato prima di riusarlo
    _cacheGpx[url] = fetch(url, { cache: "no-cache" })
      .then((r) => {
        if (!r.ok) throw new Error(`GPX non trovato (${r.status})`);
        return r.text();
      })
      .then(analizzaGpx);
  }
  return _cacheGpx[url];
}

function distanzaMetri(a, b) {
  const R = 6371000;
  const rad = (g) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function analizzaGpx(testo) {
  const xml = new DOMParser().parseFromString(testo, "application/xml");
  const nodi = [...xml.querySelectorAll("trkpt")];
  if (nodi.length < 2) throw new Error("Il file GPX non contiene una traccia");

  const punti = nodi.map((n) => ({
    lat: parseFloat(n.getAttribute("lat")),
    lon: parseFloat(n.getAttribute("lon")),
    ele: parseFloat(n.querySelector("ele")?.textContent ?? "0"),
    dist: 0,
  }));

  let dist = 0;
  let salita = 0;
  let discesa = 0;
  let riferimento = punti[0].ele;
  for (let i = 1; i < punti.length; i++) {
    dist += distanzaMetri(punti[i - 1], punti[i]);
    punti[i].dist = dist;
    // Ignora le oscillazioni sotto i 3 m, tipiche del rumore del GPS
    const delta = punti[i].ele - riferimento;
    if (Math.abs(delta) >= 3) {
      if (delta > 0) salita += delta;
      else discesa -= delta;
      riferimento = punti[i].ele;
    }
  }
  const quote = punti.map((p) => p.ele);
  return {
    punti,
    km: dist / 1000,
    salita: Math.round(salita),
    discesa: Math.round(discesa),
    min: Math.round(Math.min(...quote)),
    max: Math.round(Math.max(...quote)),
  };
}

// Tempo di cammino stimato (schema DIN 33466, passo da escursionista allenato):
// orizzontale 4 km/h, salita 400 m/h, discesa 600 m/h
function stimaDurata(g) {
  const orizzontale = g.km / 4;
  const verticale = g.salita / 400 + g.discesa / 600;
  const ore = Math.max(orizzontale, verticale) + Math.min(orizzontale, verticale) / 2;
  const minuti = Math.round((ore * 60) / 5) * 5;
  const h = Math.floor(minuti / 60);
  const m = minuti % 60;
  return m ? `${h} h ${String(m).padStart(2, "0")} min` : `${h} h`;
}

const fmt1 = (n) => n.toLocaleString("it-IT", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

// Disegna il profilo altimetrico in un elemento. onMuovi(punto | null) si attiva al passaggio del mouse.
function disegnaProfilo(el, g, onMuovi) {
  const W = 800, H = 230, L = 46, R = 12, T = 14, B = 28;
  const lo = Math.floor(g.min / 50) * 50;
  const hi = Math.ceil(g.max / 50) * 50;
  const totale = g.punti[g.punti.length - 1].dist;
  const x = (d) => L + (d / totale) * (W - L - R);
  const y = (e) => T + (1 - (e - lo) / (hi - lo || 1)) * (H - T - B);

  const linea = g.punti.map((p, i) => `${i ? "L" : "M"}${x(p.dist).toFixed(1)} ${y(p.ele).toFixed(1)}`).join("");
  const area = `${linea}L${x(totale).toFixed(1)} ${H - B}L${L} ${H - B}Z`;

  let griglia = "";
  for (let i = 0; i <= 4; i++) {
    const e = lo + ((hi - lo) * i) / 4;
    griglia += `<line x1="${L}" x2="${W - R}" y1="${y(e)}" y2="${y(e)}" class="pr-griglia"/>
                <text x="${L - 6}" y="${y(e) + 4}" text-anchor="end" class="pr-testo">${Math.round(e)}</text>`;
  }
  const passo = totale / 1000 > 12 ? 2 : 1;
  for (let k = 0; k <= totale / 1000; k += passo) {
    griglia += `<text x="${x(k * 1000)}" y="${H - 8}" text-anchor="middle" class="pr-testo">${k} km</text>`;
  }

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Profilo altimetrico: da ${g.min} a ${g.max} metri su ${fmt1(g.km)} km">
      ${griglia}
      <path d="${area}" class="pr-area"/>
      <path d="${linea}" class="pr-linea"/>
      <g class="pr-cursore" hidden>
        <line y1="${T}" y2="${H - B}" class="pr-guida"/>
        <circle r="5" class="pr-punto"/>
        <text class="pr-etichetta" y="${T + 10}"></text>
      </g>
      <rect x="${L}" y="${T}" width="${W - L - R}" height="${H - T - B}" fill="transparent" class="pr-zona"/>
    </svg>`;

  const svg = el.querySelector("svg");
  const cursore = svg.querySelector(".pr-cursore");
  const guida = cursore.querySelector("line");
  const pallino = cursore.querySelector("circle");
  const etichetta = cursore.querySelector("text");

  function muovi(evento) {
    const r = svg.getBoundingClientRect();
    const px = ((evento.clientX - r.left) / r.width) * W;
    const d = Math.min(Math.max(((px - L) / (W - L - R)) * totale, 0), totale);
    let i = 0;
    while (i < g.punti.length - 1 && g.punti[i].dist < d) i++;
    const p = g.punti[i];
    const cx = x(p.dist);
    guida.setAttribute("x1", cx);
    guida.setAttribute("x2", cx);
    pallino.setAttribute("cx", cx);
    pallino.setAttribute("cy", y(p.ele));
    etichetta.textContent = `${Math.round(p.ele)} m · ${fmt1(p.dist / 1000)} km`;
    etichetta.setAttribute("x", cx > W / 2 ? cx - 8 : cx + 8);
    etichetta.setAttribute("text-anchor", cx > W / 2 ? "end" : "start");
    cursore.hidden = false;
    onMuovi?.(p);
  }
  function esci() {
    cursore.hidden = true;
    onMuovi?.(null);
  }
  const zona = svg.querySelector(".pr-zona");
  zona.addEventListener("pointermove", muovi);
  zona.addEventListener("pointerleave", esci);
}
