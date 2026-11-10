/* =====================================================================
   SITE CONTENT — THIS IS THE ONLY FILE YOU NEED TO EDIT
   ---------------------------------------------------------------------
   How to add things:
   • A new project  → copy one { ... } block inside PROJECTS, paste it
                      below the last one, put a comma between blocks.
   • A new map      → add a block to MAPS (image file OR web map link).
   • New code       → add a block to CODE. Paste your code between the
                      two backticks ` ` . (If your code itself contains
                      a backtick, write it as \` )
   • Images         → upload them into the "images" folder on GitHub,
                      then write the file name, e.g. "images/drought.jpg"
   Leave a field as "" if you don't have it yet — the site hides it.
   ===================================================================== */

const SITE = {
  name: "Emmanuel Boateng",
  initials: "EB",
  role: "Geospatial & Environmental Researcher",
  tagline: "Mapping Ghana's changing land, water and air from space.",
  intro:
    "Geospatial and environmental researcher in Ghana. I combine satellite remote sensing, GIS and machine learning to monitor drought, urban heat, groundwater and air quality across Ghana and West Africa.",
  location: "Ghana, West Africa",
  coords: "7.95° N · 1.02° W",
  photo: "",            // e.g. "images/me.jpg"  (leave "" to show initials)
  cv: "",               // e.g. "cv.pdf" after you upload your CV

  aboutTitle: "Turning satellite data into evidence for Ghana",
  about: [
    "I am a geospatial and environmental researcher based in Ghana, currently pursuing an MPhil in Geography at the University of Education, Winneba (UEW). My work uses satellite remote sensing, geographic information systems (GIS) and machine learning to measure how land, water and air are changing across Ghana and West Africa, and what these changes mean for communities and the environment.",
    "I hold a BA in Geography Education (First Class Honours) from UEW, where my thesis mapped land use/cover change and urban expansion in Ashaiman Municipality. I serve as a volunteer researcher in the Geospatial and Environmental Lab Unit of the Department of Geography, and I support students and researchers with GIS and statistical analysis.",
    "My long-term goal is to become a university lecturer and pass this knowledge on to the next generation of geographers."
  ],
  facts: [
    { label: "Now",      value: "MPhil Geography, UEW" },
    { label: "Lab",      value: "Geospatial & Environmental Lab Unit" },
    { label: "Focus",    value: "Remote sensing · GIS · ML · GeoAI" },
    { label: "Based in", value: "Ghana, West Africa" }
  ],

  /* Paste your links between the quotes. Empty ones are hidden.
     GitHub is filled in automatically once the site is live.     */
  contact: {
    email: "fjcomputers71@gmail.com",
    linkedin: "",       // e.g. "https://www.linkedin.com/in/your-name"
    github: "",         // leave "" to use your github.io username automatically
    orcid: "",          // e.g. "https://orcid.org/0000-0000-0000-0000"
    scholar: "",        // Google Scholar profile link
    researchgate: "",   // ResearchGate profile link
    whatsapp: ""        // e.g. "https://wa.me/233XXXXXXXXX"
  }
};

/* Background imagery behind the headline. They fade from one to the next.
   type: "satellite" (Esri World Imagery) or "terrain" (colour-shaded relief, OpenTopoMap)
   center: [latitude, longitude]   zoom: bigger number = closer            */
const HERO_VIEWS = [
  { type: "satellite", place: "Winneba coast & Muni Lagoon, Central Region", center: [5.355, -0.645], zoom: 13 },
  { type: "terrain",   place: "Akwapim–Togo Range & Lake Volta",            center: [6.45, 0.05],   zoom: 9 },
  { type: "satellite", place: "Lake Volta & the Afram Plains",               center: [7.05, -0.25],  zoom: 9 },
  { type: "terrain",   place: "Gambaga Escarpment, North East Region",       center: [10.45, -0.45], zoom: 9 }
];

/* Research interests (shown under the profile). Add or remove freely. */
const INTERESTS = [
  { title: "Drought & climate variability", text: "Vegetation, soil moisture and rainfall indices for monitoring drought and rainfall change." },
  { title: "Urban heat & urbanisation",     text: "Built-up expansion, land surface temperature and urban stressors on vegetation." },
  { title: "Air quality from space",        text: "Sentinel-5P pollutant patterns, their sources and their links to cities." },
  { title: "Groundwater & water resources", text: "Groundwater potential mapping and basin-scale hydrological analysis." },
  { title: "Land use / land cover change",  text: "Classification and change detection of land cover, forests and settlements." },
  { title: "GeoAI & machine learning",      text: "Random Forest and other models that turn Earth observation into predictions." },
  { title: "Environmental health",          text: "Spatial patterns of disease and access to health services." }
];

