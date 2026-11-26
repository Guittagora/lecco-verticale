// Galleria delle falesie: ogni foto porta alla scheda della sua falesia.
(function () {
  const root = "../";
  const griglia = document.getElementById("griglia");
  const chips = document.getElementById("filtro");
  const crediti = document.getElementById("crediti");
  let scelta = "";

  const tutte = FALESIE.flatMap((f) => f.foto.map((x) => ({ ...x, falesia: f })));

  chips.innerHTML = [["", "Tutte"], ...FALESIE.map((f) => [f.id, f.nome])]
    .map(([v, t]) => `<button type="button" class="chip" data-val="${v}" aria-pressed="${v === ""}">${esc(t)}</button>`)
    .join("");
  chips.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    scelta = b.dataset.val;
    chips.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b));
    disegna();
  });

  function disegna() {
    const visibili = tutte.filter((x) => !scelta || x.falesia.id === scelta);
    griglia.innerHTML = visibili.length
      ? visibili
          .map(
            (x) =>
              `<a class="foto foto-link" href="falesia.html?id=${x.falesia.id}" style="--img:url('${root}${x.file}')" data-didascalia="${esc(x.didascalia)} · ${esc(x.falesia.nome)}" aria-label="${esc(x.falesia.nome)}: ${esc(x.didascalia)}"></a>`
          )
          .join("")
      : '<p class="vuoto" style="grid-column:1/-1">Ancora nessuna foto.</p>';
    crediti.innerHTML = creditiFoto(visibili);
  }
  disegna();
})();
