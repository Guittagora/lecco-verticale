// Checklist dello zaino: spunte e voci personali salvate nel browser (localStorage).
(function () {
  const CHIAVE = "checklist-escursioni";

  const BASE = {
    "Abbigliamento": ["Scarponi o scarpe da trekking", "Calze di ricambio", "Pile o felpa calda", "Giacca antipioggia", "Cappello e guanti"],
    "Sicurezza": ["Telefono carico", "Kit di primo soccorso", "Telo termico", "Frontale con pile cariche", "Fischietto", "Casco (percorsi EEA)", "Set da ferrata (percorsi EEA)"],
    "Cibo e acqua": ["Acqua (1,5–2 litri)", "Panino o pranzo al sacco", "Frutta secca", "Barrette energetiche"],
    "Orientamento": ["Traccia GPX scaricata", "Mappa cartacea", "Power bank"],
    "Altro": ["Crema solare e occhiali", "Bastoncini", "Sacchetto per i rifiuti", "Contanti per il rifugio"],
  };

  function carica() {
    try {
      return JSON.parse(localStorage.getItem(CHIAVE)) || { spunte: {}, extra: [] };
    } catch (e) {
      return { spunte: {}, extra: [] };
    }
  }
  function salva() {
    try {
      localStorage.setItem(CHIAVE, JSON.stringify(stato));
    } catch (e) {}
  }

  let stato = carica();
  const cont = document.getElementById("gruppi");
  const select = document.getElementById("nuova-cat");
  select.innerHTML = Object.keys(BASE).map((c) => `<option>${c}</option>`).join("");

  const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function elementi() {
    const lista = [];
    for (const [cat, voci] of Object.entries(BASE)) {
      voci.forEach((t, i) => lista.push({ id: `b-${cat}-${i}`, testo: t, cat, extra: false }));
    }
    stato.extra.forEach((e) => lista.push({ ...e, extra: true }));
    return lista;
  }

  function disegna() {
    const tutti = elementi();
    cont.innerHTML = Object.keys(BASE)
      .map((cat) => {
        const righe = tutti
          .filter((v) => v.cat === cat)
          .sort((a, b) => !!stato.spunte[a.id] - !!stato.spunte[b.id])
          .map(
            (v) => `
          <li class="voce">
            <input type="checkbox" id="${v.id}" data-id="${v.id}" ${stato.spunte[v.id] ? "checked" : ""}>
            <label for="${v.id}">${esc(v.testo)}</label>
            ${v.extra ? `<button class="rimuovi" type="button" data-rimuovi="${v.id}" aria-label="Rimuovi ${esc(v.testo)}">×</button>` : ""}
          </li>`
          )
          .join("");
        return `<div class="checklist-gruppo"><h3>${cat}</h3><ul>${righe}</ul></div>`;
      })
      .join("");
    aggiornaProgresso(tutti);
  }

  function aggiornaProgresso(tutti = elementi()) {
    const fatte = tutti.filter((v) => stato.spunte[v.id]).length;
    const perc = tutti.length ? Math.round((fatte / tutti.length) * 100) : 0;
    document.getElementById("testo-progresso").textContent = `${fatte} di ${tutti.length} pronte`;
    document.getElementById("barra-riempimento").style.width = perc + "%";
    document.getElementById("barra").setAttribute("aria-valuenow", perc);
  }

  cont.addEventListener("change", (e) => {
    const id = e.target.dataset.id;
    if (!id) return;
    if (e.target.checked) stato.spunte[id] = true;
    else delete stato.spunte[id];
    salva();
    disegna();
    document.getElementById(id)?.focus();
  });

  cont.addEventListener("click", (e) => {
    const id = e.target.dataset.rimuovi;
    if (!id) return;
    stato.extra = stato.extra.filter((x) => x.id !== id);
    delete stato.spunte[id];
    salva();
    disegna();
  });

  document.getElementById("form-aggiungi").addEventListener("submit", (e) => {
    e.preventDefault();
    const campo = document.getElementById("nuova-voce");
    const testo = campo.value.trim();
    if (!testo) return;
    stato.extra.push({ id: `x-${Date.now()}`, testo, cat: select.value });
    campo.value = "";
    salva();
    disegna();
  });

  document.getElementById("azzera").addEventListener("click", () => {
    stato.spunte = {};
    salva();
    disegna();
  });

  disegna();
})();