const SKILLS = [
  { group: "Remote sensing", items: ["Landsat 5–9", "Sentinel-1 / 2", "Sentinel-5P TROPOMI", "MODIS", "CHIRPS", "SRTM DEM"] },
  { group: "GIS & mapping",  items: ["ArcGIS Pro", "QGIS", "Google Earth Engine", "Pix4Dmapper (drone)", "Cartography"] },
  { group: "Code",           items: ["GEE JavaScript", "R / RStudio", "Python (Google Colab)"] },
  { group: "Analysis & GeoAI", items: ["Random Forest", "Machine learning", "Change detection", "Mann-Kendall & Sen's slope", "AHP / MIF", "PLS-SEM (SmartPLS)", "SPSS · AMOS"] }
];

/* category must be one of the FILTERS words (used by the filter buttons) */
const FILTERS = ["All", "Climate & water", "Urban", "Air quality", "Land cover"];

const PROJECTS = [
  {
    title: "Drought severity in the White Volta Basin",
    place: "White Volta Basin, Ghana · Burkina Faso · Togo",
    year: "2015–2025",
    category: "Climate & water",
    status: "Submitted",
    image: "",   // e.g. "images/white-volta-vhi.jpg"
    summary:
      "Multi-index drought assessment (VCI, TCI, VHI, SPI, soil moisture) built in Google Earth Engine, a Random Forest model of drought classes, a composite drought index and a hazard–exposure analysis of people and cropland at risk.",
    tools: ["Google Earth Engine", "Landsat 8/9", "CHIRPS", "Random Forest", "Python"],
    lat: 10.6, lng: -0.9,
    links: { map: "", code: "", paper: "" }
  },
  {
    title: "Urban growth and land surface temperature in Sunyani",
    place: "Sunyani Municipality, Bono Region",
    year: "",
    category: "Urban",
    status: "Manuscript complete",
    image: "",
    summary:
      "How built-up expansion has changed surface temperature across Sunyani, using multi-date Landsat land cover classification and LST retrieval.",
    tools: ["Landsat", "LST retrieval", "Land cover classification", "ArcGIS Pro"],
    lat: 7.34, lng: -2.33,
    links: { map: "", code: "", paper: "" }
  },
  {
    title: "Atmospheric pollutant concentrations across Ghana",
    place: "Ghana (national)",
    year: "",
    category: "Air quality",
    status: "Manuscript complete",
    image: "",
    summary:
      "Spatial and temporal patterns of satellite-observed atmospheric pollutants over Ghana from Sentinel-5P TROPOMI, processed in Google Earth Engine.",
    tools: ["Sentinel-5P TROPOMI", "Google Earth Engine", "R"],
    lat: 6.2, lng: -1.2,
    links: { map: "", code: "", paper: "" }
  },
  {
    title: "Groundwater potential zones of the Northern Belt",
    place: "Northern Belt, Ghana",
    year: "",
    category: "Climate & water",
    status: "Manuscript complete",
    image: "",
    summary:
      "Groundwater potential mapping that combines geology, lineaments, slope, drainage, rainfall and land cover through the Multi-Influencing Factor (MIF) and Analytic Hierarchy Process (AHP) methods.",
    tools: ["MIF", "AHP", "SRTM DEM", "ArcGIS Pro"],
    lat: 9.4, lng: -1.4,
    links: { map: "", code: "", paper: "" }
  },
  {
    title: "Has Ghana's rainfall regime changed?",
    place: "Ghana (national)",
    year: "1981–2025",
    category: "Climate & water",
    status: "In progress",
    image: "",
    summary:
      "Four and a half decades of CHIRPS rainfall analysed for trends and shifts in totals, onset and seasonality across Ghana's climatic zones.",
    tools: ["CHIRPS", "Trend analysis", "R"],
    lat: 7.9, lng: -0.6,
    links: { map: "", code: "", paper: "" }
  },
  {
    title: "Air pollution in Ghana from Sentinel-5P and machine learning",
    place: "Ghana",
    year: "",
    category: "Air quality",
    status: "MPhil thesis · ongoing",
    image: "",
    summary:
      "My MPhil research: linking satellite-observed pollution to its sources and receptors across Ghanaian cities using Sentinel-5P and machine learning.",
    tools: ["Sentinel-5P", "Machine learning", "Google Earth Engine"],
    lat: 5.6, lng: -0.2,
    links: { map: "", code: "", paper: "" }
  },
  {
    title: "Land use/cover change and urban expansion in Ashaiman",
    place: "Ashaiman Municipal, Greater Accra",
    year: "2024",
    category: "Land cover",
    status: "BA thesis · completed",
    image: "",
    summary:
      "Undergraduate thesis mapping land use/cover change and the growth of built-up land in Ashaiman with remote sensing and GIS.",
    tools: ["Landsat", "Supervised classification", "Accuracy assessment", "ArcGIS"],
    lat: 5.69, lng: -0.03,
    links: { map: "", code: "", paper: "" }
  }
];

