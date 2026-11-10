/* Builds the page from data.js. You normally don't need to edit this file. */

const $ = (s, el = document) => el.querySelector(s);
const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- Theme (light / dark) ---------- */
(function theme() {
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  const prefersDark = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = saved || (prefersDark ? "dark" : "light");
  $("#themeBtn").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
})();

/* ---------- Mobile menu ---------- */
$("#menuBtn").addEventListener("click", () => $("#navLinks").classList.toggle("open"));
document.querySelectorAll("#navLinks a").forEach(a => a.addEventListener("click", () => $("#navLinks").classList.remove("open")));

/* ---------- Basic text ---------- */
document.querySelectorAll("[data-site]").forEach(el => {
  const v = SITE[el.dataset.site];
  if (v) el.textContent = v;
});
document.title = `${SITE.name} · Geospatial Portfolio`;
$("#year").textContent = new Date().getFullYear();
if (SITE.cv) { const b = $("#cvBtn"); b.href = SITE.cv; b.hidden = false; b.setAttribute("download", ""); }

$("#heroStats").innerHTML = [
  [PROJECTS.length, "Research projects"],
  [OUTPUTS.length, "Papers & theses"],
  [CODE.length, "Shared scripts"]
].map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`).join("");

/* ---------- About ---------- */
$("#aboutPhoto").innerHTML = SITE.photo ? `<img src="${esc(SITE.photo)}" alt="${esc(SITE.name)}">` : esc(SITE.initials);
$("#aboutText").innerHTML = SITE.about.map(p => `<p>${esc(p)}</p>`).join("");
$("#facts").innerHTML = SITE.facts.map(f => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join("");
$("#skills").innerHTML = SKILLS.map(s => `
  <div class="skill-card"><h3>${esc(s.group)}</h3>
    <div class="chips">${s.items.map(i => `<span class="chip">${esc(i)}</span>`).join("")}</div>
  </div>`).join("");

/* ---------- Placeholder "map" art for projects without an image ---------- */
const PALETTES = {
  "Climate & water": ["#8c3b1f", "#c2622d", "#e0a93b", "#f2dc9a", "#9cc7a4", "#3f8f6e"],
  "Urban":           ["#2c3e50", "#4b6a7a", "#9fb7b9", "#f2c46d", "#e98b56", "#c2392d"],
  "Air quality":     ["#20304a", "#2f5f8a", "#5ea3c6", "#b7dde0", "#f2d38a", "#d9763a"],
  "Land cover":      ["#1b6b35", "#5c9c4a", "#a9cf7a", "#e9dfa8", "#c99a62", "#a24d3c"]
};
function seeded(str) {
  let h = 2166136261;
  for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507), h ^= h >>> 13, (h >>> 0) / 4294967296));
}
function rasterArt(p) {
  const pal = PALETTES[p.category] || PALETTES["Land cover"];
  const rnd = seeded(p.title);
  const cols = 32, rows = 18, cx = rnd() * cols, cy = rnd() * rows, f = 0.18 + rnd() * 0.2;
  let cells = "";
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const d = Math.hypot((x - cx) * 0.9, y - cy);
    const v = (Math.sin(x * f + rnd() * 0.6) + Math.cos(y * f * 1.3) + d * 0.12 + rnd() * 0.5);
    const i = Math.max(0, Math.min(pal.length - 1, Math.floor((v + 1.5) / 4.6 * pal.length)));
    cells += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${pal[i]}"/>`;
  }
  return `<svg viewBox="0 0 ${cols} ${rows}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${cells}
    <g fill="none" stroke="#fff" stroke-opacity=".55" stroke-width=".12">
      <ellipse cx="${cx}" cy="${cy}" rx="4" ry="2.6"/><ellipse cx="${cx}" cy="${cy}" rx="7.5" ry="5"/><ellipse cx="${cx}" cy="${cy}" rx="11" ry="7.5"/>
    </g></svg>`;
}

