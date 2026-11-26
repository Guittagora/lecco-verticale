// Galleria delle escursioni: tutte le foto dei percorsi, filtrabili per montagna, con ingrandimento.
(function () {
  const root = "../";
  const griglia = document.getElementById("griglia");
  const box = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbDid = document.getElementById("lb-didascalia");
  const lbLink = document.getElementById("lb-link");
  let montagna = "";
  let visibili = [];
  let corrente = 0;

  const tutte = PERCORSI.flatMap((p) =>
    p.foto.map((f, i) => ({ ...f, percorso: p, chiave: `${p.id}-${i}` }))
  );

  const chips = document.getElementById("filtro-montagna");
  chips.innerHTML = [["", "Tutte"], ...MONTAGNE.map((m) => [m, m])]
    .map(([v, t]) => `<button type="button" class="chip" data-val="${v}" aria-pressed="${v === ""}">${t}</button>`)
    .join("");
  chips.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    montagna = b.dataset.val;
    chips.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b));
    disegna();
  });

  function disegna() {
    visibili = tutte.filter((f) => !montagna || f.percorso.montagna === montagna);
    griglia.innerHTML = visibili.length
      ? visibili
          .map(
            (f, i) =>
              `<button type="button" class="foto" data-i="${i}" style="--img:url('${root}${f.file}')" data-didascalia="${f.didascalia} · ${f.percorso.nome}" aria-label="${f.didascalia}"></button>`
          )
          .join("")
      : '<p class="vuoto" style="grid-column:1/-1">Ancora nessuna foto per questa montagna.</p>';
  }

  function apri(i) {
    corrente = (i + visibili.length) % visibili.length;
    const f = visibili[corrente];
    lbImg.style.setProperty("--img", `url('${root}${f.file}')`);
    lbImg.setAttribute("aria-label", f.didascalia);
    lbDid.textContent = `${f.didascalia} · ${f.percorso.nome}`;
    lbLink.href = `percorso.html?id=${f.percorso.id}`;
    if (!box.open) box.showModal();
  }

  griglia.addEventListener("click", (e) => {
    const b = e.target.closest(".foto");
    if (b) apri(Number(b.dataset.i));
  });
  document.getElementById("lb-chiudi").addEventListener("click", () => box.close());
  document.getElementById("lb-prec").addEventListener("click", () => apri(corrente - 1));
  document.getElementById("lb-succ").addEventListener("click", () => apri(corrente + 1));
  box.addEventListener("click", (e) => {
    if (e.target === box) box.close();
  });
  box.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") apri(corrente - 1);
    if (e.key === "ArrowRight") apri(corrente + 1);
  });

  disegna();

  // Un link come galleria.html#percorso-id-0 apre direttamente quella foto
  const ancora = location.hash.slice(1);
  const indice = visibili.findIndex((f) => f.chiave === ancora);
  if (indice >= 0) apri(indice);
})();
