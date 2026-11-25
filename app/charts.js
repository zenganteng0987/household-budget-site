// Grafik kecil tanpa library: donat alokasi (SVG) dan batang progres (HTML/CSS).
import { percent, rupiahShort } from "./format.js";

export function donutChart(slices, size) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;
  let offset = 0;
  const rings = slices.map((s) => {
    const frac = s.value / total;
    const dash = frac * circ;
    const gap = circ - dash;
    const ring = `<circle cx="100" cy="100" r="${r}" fill="none" stroke="${s.color}" stroke-width="34" stroke-dasharray="${dash.toFixed(1)} ${gap.toFixed(1)}" stroke-dashoffset="${(-offset).toFixed(1)}" />`;
    offset += dash;
    return ring;
  }).join("");
  const center = `<text x="100" y="96" text-anchor="middle" class="donut-num">${rupiahShort(total)}</text><text x="100" y="118" text-anchor="middle" class="donut-cap">terpakai bulan ini</text>`;
  return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" role="img" aria-label="Grafik donat alokasi pengeluaran">${rings}${center}</svg>`;
}

export function progressBar(value, max, color) {
  const pct = Math.min(100, Math.round((value / (max || 1)) * 100));
  const over = value > max;
  return `<div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
    <span class="bar-fill${over ? " over" : ""}" style="width:${pct}%;background:${color}"></span>
  </div>`;
}

export function legend(slices) {
  return `<ul class="legend">${slices.map((s) => `<li><span class="dot" style="background:${s.color}"></span>${s.label}<b>${percent(s.value, slices.reduce((a, x) => a + x.value, 0))}%</b></li>`).join("")}</ul>`;
}