/* ---------- Projects ---------- */
function linkHTML(links = {}) {
  const out = [];
  if (links.map) out.push(`<a href="${esc(links.map)}" target="_blank" rel="noopener">View map →</a>`);
  if (links.code) out.push(`<a href="${esc(links.code)}" target="_blank" rel="noopener">Code →</a>`);
  if (links.paper) out.push(`<a href="${esc(links.paper)}" target="_blank" rel="noopener">Paper →</a>`);
  return out.join("");
}
function renderProjects(filter = "All") {
  const list = PROJECTS.filter(p => filter === "All" || p.category === filter);
  $("#projectGrid").innerHTML = list.map(p => `
    <article class="card">
      <div class="card-media">
        ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">` : rasterArt(p)}
        ${p.status ? `<span class="status">${esc(p.status)}</span>` : ""}
      </div>
      <div class="card-body">
        <div class="card-meta">${esc(p.place)}${p.year ? " · " + esc(p.year) : ""}</div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.summary)}</p>
        <div class="chips">${(p.tools || []).map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>
        <div class="card-links">${linkHTML(p.links)}</div>
      </div>
    </article>`).join("") || `<p class="section-sub">No projects in this category yet.</p>`;
}
$("#filters").innerHTML = FILTERS.map((f, i) => `<button class="filter-btn${i === 0 ? " active" : ""}" data-f="${esc(f)}">${esc(f)}</button>`).join("");
$("#filters").addEventListener("click", e => {
  const b = e.target.closest(".filter-btn"); if (!b) return;
  document.querySelectorAll(".filter-btn").forEach(x => x.classList.toggle("active", x === b));
  renderProjects(b.dataset.f);
});
renderProjects();

/* ---------- Maps ---------- */
$("#mapList").innerHTML = MAPS.map((m, i) => {
  let frame;
  if (m.embed === "STUDY_AREA_MAP") frame = `<div class="map-frame" id="studyMap"></div>`;
  else if (m.embed) frame = `<div class="map-frame"><iframe src="${esc(m.embed)}" loading="lazy" title="${esc(m.title)}" allowfullscreen></iframe></div>`;
  else if (m.image) frame = `<div class="map-frame"><a href="${esc(m.image)}" target="_blank" rel="noopener"><img src="${esc(m.image)}" alt="${esc(m.title)}" loading="lazy"></a></div>`;
  else frame = `<div class="map-frame placeholder">Add an "image" or "embed" link for this map in data.js</div>`;
  return `<figure class="map-item" style="margin:0">${frame}
    <figcaption class="map-caption"><h3>${esc(m.title)}</h3><p>${esc(m.caption)}</p></figcaption></figure>`;
}).join("");

if (document.getElementById("studyMap") && window.L) {
  const map = L.map("studyMap", { scrollWheelZoom: false }).fitBounds([[4.6, -3.4], [11.3, 1.3]]);
  const light = L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
  }).addTo(map);
  const sat = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 18, attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics"
  });
  const icon = L.divIcon({ className: "", html: '<div class="pin"></div>', iconSize: [16, 16], iconAnchor: [8, 8] });
  PROJECTS.filter(p => p.lat && p.lng).forEach(p =>
    L.marker([p.lat, p.lng], { icon }).addTo(map)
      .bindPopup(`<b>${esc(p.title)}</b><br><span style="color:#5d6763">${esc(p.place)}</span>`)
  );
  // Basemap switch button
  const Toggle = L.Control.extend({
    onAdd() {
      const b = L.DomUtil.create("button", "layer-toggle"); b.textContent = "Satellite";
      L.DomEvent.disableClickPropagation(b);
      b.onclick = () => {
        if (map.hasLayer(light)) { map.removeLayer(light); sat.addTo(map); b.textContent = "Street map"; }
        else { map.removeLayer(sat); light.addTo(map); b.textContent = "Satellite"; }
      };
      return b;
    }
  });
  new Toggle({ position: "topright" }).addTo(map);
  map.on("click", () => map.scrollWheelZoom.enable());
}

/* ---------- Code ---------- */
function showCode(i) {
  const c = CODE[i];
  document.querySelectorAll(".code-tab").forEach((t, j) => t.classList.toggle("active", i === j));
  $("#codePanel").innerHTML = `
    <div class="code-box">
      <div class="code-bar"><span class="lights"><i></i><i></i><i></i></span><span>${esc(c.label)}</span>
        <button class="copy-btn" id="copyBtn">Copy</button></div>
      <pre class="language-${esc(c.lang)}"><code class="language-${esc(c.lang)}">${esc(c.code)}</code></pre>
    </div>
    ${c.note ? `<p class="code-note">${esc(c.note)}</p>` : ""}`;
  if (window.Prism) Prism.highlightAllUnder($("#codePanel"));
  $("#copyBtn").onclick = async () => {
    try { await navigator.clipboard.writeText(c.code); $("#copyBtn").textContent = "Copied ✓"; }
    catch (e) { $("#copyBtn").textContent = "Select & copy"; }
    setTimeout(() => { const b = $("#copyBtn"); if (b) b.textContent = "Copy"; }, 1800);
  };
}
$("#codeTabs").innerHTML = CODE.map((c, i) => `<button class="code-tab" role="tab" data-i="${i}"><small>${esc(c.label)}</small>${esc(c.title)}</button>`).join("");
$("#codeTabs").addEventListener("click", e => { const t = e.target.closest(".code-tab"); if (t) showCode(+t.dataset.i); });
if (CODE.length) showCode(0);

/* ---------- Publications ---------- */
$("#outputList").innerHTML = OUTPUTS.map(o => `
  <li><span class="out-year">${esc(o.year)}</span><span class="out-type">${esc(o.type)}</span>
    <span class="out-title">${o.link ? `<a href="${esc(o.link)}" target="_blank" rel="noopener">${esc(o.title)}</a>` : esc(o.title)}
      <span class="out-venue">${esc(o.venue)}</span></span></li>`).join("");

/* ---------- Contact ---------- */
const C = SITE.contact, links = [];
if (C.email) links.push(`<a href="mailto:${esc(C.email)}">✉ ${esc(C.email)}</a>`);
[["linkedin", "LinkedIn"], ["github", "GitHub"], ["orcid", "ORCID"], ["scholar", "Google Scholar"], ["researchgate", "ResearchGate"]]
  .forEach(([k, label]) => { if (C[k]) links.push(`<a href="${esc(C[k])}" target="_blank" rel="noopener">${label} ↗</a>`); });
$("#contactLinks").innerHTML = links.join("") || `<span class="contact-empty">Add your email and profile links in data.js → SITE.contact</span>`;
