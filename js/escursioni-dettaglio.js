// Pagina di dettaglio: legge ?id=… dall'indirizzo e mostra dati, mappa, profilo e meteo.
(async function () {
  const root = "../";
  const contenuto = document.getElementById("contenuto");
  const id = new URLSearchParams(location.search).get("id");
  const p = PERCORSI.find((x) => x.id === id);

  if (!p) {
    document.title = `Percorso non trovato · ${SITO.nome}`;
    contenuto.innerHTML = `
      <div class="vuoto" style="margin-top:32px">
        <p>Questo percorso non esiste.</p>
        <a class="btn btn-pieno" href="index.html">Vedi tutti i percorsi</a>
      </div>`;
    return;
  }
  document.title = `${p.nome} · ${SITO.nome}`;

  let g;
  try {
    g = await caricaGpx(root + p.gpx);
  } catch (e) {
    contenuto.innerHTML = `<p class="vuoto" style="margin-top:32px">Impossibile leggere la traccia GPX di questo percorso.</p>`;
    return;
  }
  const d = DIFFICOLTA[p.difficolta];

  const foto = p.foto
    .map((f, i) => `<a class="foto" href="galleria.html#${p.id}-${i}" style="--img:url('${root}${f.file}')" data-didascalia="${f.didascalia}" aria-label="${f.didascalia}"></a>`)
    .join("");

  contenuto.innerHTML = `
    <header class="dettaglio-testata">
      <a class="indietro" href="index.html">← Tutti i percorsi</a>
      <div class="meta-riga">
        <span class="diff diff-${p.difficolta}">${p.difficolta}</span>
        <span>${d.nome}</span>
        <span>·</span>
        <span>${p.montagna}</span>
      </div>
      <h1>${p.nome}</h1>
    </header>

    <div class="stat-grandi">
      <div class="stat-grande"><div class="valore">${fmt1(g.km)} km</div><div class="nome">Distanza</div></div>
      <div class="stat-grande"><div class="valore">+${g.salita} m</div><div class="nome">Salita</div></div>
      <div class="stat-grande"><div class="valore">−${g.discesa} m</div><div class="nome">Discesa</div></div>
      <div class="stat-grande"><div class="valore">${g.max} m</div><div class="nome">Quota massima</div></div>
      <div class="stat-grande"><div class="valore">${stimaDurata(g)}</div><div class="nome">Durata stimata</div></div>
    </div>

    <div class="dettaglio-griglia">
      <div>
        <section>
          <h2>Il percorso</h2>
          <p>${p.descrizione}</p>
          <ul>${p.punti.map((x) => `<li>${x}</li>`).join("")}</ul>
        </section>

        <section>
          <h2>Mappa e profilo</h2>
          <div class="mappa" id="mappa" role="region" aria-label="Mappa del percorso"></div>
          <div class="profilo" id="profilo"></div>
          <p class="nota">Muovi il mouse o il dito sul profilo per vedere il punto sulla mappa.</p>
        </section>

        <section>
          <h2>Meteo alla partenza</h2>
          <div class="meteo" id="meteo"></div>
          <p class="fonte">Dati: <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a>. Le previsioni sono per il punto di partenza, a quote più alte è più freddo e più ventoso.</p>
        </section>

        <section>
          <h2>Foto</h2>
          <div class="mini-galleria">${foto}</div>
        </section>
      </div>

      <aside>
        <div class="pannello azioni-colonna">
          <a class="btn btn-primario" href="${root}${p.gpx}" download>Scarica la traccia GPX</a>
          ${
            p.komoot
              ? `<a class="btn btn-pieno" href="${p.komoot}" target="_blank" rel="noopener">Apri su Komoot</a>`
              : `<p class="nota" style="margin:0">Link Komoot in arrivo.</p>`
          }
        </div>
        <div class="pannello">
          <h3>Informazioni</h3>
          <dl>
            <dt>Partenza</dt><dd>${p.partenza.nome}</dd>
            <dt>Periodo</dt><dd>${p.periodo}</dd>
            <dt>Rifugi</dt><dd>${p.rifugi.join(", ") || "—"}</dd>
            <dt>Difficoltà</dt><dd>${d.desc}</dd>
          </dl>
        </div>
        <div class="pannello">
          <h3>Cosa portare</h3>
          <ul>${p.attrezzatura.map((x) => `<li>${x}</li>`).join("")}</ul>
          <p class="nota"><a href="checklist.html">Apri la checklist completa</a></p>
        </div>
      </aside>
    </div>`;

  // ---------- Mappa ----------
  const mappa = L.map("mappa", { scrollWheelZoom: false });
  L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    maxZoom: 17,
    attribution: 'Mappa © <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA), dati © OpenStreetMap',
  }).addTo(mappa);

  const coordinate = g.punti.map((x) => [x.lat, x.lon]);
  const traccia = L.polyline(coordinate, { color: "#d9822b", weight: 5, opacity: 0.95 }).addTo(mappa);
  mappa.fitBounds(traccia.getBounds(), { padding: [24, 24] });

  const icona = L.divIcon({ className: "", html: '<div class="marker-punto"></div>', iconSize: [14, 14], iconAnchor: [7, 7] });
  L.marker(coordinate[0], { icon: icona }).addTo(mappa).bindTooltip("Partenza");
  const cima = g.punti.reduce((a, b) => (b.ele > a.ele ? b : a));
  L.marker([cima.lat, cima.lon], { icon: icona }).addTo(mappa).bindTooltip(`Punto più alto, ${Math.round(cima.ele)} m`);

  mappa.on("focus", () => mappa.scrollWheelZoom.enable());
  mappa.on("blur", () => mappa.scrollWheelZoom.disable());

  // ---------- Profilo collegato alla mappa ----------
  const segnaposto = L.circleMarker(coordinate[0], { radius: 7, color: "#fff", weight: 3, fillColor: "#d9822b", fillOpacity: 1 });
  disegnaProfilo(document.getElementById("profilo"), g, (punto) => {
    if (punto) segnaposto.setLatLng([punto.lat, punto.lon]).addTo(mappa);
    else segnaposto.remove();
  });

  // ---------- Meteo ----------
  mostraMeteo(document.getElementById("meteo"), p.partenza, 5);
})();
