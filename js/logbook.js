// Pagina logbook: statistiche, elenco delle vie registrate, esporta e importa.
(function () {
  const stat = document.getElementById("statistiche");
  const elenco = document.getElementById("elenco");
  const messaggio = document.getElementById("messaggio");

  const dataIt = (s) => (s ? new Date(`${s}T12:00`).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" }) : "");

  function disegna() {
    const dati = Logbook.tutto();
    const voci = Object.entries(dati)
      .map(([id, e]) => ({ ...trovaVia(id), e }))
      .filter((x) => x.via); // ignora voci di vie non più presenti
    const fatte = voci.filter((x) => x.e.fatta);

    // ---------- Statistiche ----------
    if (!voci.length) {
      stat.innerHTML = "";
      elenco.innerHTML = `
        <div class="vuoto">
          <p>Il logbook è ancora vuoto. Apri una falesia e tocca "Segna" accanto a una via per iniziare.</p>
          <a class="btn btn-pieno" href="index.html">Vai alle falesie</a>
        </div>`;
      return;
    }

    const migliore = fatte.reduce((m, x) => (!m || indiceGrado(x.via.grado) > indiceGrado(m.via.grado) ? x : m), null);
    const falesieViste = new Set(fatte.map((x) => x.falesia.id)).size;
    const conStelle = voci.filter((x) => x.e.stelle);
    const media = conStelle.length ? conStelle.reduce((s, x) => s + x.e.stelle, 0) / conStelle.length : 0;

    const perGrado = {};
    fatte.forEach((x) => (perGrado[x.via.grado] = (perGrado[x.via.grado] || 0) + 1));
    const gradiUsati = GRADI.filter((g) => perGrado[g]);
    const massimo = Math.max(1, ...Object.values(perGrado));
    const barre = gradiUsati.length
      ? `<div class="barre" role="img" aria-label="Vie fatte per grado">${gradiUsati
          .map(
            (g) => `
          <div class="barra-col">
            <span class="barra-n">${perGrado[g]}</span>
            <div class="barra ${classeGrado(g)}" style="height:${Math.round((perGrado[g] / massimo) * 100)}%"></div>
            <span class="barra-g">${g}</span>
          </div>`
          )
          .join("")}</div>`
      : "";

    stat.innerHTML = `
      <div class="stat-grandi">
        <div class="stat-grande"><div class="valore">${fatte.length}</div><div class="nome">Vie fatte</div></div>
        <div class="stat-grande"><div class="valore">${migliore ? migliore.via.grado : "—"}</div><div class="nome">Grado massimo</div></div>
        <div class="stat-grande"><div class="valore">${falesieViste}</div><div class="nome">Falesie visitate</div></div>
        <div class="stat-grande"><div class="valore">${media ? media.toLocaleString("it-IT", { maximumFractionDigits: 1 }) + " ★" : "—"}</div><div class="nome">Voto medio</div></div>
      </div>
      ${barre ? `<div class="pannello" style="margin-bottom:28px"><h3>Vie fatte per grado</h3>${barre}</div>` : ""}`;

    // ---------- Elenco per falesia ----------
    const gruppi = {};
    voci.forEach((x) => (gruppi[x.falesia.id] ||= { falesia: x.falesia, voci: [] }).voci.push(x));
    elenco.innerHTML = Object.values(gruppi)
      .map(({ falesia, voci }) => {
        const righe = voci
          .sort((a, b) => (b.e.data || "").localeCompare(a.e.data || ""))
          .map(
            (x) => `
          <li class="log-riga">
            <span class="grado ${classeGrado(x.via.grado)}">${x.via.grado}</span>
            <div class="log-corpo">
              <strong>${esc(x.via.nome)}</strong>
              <span class="log-meta">
                ${x.e.fatta ? `✓ Fatta${x.e.data ? " il " + dataIt(x.e.data) : ""}` : "Non ancora fatta"}
                ${x.e.stelle ? `· <span class="stelle-mini">${stelleTesto(x.e.stelle)}</span>` : ""}
              </span>
              ${x.e.nota ? `<p class="log-nota">${esc(x.e.nota)}</p>` : ""}
            </div>
          </li>`
          )
          .join("");
        return `
        <div class="pannello" style="margin-bottom:16px">
          <h3><a href="falesia.html?id=${falesia.id}">${esc(falesia.nome)}</a> <span class="nota">· ${esc(falesia.zona)}</span></h3>
          <ul class="log-lista">${righe}</ul>
        </div>`;
      })
      .join("");
  }

  function avviso(testo) {
    messaggio.textContent = testo;
  }

  // ---------- Esporta ----------
  document.getElementById("esporta").addEventListener("click", () => {
    const dati = Logbook.tutto();
    const contenuto = JSON.stringify({ sito: SITO.nome, tipo: "logbook-vie", versione: 1, vie: dati }, null, 2);
    const url = URL.createObjectURL(new Blob([contenuto], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `logbook-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    avviso(`Esportate ${Object.keys(dati).length} voci.`);
  });

  // ---------- Importa ----------
  const fileInput = document.getElementById("file-importa");
  document.getElementById("importa").addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    fileInput.value = "";
    if (!file) return;
    try {
      const json = JSON.parse(await file.text());
      if (json.tipo !== "logbook-vie" || typeof json.vie !== "object" || json.vie === null) throw new Error("formato");
      // Tiene solo voci ben formate; le voci già presenti con lo stesso id vengono aggiornate
      const attuale = Logbook.tutto();
      let n = 0;
      for (const [id, e] of Object.entries(json.vie)) {
        if (!trovaVia(id) || typeof e !== "object" || e === null) continue;
        attuale[id] = {
          fatta: !!e.fatta,
          data: typeof e.data === "string" ? e.data.slice(0, 10) : "",
          stelle: Math.min(5, Math.max(0, Number(e.stelle) || 0)),
          nota: typeof e.nota === "string" ? e.nota.slice(0, 500) : "",
        };
        n++;
      }
      Logbook.sostituisci(attuale);
      avviso(`Importate ${n} voci.`);
      disegna();
    } catch (e) {
      avviso("Questo file non sembra un logbook esportato da qui.");
    }
  });

  disegna();
})();
