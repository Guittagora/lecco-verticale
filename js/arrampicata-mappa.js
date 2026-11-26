// Mappa interattiva delle falesie con anteprima nel popup e elenco sotto la mappa.
(function () {
  const root = "../";

  function riepilogo(f) {
    const [min, max] = rangeGradi(f);
    return `${min} – ${max}`;
  }

  function popup(f) {
    const fatte = Logbook.fatte(f);
    return `
      <div class="popup-falesia">
        <div class="popup-img" style="--img:url('${root}${f.foto[0]?.file ?? ""}')"></div>
        <div class="popup-corpo">
          <strong>${esc(f.nome)}</strong>
          <span class="popup-zona">${esc(f.zona)}</span>
          <dl>
            <dt>Gradi</dt><dd>${riepilogo(f)}</dd>
            <dt>Esposizione</dt><dd>${esc(f.esposizione)}</dd>
            <dt>Avvicinamento</dt><dd>${f.avvicinamento.minuti} min</dd>
            <dt>Vie fatte</dt><dd>${fatte} su ${f.vie.length}</dd>
          </dl>
          <a class="btn btn-pieno popup-btn" href="falesia.html?id=${f.id}">Apri la scheda</a>
        </div>
      </div>`;
  }

  // ---------- Mappa ----------
  const mappa = L.map("mappa", { scrollWheelZoom: false });
  L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    maxZoom: 17,
    attribution: 'Mappa © <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA), dati © OpenStreetMap',
  }).addTo(mappa);

  const marcatori = {};
  const limiti = [];
  FALESIE.forEach((f) => {
    const icona = L.divIcon({
      className: "",
      html: '<div class="pin-falesia"><span></span></div>',
      iconSize: [34, 42],
      iconAnchor: [17, 40],
      popupAnchor: [0, -38],
    });
    marcatori[f.id] = L.marker([f.lat, f.lon], { icon: icona, title: f.nome, keyboard: true })
      .addTo(mappa)
      .bindPopup(() => popup(f), { maxWidth: 270, minWidth: 240 });
    limiti.push([f.lat, f.lon]);
  });
  mappa.fitBounds(limiti, { padding: [50, 50], maxZoom: 13 });
  mappa.on("focus", () => mappa.scrollWheelZoom.enable());
  mappa.on("blur", () => mappa.scrollWheelZoom.disable());

  // ---------- Elenco ----------
  document.getElementById("elenco").innerHTML = FALESIE.map((f) => {
    const img = f.foto[0] ? `style="--img: url('${root}${f.foto[0].file}')"` : "";
    return `
      <a class="card-percorso" href="falesia.html?id=${f.id}">
        <div class="card-img" ${img}></div>
        <div class="card-corpo">
          <p class="occhiello">${esc(f.zona)}</p>
          <h3>${esc(f.nome)}</h3>
          <ul class="stats">
            <li><strong>${riepilogo(f)}</strong></li>
            <li>${f.vie.length} vie</li>
            <li>${esc(f.esposizione)}</li>
          </ul>
        </div>
      </a>`;
  }).join("");
})();
