// Elenco percorsi con filtri per montagna, difficoltà e ricerca per nome.
(function () {
  const root = "../";
  const elenco = document.getElementById("elenco");
  const conteggio = document.getElementById("conteggio");
  const cerca = document.getElementById("cerca");
  const filtri = { montagna: "", difficolta: "", testo: "" };
  const dati = {}; // id → statistiche calcolate dal GPX

  function creaChips(contenitore, chiave, voci) {
    const tutti = [["", "Tutte"], ...voci];
    contenitore.innerHTML = tutti
      .map(([val, testo]) => `<button type="button" class="chip" data-val="${val}" aria-pressed="${val === ""}">${testo}</button>`)
      .join("");
    contenitore.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      filtri[chiave] = b.dataset.val;
      contenitore.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b));
      disegna();
    });
  }

  creaChips(document.getElementById("filtro-montagna"), "montagna", MONTAGNE.map((m) => [m, m]));
  creaChips(document.getElementById("filtro-difficolta"), "difficolta", Object.keys(DIFFICOLTA).map((d) => [d, d]));
  cerca.addEventListener("input", () => {
    filtri.testo = cerca.value.trim().toLowerCase();
    disegna();
  });

  function statistiche(p) {
    const g = dati[p.id];
    if (!g) return '<li>Statistiche in caricamento…</li>';
    return `
      <li><strong>${fmt1(g.km)}</strong> km</li>
      <li><strong>+${g.salita}</strong> m</li>
      <li><strong>${stimaDurata(g)}</strong></li>`;
  }

  function disegna() {
    const visibili = PERCORSI.filter(
      (p) =>
        (!filtri.montagna || p.montagna === filtri.montagna) &&
        (!filtri.difficolta || p.difficolta === filtri.difficolta) &&
        (!filtri.testo || p.nome.toLowerCase().includes(filtri.testo))
    );
    conteggio.textContent =
      visibili.length === 1 ? "1 percorso" : `${visibili.length} percorsi`;

    if (!visibili.length) {
      elenco.innerHTML = '<p class="vuoto" style="grid-column:1/-1">Nessun percorso corrisponde ai filtri. Prova a toglierne qualcuno.</p>';
      return;
    }
    elenco.innerHTML = visibili
      .map((p) => {
        const img = p.foto[0] ? `style="--img: url('${root}${p.foto[0].file}')"` : "";
        return `
        <a class="card-percorso" href="percorso.html?id=${p.id}">
          <div class="card-img" ${img}><span class="diff diff-${p.difficolta}" title="${DIFFICOLTA[p.difficolta].nome}">${p.difficolta}</span></div>
          <div class="card-corpo">
            <p class="occhiello">${p.montagna}</p>
            <h3>${p.nome}</h3>
            <ul class="stats">${statistiche(p)}</ul>
          </div>
        </a>`;
      })
      .join("");
  }

  disegna();
  Promise.all(
    PERCORSI.map((p) =>
      caricaGpx(root + p.gpx)
        .then((g) => (dati[p.id] = g))
        .catch(() => {})
    )
  ).then(disegna);
})();
