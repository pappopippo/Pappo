/* =========================================================
   ✏️ LA TUA EMAIL (usata dal modulo contatti)
   ========================================================= */
const EMAIL = "1dkm4nimb0r3d@gmail.com";

/* =========================================================
   ✏️ I TUOI PROGETTI
   Per aggiungerne uno copia un blocco { ... } e cambia i dati.
   - colore: il colore del progetto (bordo e bagliore al passaggio del mouse)
   - immagine: metti lo screenshot nella cartella img/
   - pulsanti: testo e link (lascia "#" finché non hai il link vero)
   ========================================================= */
const PROGETTI = [
  {
    titolo: "PLauncher",
    colore: "#ff9a1f",
    immagine: "img/plauncher.png",
    descrizione: "Launcher offline per Minecraft Java. Scegli nome e versione, premi GIOCA e sei dentro.",
    funzioni: [
      "Gioca offline con il nome che preferisci",
      "Scelta della versione, con filtro \"solo release\"",
      "RAM personalizzabile",
      "Java rilevato in automatico, o percorso a scelta",
      "Apri la cartella di gioco con un clic",
    ],
    tecnologie: ["Minecraft Java", "Offline", "Windows"],
    pulsanti: [{ testo: "Download", link: "https://drive.google.com/file/d/17yDyk2sJBj6sEK-nnkYybTYJs_dmKL4_/view?usp=sharing", principale: true, nuovaScheda: true }],
  },
  {
    titolo: "Globo dei Viaggi",
    colore: "#4fd1c5",
    immagine: "img/globo-viaggi.png",
    descrizione: "Un globo 3D che ruota: clicca un paese per segnare dove sei stato e dove vuoi andare.",
    funzioni: [
      "Globo terrestre 3D interattivo e rotante",
      "Clicca un paese per cambiarne lo stato",
      "Arancione: visitato · Verde acqua: voglio andarci",
      "Grigio: non ancora",
    ],
    tecnologie: ["HTML", "JavaScript", "3D"],
    pulsanti: [{ testo: "Provalo", link: "globo.html", principale: true }],
  },
];

/* ---------- Da qui in giù non serve modificare ---------- */

// Card dei progetti
function creaProgetto(p) {
  const card = document.createElement("article");
  card.className = "project reveal";
  card.style.setProperty("--p", p.colore);

  const funzioni = p.funzioni.map((f) => `<li>${f}</li>`).join("");
  const tag = p.tecnologie.map((t) => `<span>${t}</span>`).join("");
  const pulsanti = p.pulsanti
    .map((b) => `<a class="btn ${b.principale ? "btn-primary" : "btn-ghost"}" href="${b.link}"${b.nuovaScheda ? ' target="_blank" rel="noopener"' : ""}>${b.testo}</a>`)
    .join("");

  card.innerHTML = `
    <div class="project-shot"><img src="${p.immagine}" alt="Screenshot di ${p.titolo}" loading="lazy" decoding="async"></div>
    <div class="project-body">
      <div class="project-title"><h3>${p.titolo}</h3></div>
      <p>${p.descrizione}</p>
      <ul class="features">${funzioni}</ul>
      <div class="tags">${tag}</div>
      <div class="project-actions">${pulsanti}</div>
    </div>`;
  return card;
}

const lista = document.getElementById("projects");
PROGETTI.forEach((p) => lista.appendChild(creaProgetto(p)));

// Menu a scomparsa su telefono
const menuBtn = document.querySelector(".menu-btn");
const menu = document.getElementById("menu");
function chiudiMenu() {
  menu.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "Apri il menu");
}
menuBtn.addEventListener("click", () => {
  const aperto = menu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(aperto));
  menuBtn.setAttribute("aria-label", aperto ? "Chiudi il menu" : "Apri il menu");
});
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", chiudiMenu));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") chiudiMenu(); });

// Comparsa degli elementi durante lo scroll
const osservatore = new IntersectionObserver((voci) => {
  voci.forEach((v) => {
    if (v.isIntersecting) {
      v.target.classList.add("visible");
      osservatore.unobserve(v.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => osservatore.observe(el));

// Modulo contatti: invia il messaggio alla tua email tramite FormSubmit.
// Il PRIMO messaggio ti arriva come email di attivazione da FormSubmit: clicca "Activate" e da lì in poi funziona.
// Se l'invio fallisce, apre il programma di posta di chi scrive, già compilato.
const form = document.getElementById("contact-form");
const stato = document.getElementById("form-status");

function apriPosta(d) {
  const oggetto = encodeURIComponent(`Messaggio dal sito da ${d.get("nome")}`);
  const corpo = encodeURIComponent(`${d.get("messaggio")}\n\n${d.get("nome")} (${d.get("email")})`);
  window.location.href = `mailto:${EMAIL}?subject=${oggetto}&body=${corpo}`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const d = new FormData(form);
  if (d.get("_honey")) return; // un bot ha compilato il campo nascosto

  const pulsante = form.querySelector("button[type=submit]");
  pulsante.disabled = true;
  stato.className = "form-status";
  stato.textContent = "Invio in corso…";

  try {
    const risposta = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        nome: d.get("nome"),
        email: d.get("email"),
        messaggio: d.get("messaggio"),
        _subject: `Nuovo messaggio dal sito da ${d.get("nome")}`,
        _replyto: d.get("email"),
        _template: "table",
      }),
    });
    const dati = await risposta.json();
    if (!risposta.ok || String(dati.success) !== "true") throw new Error(dati.message);
    stato.className = "form-status ok";
    stato.textContent = "Messaggio inviato! Ti risponderò il prima possibile.";
    form.reset();
  } catch (err) {
    stato.className = "form-status err";
    stato.textContent = "Invio non riuscito: ti apro il programma di posta.";
    apriPosta(d);
  } finally {
    pulsante.disabled = false;
  }
});

// Pulsante Discord: copia il nome utente
document.querySelectorAll("[data-copy]").forEach((btn) => {
  const suggerimento = btn.querySelector(".copy-hint");
  const testoBase = suggerimento.textContent;
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      suggerimento.textContent = "Copiato! Cercalo su Discord";
    } catch (err) {
      suggerimento.textContent = "Nome utente: " + btn.dataset.copy;
    }
    setTimeout(() => (suggerimento.textContent = testoBase), 2500);
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
