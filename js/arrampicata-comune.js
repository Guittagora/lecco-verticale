// Funzioni comuni alla sezione Arrampicata: gradi, formattazione e logbook salvato nel browser.

const GRADI = ["3", "4", "4+", "5a", "5a+", "5b", "5b+", "5c", "5c+", "6a", "6a+", "6b", "6b+", "6c", "6c+", "7a", "7a+", "7b", "7b+", "7c", "7c+", "8a"];
const indiceGrado = (g) => GRADI.indexOf(g);

// Colore del grado: 1 facile, 2 medio, 3 impegnativo, 4 difficile
function classeGrado(g) {
  const i = indiceGrado(g);
  if (i < 0) return "g-x";
  if (i <= indiceGrado("5c+")) return "g-1";
  if (i <= indiceGrado("6b+")) return "g-2";
  if (i <= indiceGrado("7a+")) return "g-3";
  return "g-4";
}

const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function rangeGradi(falesia) {
  const ordinati = falesia.vie.map((v) => v.grado).sort((a, b) => indiceGrado(a) - indiceGrado(b));
  return ordinati.length ? [ordinati[0], ordinati[ordinati.length - 1]] : ["?", "?"];
}

const stelleTesto = (n) => "★".repeat(n) + "☆".repeat(5 - n);

// Logbook personale: una voce per via, salvata in localStorage
// voce = { fatta: bool, data: "AAAA-MM-GG", stelle: 0-5, nota: "…" }
const Logbook = {
  chiave: "logbook-vie",
  tutto() {
    try {
      return JSON.parse(localStorage.getItem(this.chiave)) || {};
    } catch (e) {
      return {};
    }
  },
  get(id) {
    return this.tutto()[id] || null;
  },
  sostituisci(dati) {
    try {
      localStorage.setItem(this.chiave, JSON.stringify(dati));
    } catch (e) {}
  },
  set(id, voce) {
    const d = this.tutto();
    d[id] = voce;
    this.sostituisci(d);
  },
  rimuovi(id) {
    const d = this.tutto();
    delete d[id];
    this.sostituisci(d);
  },
  fatte(falesia) {
    const d = this.tutto();
    return falesia.vie.filter((v) => d[v.id]?.fatta).length;
  },
};

// Cerca una via per id in tutte le falesie
function trovaVia(id) {
  for (const f of FALESIE) {
    const v = f.vie.find((x) => x.id === id);
    if (v) return { via: v, falesia: f };
  }
  return null;
}

// Riga dei crediti per le foto che ne hanno uno (licenze CC BY / BY-SA): "" se non ce ne sono
function creditiFoto(foto) {
  const visti = new Set();
  const voci = foto
    .filter((x) => x.credito && !visti.has(x.credito.autore + x.credito.licenza) && visti.add(x.credito.autore + x.credito.licenza))
    .map((x) => `<a href="${esc(x.credito.url)}" target="_blank" rel="noopener">${esc(x.credito.autore)}</a> (${esc(x.credito.licenza)})`);
  return voci.length ? `Foto: ${voci.join(", ")}, via Wikimedia Commons` : "";
}
