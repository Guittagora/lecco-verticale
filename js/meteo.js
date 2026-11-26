// Previsioni meteo da Open-Meteo (gratuito, senza chiave API).
// Uso: mostraMeteo(elemento, { lat, lon }, giorni)

const CODICI_METEO = {
  0: ["☀️", "Sereno"],
  1: ["🌤️", "Poco nuvoloso"],
  2: ["⛅", "Parzialmente nuvoloso"],
  3: ["☁️", "Coperto"],
  45: ["🌫️", "Nebbia"],
  48: ["🌫️", "Nebbia con brina"],
  51: ["🌦️", "Pioviggine debole"],
  53: ["🌦️", "Pioviggine"],
  55: ["🌦️", "Pioviggine intensa"],
  56: ["🌧️", "Pioviggine gelata"],
  57: ["🌧️", "Pioviggine gelata"],
  61: ["🌧️", "Pioggia debole"],
  63: ["🌧️", "Pioggia"],
  65: ["🌧️", "Pioggia forte"],
  66: ["🌧️", "Pioggia gelata"],
  67: ["🌧️", "Pioggia gelata forte"],
  71: ["🌨️", "Neve debole"],
  73: ["🌨️", "Neve"],
  75: ["❄️", "Neve forte"],
  77: ["🌨️", "Nevischio"],
  80: ["🌦️", "Rovesci deboli"],
  81: ["🌦️", "Rovesci"],
  82: ["⛈️", "Rovesci forti"],
  85: ["🌨️", "Rovesci di neve"],
  86: ["🌨️", "Rovesci di neve forti"],
  95: ["⛈️", "Temporale"],
  96: ["⛈️", "Temporale con grandine"],
  99: ["⛈️", "Temporale con grandine"],
};

async function mostraMeteo(el, { lat, lon }, giorni = 5) {
  el.innerHTML = '<p class="meteo-stato">Caricamento previsioni…</p>';
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${lat}&longitude=${lon}` +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
    `&timezone=Europe%2FRome&forecast_days=${giorni}`;

  try {
    const risposta = await fetch(url);
    if (!risposta.ok) throw new Error(risposta.status);
    const { daily } = await risposta.json();

    el.innerHTML = daily.time
      .map((data, i) => {
        const [icona, descrizione] = CODICI_METEO[daily.weather_code[i]] || ["🌡️", "—"];
        const giorno =
          i === 0
            ? "Oggi"
            : new Date(`${data}T12:00`).toLocaleDateString("it-IT", { weekday: "short", day: "numeric" });
        return `
          <div class="meteo-giorno">
            <div class="meteo-data">${giorno}</div>
            <div class="meteo-icona" aria-hidden="true">${icona}</div>
            <div class="meteo-desc">${descrizione}</div>
            <div class="meteo-temp">${Math.round(daily.temperature_2m_max[i])}° <span class="min">/ ${Math.round(daily.temperature_2m_min[i])}°</span></div>
            <div class="meteo-pioggia">💧 ${daily.precipitation_probability_max[i] ?? 0}%</div>
          </div>`;
      })
      .join("");
  } catch (errore) {
    el.innerHTML = '<p class="meteo-stato">Previsioni non disponibili al momento. Riprova più tardi.</p>';
  }
}
