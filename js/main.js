// Parti comuni a tutte le pagine: header, footer, tema chiaro/scuro e menu mobile.
// Ogni pagina indica nel <body>:
//   data-root   → percorso verso la cartella principale ("" oppure "../")
//   data-pagina → voce di menu da evidenziare
//   data-titolo → titolo della pagina (facoltativo)
(function () {
  const root = document.body.dataset.root || "";
  const pagina = document.body.dataset.pagina || "";
  const titolo = document.body.dataset.titolo;
  const instagramUrl = `https://www.instagram.com/${SITO.instagram}/`;

  document.title = titolo ? `${titolo} · ${SITO.nome}` : `${SITO.nome} · ${SITO.sottotitolo}`;

  const voci = [
    { id: "home", testo: "Home", href: "index.html" },
    { id: "escursioni", testo: "Escursioni", href: "escursioni/index.html" },
    { id: "arrampicata", testo: "Arrampicata", href: "arrampicata/index.html" },
    { id: "chi-sono", testo: "Chi sono", href: "chi-sono.html" },
    { id: "esci-con-me", testo: "Esci con me", href: "esci-con-me.html" },
  ];

  const iconaLogo = `
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true">
      <path d="M2 27 L11 11 L16 18 L21 7 L30 27 Z" fill="currentColor" fill-opacity="0.15"/>
      <path d="M21 7 L18.5 12 L21 11 L23.5 12 Z" fill="currentColor"/>
    </svg>`;
  const iconaInstagram = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
    </svg>`;

  // ---------- Header ----------
  const header = document.getElementById("header");
  if (header) {
    const link = voci
      .map((v) => `<li><a href="${root}${v.href}"${v.id === pagina ? ' aria-current="page"' : ""}>${v.testo}</a></li>`)
      .join("");
    header.outerHTML = `
      <header class="header">
        <div class="contenitore header-riga">
          <a class="logo" href="${root}index.html">${iconaLogo}<span>${SITO.nome}</span></a>
          <nav class="nav" id="nav" aria-label="Menu principale"><ul>${link}</ul></nav>
          <div class="header-azioni">
            <a class="icona-btn" href="${instagramUrl}" target="_blank" rel="noopener" aria-label="Instagram">${iconaInstagram}</a>
            <button class="icona-btn" id="tema-btn" type="button" aria-label="Cambia tema chiaro/scuro">
              <svg class="icona-sole" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
              </svg>
              <svg class="icona-luna" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>
              </svg>
            </button>
            <button class="icona-btn menu-btn" id="menu-btn" type="button" aria-label="Apri menu" aria-expanded="false" aria-controls="nav">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16"/>
              </svg>
            </button>
          </div>
        </div>
      </header>`;
  }

  // ---------- Footer ----------
  const footer = document.getElementById("footer");
  if (footer) {
    const link = voci.map((v) => `<li><a href="${root}${v.href}">${v.testo}</a></li>`).join("");
    footer.outerHTML = `
      <footer class="footer">
        <div class="contenitore">
          <div class="footer-griglia">
            <div>
              <a class="logo" href="${root}index.html">${iconaLogo}<span>${SITO.nome}</span></a>
              <div>${SITO.sottotitolo}</div>
            </div>
            <ul>${link}<li><a href="${instagramUrl}" target="_blank" rel="noopener">Instagram @${SITO.instagram}</a></li></ul>
          </div>
          <p class="footer-nota">
            Le informazioni su sentieri e falesie sono indicative: verifica sempre condizioni, meteo e
            tue capacità prima di partire. © ${new Date().getFullYear()} ${SITO.autore}
          </p>
        </div>
      </footer>`;
  }

  // ---------- Sottomenu della sezione (se la pagina ha <div id="subnav" data-sezione="…">) ----------
  const SOTTOMENU = {
    escursioni: [
      { id: "percorsi", testo: "Percorsi", href: "escursioni/index.html" },
      { id: "galleria", testo: "Galleria", href: "escursioni/galleria.html" },
      { id: "checklist", testo: "Checklist zaino", href: "escursioni/checklist.html" },
    ],
    arrampicata: [
      { id: "mappa", testo: "Mappa falesie", href: "arrampicata/index.html" },
      { id: "galleria", testo: "Galleria", href: "arrampicata/galleria.html" },
      { id: "logbook", testo: "Logbook", href: "arrampicata/logbook.html" },
    ],
  };
  const subnav = document.getElementById("subnav");
  if (subnav && SOTTOMENU[subnav.dataset.sezione]) {
    const sotto = document.body.dataset.sotto || "";
    const voceLi = SOTTOMENU[subnav.dataset.sezione]
      .map((v) => `<li><a href="${root}${v.href}"${v.id === sotto ? ' aria-current="page"' : ""}>${v.testo}</a></li>`)
      .join("");
    subnav.outerHTML = `<nav class="subnav" aria-label="Sezione"><div class="contenitore"><ul>${voceLi}</ul></div></nav>`;
  }

  // ---------- Testi e link presi dalla configurazione ----------
  document.querySelectorAll('[data-sito="nome"]').forEach((el) => (el.textContent = SITO.nome));
  document.querySelectorAll('[data-sito="autore"]').forEach((el) => (el.textContent = SITO.autore));
  document.querySelectorAll('[data-sito="instagram"]').forEach((el) => {
    el.href = instagramUrl;
    el.target = "_blank";
    el.rel = "noopener";
  });

  // ---------- Tema chiaro/scuro ----------
  const temaBtn = document.getElementById("tema-btn");
  if (temaBtn) {
    temaBtn.addEventListener("click", () => {
      const attuale =
        document.documentElement.dataset.theme ||
        (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const nuovo = attuale === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = nuovo;
      try {
        localStorage.setItem("tema", nuovo);
      } catch (e) {}
    });
  }

  // ---------- Menu mobile ----------
  const menuBtn = document.getElementById("menu-btn");
  const nav = document.getElementById("nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const aperto = nav.classList.toggle("aperto");
      menuBtn.setAttribute("aria-expanded", aperto);
    });
  }
})();