/* MAPS: use "image" for a map picture (JPG/PNG exported from ArcGIS/QGIS)
         or "embed" for an interactive map link (Earth Engine App,
         ArcGIS Online, QGIS2Web page). Use one, leave the other "".     */
const MAPS = [
  {
    title: "Study areas",
    caption: "Locations of my projects. Click a pin for details.",
    image: "",
    embed: "STUDY_AREA_MAP"   // keep this one: it draws the built-in map below
  },
  {
    title: "Your next map goes here",
    caption: "Export a map from ArcGIS Pro (Share → Export Layout → PNG, 200 dpi), upload it to the images folder and write its name in the image field.",
    image: "",
    embed: ""
  }
];

const CODE = [
  {
    title: "Cloud-free Landsat 9 NDVI composite for Ghana",
    lang: "javascript",   // javascript · python · r
    label: "Google Earth Engine",
    note: "Median dry-season composite with cloud masking from the QA_PIXEL band.",
    code: `// Ghana boundary from FAO GAUL
var ghana = ee.FeatureCollection('FAO/GAUL/2015/level0')
  .filter(ee.Filter.eq('ADM0_NAME', 'Ghana'));

// Mask clouds and cloud shadow, apply scale factors
function prep(img) {
  var qa = img.select('QA_PIXEL');
  var mask = qa.bitwiseAnd(1 << 3).eq(0)       // cloud
            .and(qa.bitwiseAnd(1 << 4).eq(0)); // shadow
  var sr = img.select('SR_B.').multiply(0.0000275).add(-0.2);
  return img.addBands(sr, null, true).updateMask(mask);
}

var l9 = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
  .filterBounds(ghana)
  .filterDate('2025-11-01', '2026-03-31')
  .map(prep)
  .median()
  .clip(ghana);

var ndvi = l9.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');

Map.centerObject(ghana, 7);
Map.addLayer(ndvi, {min: 0, max: 0.8,
  palette: ['#a5642a', '#f4e3a1', '#7fbf5f', '#1b6b35']}, 'NDVI');`
  },
  {
    title: "Mann-Kendall trend and Sen's slope",
    lang: "r",
    label: "R",
    note: "Trend test for an annual time series (e.g. rainfall or LST).",
    code: `library(trend)

# annual values, one per year
rain <- read.csv("annual_rainfall.csv")   # columns: year, total_mm
x <- ts(rain$total_mm, start = min(rain$year))

mk  <- mk.test(x)     # Mann-Kendall test
sen <- sens.slope(x)  # Sen's slope (mm per year)

cat("Kendall's tau:", round(mk$estimates["tau"], 3), "\\n")
cat("p-value:      ", signif(mk$p.value, 3), "\\n")
cat("Sen's slope:  ", round(sen$estimates, 2), "mm/yr\\n")`
  },
  {
    title: "Aggregate 100 m population to a 1 km grid",
    lang: "python",
    label: "Python",
    note: "Sums WorldPop counts into coarser cells so the total population is conserved.",
    code: `import rasterio
from rasterio.enums import Resampling

with rasterio.open("worldpop_100m.tif") as src:
    factor = 10  # 100 m -> 1 km
    data = src.read(
        1,
        out_shape=(src.height // factor, src.width // factor),
        resampling=Resampling.sum,
    )
    transform = src.transform * src.transform.scale(factor, factor)
    profile = src.profile | {"height": data.shape[0],
                             "width": data.shape[1],
                             "transform": transform}

with rasterio.open("worldpop_1km.tif", "w", **profile) as dst:
    dst.write(data, 1)

print("Total population:", round(float(data[data > 0].sum())))`
  }
];

/* Publications, conference talks, posters. Add "link" when available. */
const OUTPUTS = [
  { year: "2026", type: "Manuscript", title: "Drought severity in the White Volta Basin from multi-index remote sensing and Random Forest", venue: "Submitted to Scientific African", link: "" },
  { year: "2026", type: "Manuscript", title: "Urban growth and land surface temperature dynamics in Sunyani Municipality, Ghana", venue: "In preparation for submission", link: "" },
  { year: "2026", type: "Manuscript", title: "Atmospheric pollutant concentrations across Ghana from Sentinel-5P TROPOMI", venue: "In preparation for submission", link: "" },
  { year: "2026", type: "Manuscript", title: "Groundwater potential zones of Ghana's Northern Belt using MIF and AHP", venue: "In preparation for submission", link: "" },
  { year: "2024", type: "Thesis",     title: "Land use/cover change and urban expansion in Ashaiman Municipal", venue: "BA thesis, University of Education, Winneba", link: "" }
];
