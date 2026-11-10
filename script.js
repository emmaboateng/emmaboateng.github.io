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

/* ---------- Hero background: satellite imagery + colour-shaded terrain ---------- */
(function heroImagery() {
  if (!window.L || typeof HERO_VIEWS === "undefined" || !HERO_VIEWS.length) return;
  const SOURCES = {
    satellite: {
      label: "Satellite imagery",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      credit: "Imagery © Esri, Maxar, Earthstar Geographics", sub: ""
    },
    terrain: {
      label: "Colour-shaded terrain (SRTM)",
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      credit: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>, SRTM · <a href="https://opentopomap.org" target="_blank" rel="noopener">OpenTopoMap</a> (CC-BY-SA)', sub: "abc"
    }
  };
  const bg = $("#heroBg"), credit = $("#heroCredit");
  const layers = HERO_VIEWS.map(v => {
    const div = document.createElement("div");
    div.className = "hero-layer";
    bg.appendChild(div);
    const src = SOURCES[v.type] || SOURCES.satellite;
    const map = L.map(div, {
      zoomControl: false, attributionControl: false, dragging: false, scrollWheelZoom: false,
      doubleClickZoom: false, boxZoom: false, keyboard: false, touchZoom: false, zoomSnap: 0
    }).setView(v.center, v.zoom);
    L.tileLayer(src.url, { maxZoom: 17, subdomains: src.sub || "abc" }).addTo(map);
    return { div, map, v, src };
  });
  let i = 0;
  function show(n) {
    layers.forEach((l, j) => l.div.classList.toggle("on", j === n));
    const l = layers[n];
    l.map.invalidateSize();
    credit.innerHTML = `<b>${esc(l.src.label)}</b> · ${esc(l.v.place)}<br>${l.src.credit}`;
  }
  show(0);
  const still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!still && layers.length > 1) setInterval(() => { if (!document.hidden) show(i = (i + 1) % layers.length); }, 8000);
  window.addEventListener("resize", () => layers.forEach(l => l.map.invalidateSize()));
})();

/* ---------- About ---------- */
$("#aboutPhoto").innerHTML = SITE.photo ? `<img src="${esc(SITE.photo)}" alt="${esc(SITE.name)}">` : esc(SITE.initials);
$("#aboutText").innerHTML = SITE.about.map(p => `<p>${esc(p)}</p>`).join("");
$("#facts").innerHTML = SITE.facts.map(f => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join("");
if (typeof INTERESTS !== "undefined") $("#interests").innerHTML = INTERESTS.map(r => `
  <div class="interest"><h4>${esc(r.title)}</h4><p>${esc(r.text)}</p></div>`).join("");
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
const ICONS = {
  email: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1 2.4V17h16V7.4l-8 5.3-8-5.3zM5.2 7 12 11.5 18.8 7H5.2z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75V21h-4z"/></svg>',
  github: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>',
  orcid: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/><text x="12" y="16" text-anchor="middle" font-size="10" font-family="Arial" font-weight="700" fill="#0e5a52">iD</text></svg>',
  scholar: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3 1 9l11 6 9-4.9V17h2V9L12 3zm-6.5 9.6V16c0 1.9 3 3.5 6.5 3.5s6.5-1.6 6.5-3.5v-3.4L12 16.2l-6.5-3.6z"/></svg>',
  researchgate: '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor"/><text x="12" y="16" text-anchor="middle" font-size="9.5" font-family="Arial" font-weight="700" fill="#0e5a52">RG</text></svg>',
  whatsapp: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.25-.12-1.47-.72-1.7-.8-.23-.09-.4-.13-.56.12-.17.25-.64.8-.79.97-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-3.3-2.9c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.43l-.76-1.83c-.2-.48-.4-.41-.56-.42h-.48a.92.92 0 0 0-.66.31 2.8 2.8 0 0 0-.87 2.07c0 1.22.89 2.4 1.01 2.57.12.16 1.75 2.67 4.24 3.75 1.58.68 2.2.74 2.99.62.48-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.23-.16-.48-.28z"/></svg>'
};
const C = Object.assign({}, SITE.contact);
// Fill the GitHub link automatically from the site address (username.github.io)
if (!C.github && /\.github\.io$/i.test(location.hostname)) C.github = "https://github.com/" + location.hostname.split(".")[0];
const contactItems = [
  ["email", "Gmail", v => "mailto:" + v],
  ["linkedin", "LinkedIn"], ["github", "GitHub"], ["orcid", "ORCID"],
  ["scholar", "Google Scholar"], ["researchgate", "ResearchGate"], ["whatsapp", "WhatsApp"]
];
$("#contactLinks").innerHTML = contactItems.filter(([k]) => C[k]).map(([k, label, fmt]) => {
  const href = fmt ? fmt(C[k]) : C[k];
  const text = k === "email" ? C[k] : label;
  const ext = k === "email" ? "" : ' target="_blank" rel="noopener"';
  return `<a href="${esc(href)}"${ext} aria-label="${esc(label)}">${ICONS[k]}<span>${esc(text)}</span></a>`;
}).join("");
