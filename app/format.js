// Format angka dan tanggal untuk situs: Rupiah tanpa desimal, tanggal Indonesia.
export function rupiah(amount) {
  const n = Math.round(Number(amount) || 0);
  return "Rp" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function rupiahShort(amount) {
  const n = Number(amount) || 0;
  if (Math.abs(n) >= 1000000) return "Rp" + (n / 1000000).toFixed(1).replace(".", ",") + " jt";
  if (Math.abs(n) >= 1000) return "Rp" + Math.round(n / 1000) + " rb";
  return rupiah(n);
}

export function percent(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

export function tanggalIndo(iso) {
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const parts = String(iso).split("-");
  if (parts.length !== 3) return String(iso);
  return Number(parts[2]) + " " + months[Number(parts[1]) - 1] + " " + parts[0];
}

export function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}
