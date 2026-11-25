// Kalkulator budget: aturan 50/30/20 dan hitung sisa uang bulanan.
import { rupiah } from "./format.js";

export function split503020(income) {
  return [
    { label: "Kebutuhan (50%)", amount: Math.round(income * 0.5), hint: "Dapur, tagihan, transport, sekolah" },
    { label: "Keinginan (30%)", amount: Math.round(income * 0.3), hint: "Hiburan, jajan, nonton, makan di luar" },
    { label: "Tabungan & utang (20%)", amount: Math.round(income * 0.2), hint: "Dana darurat, target, cicilan" },
  ];
}

export function remainingMoney(income, spent) {
  return income - spent;
}

export function dailyAllowance(remaining, daysLeft) {
  if (daysLeft <= 0) return remaining;
  return Math.floor(remaining / daysLeft);
}

export function calculatorHtml(income) {
  const parts = split503020(income);
  return `<div class="calc-grid">${parts.map((p) => `
    <div class="calc-card">
      <h3>${p.label}</h3>
      <p class="calc-amount">${rupiah(p.amount)}</p>
      <p class="muted">${p.hint}</p>
    </div>`).join("")}
  </div>`;
}
