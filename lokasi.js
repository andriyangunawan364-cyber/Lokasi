const ADDRESS = "Minda Cell, Jl. B Terusan No.16 3, RT.5/RW.11, Rawabadak Utara, Kec. Koja, Jkt Utara, Daerah Khusus Ibukota Jakarta 14230, Indonesia";

const $ = (id) => document.getElementById(id);

function googleMapsUrl() {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(ADDRESS);
}
function osmUrl() {
  return "https://www.openstreetmap.org/search?query=" + encodeURIComponent(ADDRESS);
}

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

async function copyAddress() {
  try {
    await navigator.clipboard.writeText(ADDRESS);
    toast("Alamat berhasil disalin.");
  } catch {
    const ta = document.createElement("textarea");
    ta.value = ADDRESS;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    toast("Alamat berhasil disalin.");
  }
}

async function shareLocation() {
  const url = googleMapsUrl();
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Minda Cell • Rental PS & Bioskop Mini",
        text: ADDRESS,
        url
      });
      return;
    } catch (e) {
      if (e?.name === "AbortError") return;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    toast("Link Google Maps berhasil disalin.");
  } catch {
    window.open(url, "_blank", "noopener");
  }
}

function setupLinks() {
  const maps = googleMapsUrl();
  const osm = osmUrl();
  ["routeLink","mapsLink","helpRoute"].forEach(id => {
    const el = $(id);
    if (el) el.href = maps;
  });
  $("osmSearch").href = osm;
  $("osmBtn").onclick = () => window.open(osm, "_blank", "noopener");
}

function setupTheme() {
  const saved = localStorage.getItem("minda-theme");
  if (saved === "light") document.body.classList.add("light");
  updateThemeIcon();

  $("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("minda-theme", document.body.classList.contains("light") ? "light" : "dark");
    updateThemeIcon();
  });
}
function updateThemeIcon() {
  $("themeToggle").textContent = document.body.classList.contains("light") ? "🌙" : "☀️";
}

document.addEventListener("DOMContentLoaded", () => {
  setupLinks();
  setupTheme();
  $("year").textContent = new Date().getFullYear();

  $("copyAddress").addEventListener("click", copyAddress);
  $("copyBtn2").addEventListener("click", copyAddress);
  $("shareBtn").addEventListener("click", shareLocation);
  $("helpShare").addEventListener("click", shareLocation);
});
