// Scheda di una falesia (?id=…): dati, elenco vie e registrazione nel logbook personale.
(function () {
  const root = "../";
  const contenuto = document.getElementById("contenuto");
  const id = new URLSearchParams(location.search).get("id");
  const f = FALESIE.find((x) => x.id === id);

  if (!f) {
    document.title = `Falesia non trovata · ${SITO.nome}`;
    contenuto.innerHTML = `
      <div class="vuoto" style="margin-top:32px">
        <p>Questa falesia non esiste.</p>
        <a class="btn btn-pieno" href="index.html">Vedi la mappa</a>
      </div>`;
    return;
  }
  document.title = `${f.nome} · ${SITO.nome}`;

  const [gMin, gMax] = rangeGradi(f);
  const foto = f.foto
    .map((x) => `<div class="foto" style="--img:url('${root}${x.file}')" data-didascalia="${esc(x.didascalia)}" role="img" aria-label="${esc(x.didascalia)}"></div>`)
    .join("");

  contenuto.innerHTML = `
    <header class="dettaglio-testata">
      <a class="indietro" href="index.html">← Tutte le falesie</a>
      <div class="meta-riga"><span>${esc(f.zona)}</span><span>·</span><span>${esc(f.roccia)}</span></div>
      <h1>${esc(f.nome)}</h1>
    </header>

    <div class="stat-grandi">
      <div class="stat-grande"><div class="valore">${gMin} – ${gMax}</div><div class="nome">Gradi</div></div>
      <div class="stat-grande"><div class="valore">${f.vie.length}</div><div class="nome">Vie</div></div>
      <div class="stat-grande"><div class="valore">${esc(f.esposizione)}</div><div class="nome">Esposizione</div></div>
      <div class="stat-grande"><div class="valore">${f.avvicinamento.minuti} min</div><div class="nome">Avvicinamento</div></div>
      <div class="stat-grande"><div class="valore">${f.altezza} m</div><div class="nome">Altezza massima</div></div>
    </div>

    <div class="dettaglio-griglia">
      <div>
        <section>
          <h2>La falesia</h2>
          <p>${esc(f.descrizione)}</p>
        </section>

        <section>
          <h2>Le vie</h2>
          <p class="nota" id="riepilogo-vie" style="margin:0 0 12px"></p>
          <div class="vie" id="vie"></div>
          <p class="nota">Tocca "Segna" per registrare una via nel tuo logbook. I dati restano salvati solo in questo browser. <a href="logbook.html">Apri il logbook</a></p>
        </section>

        <section>
          <h2>Foto</h2>
          <div class="mini-galleria">${foto}</div>
          ${creditiFoto(f.foto) ? `<p class="fonte">${creditiFoto(f.foto)}</p>` : ""}
        </section>

        <section>
          <h2>Meteo</h2>
          <div class="meteo" id="meteo"></div>
          <p class="fonte">Dati: <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a></p>
        </section>
      </div>

      <aside>
        <div class="pannello">
          <h3>Come arrivare</h3>
          <dl>
            <dt>Parcheggio</dt><dd>${esc(f.avvicinamento.parcheggio)}</dd>
            <dt>A piedi</dt><dd>${f.avvicinamento.minuti} min</dd>
          </dl>
          <p class="nota">${esc(f.avvicinamento.descrizione)}</p>
        </div>
        <div class="pannello">
          <h3>Info utili</h3>
          <dl>
            <dt>Periodo</dt><dd>${esc(f.periodo)}</dd>
            <dt>Roccia</dt><dd>${esc(f.roccia)}</dd>
            <dt>Esposizione</dt><dd>${esc(f.esposizione)}</dd>
          </dl>
        </div>
        <div class="pannello">
          <h3>Dove si trova</h3>
          <div class="mappa mappa-piccola" id="mappa" role="region" aria-label="Posizione della falesia"></div>
          <p class="nota"><a href="https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lon}" target="_blank" rel="noopener">Indicazioni stradali</a></p>
        </div>
      </aside>
    </div>`;

  // ---------- Mappa ----------
  const mappa = L.map("mappa", { scrollWheelZoom: false }).setView([f.lat, f.lon], 14);
  L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    maxZoom: 17,
    attribution: '© <a href="https://opentopomap.org">OpenTopoMap</a>, © OpenStreetMap',
  }).addTo(mappa);
  L.marker([f.lat, f.lon], {
    icon: L.divIcon({ className: "", html: '<div class="pin-falesia"><span></span></div>', iconSize: [34, 42], iconAnchor: [17, 40] }),
  }).addTo(mappa);

  mostraMeteo(document.getElementById("meteo"), f, 5);

  // ---------- Elenco vie ----------
  const elencoVie = document.getElementById("vie");
  const riepilogo = document.getElementById("riepilogo-vie");

  function disegnaVie() {
    const dati = Logbook.tutto();
    riepilogo.textContent = `Vie fatte: ${Logbook.fatte(f)} su ${f.vie.length}`;
    elencoVie.innerHTML = f.vie
      .map((v) => {
        const e = dati[v.id];
        const stato = e?.fatta ? "fatta" : "";
        const stelle = e?.stelle ? `<span class="stelle-mini" aria-label="${e.stelle} stelle su 5">${stelleTesto(e.stelle)}</span>` : "";
        return `
        <div class="via ${stato}">
          <span class="grado ${classeGrado(v.grado)}">${v.grado}</span>
          <div class="via-info">
            <strong>${esc(v.nome)}</strong>
            <span>${v.lunghezza} m · ${v.rinvii} rinvii ${stelle}</span>
          </div>
          <button type="button" class="btn-via ${e?.fatta ? "fatta" : ""}" data-via="${v.id}" aria-label="${e?.fatta ? "Modifica" : "Segna"} ${esc(v.nome)}">
            ${e?.fatta ? "✓ Fatta" : e ? "Recensita" : "Segna"}
          </button>
        </div>`;
      })
      .join("");
  }
  disegnaVie();

  // ---------- Finestra di registrazione ----------
  const dlg = document.getElementById("dialogo-via");
  const campi = {
    titolo: document.getElementById("dv-titolo"),
    sotto: document.getElementById("dv-sotto"),
    fatta: document.getElementById("dv-fatta"),
    data: document.getElementById("dv-data"),
    nota: document.getElementById("dv-nota"),
    stelle: document.getElementById("dv-stelle"),
  };
  let viaCorrente = null;
  let stelleCorrenti = 0;

  campi.stelle.innerHTML = [1, 2, 3, 4, 5]
    .map((n) => `<button type="button" class="stella" data-n="${n}" aria-label="${n} stelle" aria-pressed="false">★</button>`)
    .join("");

  function mostraStelle() {
    campi.stelle.querySelectorAll(".stella").forEach((b) => {
      const attiva = Number(b.dataset.n) <= stelleCorrenti;
      b.setAttribute("aria-pressed", attiva);
    });
  }
  campi.stelle.addEventListener("click", (e) => {
    const b = e.target.closest(".stella");
    if (!b) return;
    const n = Number(b.dataset.n);
    stelleCorrenti = stelleCorrenti === n ? 0 : n; // un secondo clic toglie la valutazione
    mostraStelle();
  });

  const oggi = () => new Date().toISOString().slice(0, 10);

  campi.fatta.addEventListener("change", () => {
    if (campi.fatta.checked && !campi.data.value) campi.data.value = oggi();
  });

  elencoVie.addEventListener("click", (e) => {
    const b = e.target.closest(".btn-via");
    if (!b) return;
    viaCorrente = f.vie.find((v) => v.id === b.dataset.via);
    const voce = Logbook.get(viaCorrente.id);
    campi.titolo.textContent = viaCorrente.nome;
    campi.sotto.textContent = `${f.nome} · grado ${viaCorrente.grado}`;
    campi.fatta.checked = !!voce?.fatta;
    campi.data.value = voce?.data || "";
    campi.nota.value = voce?.nota || "";
    stelleCorrenti = voce?.stelle || 0;
    mostraStelle();
    document.getElementById("dv-rimuovi").hidden = !voce;
    dlg.showModal();
  });

  document.getElementById("dv-annulla").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) dlg.close();
  });

  document.getElementById("dv-rimuovi").addEventListener("click", () => {
    Logbook.rimuovi(viaCorrente.id);
    dlg.close();
    disegnaVie();
  });

  document.getElementById("form-via").addEventListener("submit", (e) => {
    e.preventDefault();
    const voce = {
      fatta: campi.fatta.checked,
      data: campi.fatta.checked ? campi.data.value || oggi() : campi.data.value,
      stelle: stelleCorrenti,
      nota: campi.nota.value.trim(),
    };
    // Se non c'è niente da ricordare, la voce viene tolta
    if (!voce.fatta && !voce.stelle && !voce.nota) Logbook.rimuovi(viaCorrente.id);
    else Logbook.set(viaCorrente.id, voce);
    dlg.close();
    disegnaVie();
  });
})();
