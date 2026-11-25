// DompetKeluarga — router hash, render halaman, dan semua interaksi.
// Data contoh dari data.js; perubahan tersimpan di localStorage kunci "dompetkeluarga-v1".
import { HOUSEHOLD, CATEGORIES, SEED_EXPENSES, SEED_GOALS, TIPS, CHECKLIST } from "./data.js";
import { rupiah, rupiahShort, percent, tanggalIndo, escapeHtml } from "./format.js";
import { donutChart, progressBar, legend } from "./charts.js";
import { split503020, remainingMoney, dailyAllowance, calculatorHtml } from "./calculator.js";

const STORE_KEY = "dompetkeluarga-v1";
const view = document.getElementById("view");
const DAYS_LEFT = 5; // 25 Nov -> akhir bulan

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.expenses) && Array.isArray(parsed.goals)) return parsed;
    }
  } catch { /* abaikan: pakai data contoh */ }
  return { expenses: SEED_EXPENSES, goals: SEED_GOALS, budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget])) };
}

function saveState() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* penyimpanan penuh: tetap jalan */ }
}

let state = loadState();
let filterCategory = "semua";
let lastBudgetNotice = "";

function spentByCategory() {
  const spent = {};
  for (const c of CATEGORIES) spent[c.id] = 0;
  for (const e of state.expenses) if (spent[e.category] !== undefined) spent[e.category] += e.amount;
  return spent;
}

function totalSpent() {
  return state.expenses.reduce((sum, e) => sum + e.amount, 0);
}

function categoryOf(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

function setActiveNav(route) {
  document.querySelectorAll(".mainnav a").forEach((a) => {
    a.classList.toggle("active", a.dataset.route === route);
  });
}

function route() {
  const hash = location.hash.replace(/^#/, "") || "/";
  if (hash.startsWith("/anggaran")) return renderBudget();
  if (hash.startsWith("/pengeluaran")) return renderExpenses();
  if (hash.startsWith("/tabungan")) return renderGoals();
  if (hash.startsWith("/tips")) return renderTips();
  return renderHome();
}

function statCards() {
  const spent = totalSpent();
  const left = remainingMoney(HOUSEHOLD.income, spent);
  const perDay = dailyAllowance(left, DAYS_LEFT);
  return `<div class="stat-row">
    <div class="stat good"><span>Pemasukan bulan ini</span><b>${rupiah(HOUSEHOLD.income)}</b><span>${HOUSEHOLD.incomeSources.length} sumber</span></div>
    <div class="stat"><span>Sudah terpakai</span><b>${rupiah(spent)}</b><span>${state.expenses.length} pengeluaran tercatat</span></div>
    <div class="stat ${left < 0 ? "warn" : "good"}"><span>Sisa uang</span><b>${rupiah(left)}</b><span>${percent(left, HOUSEHOLD.income)}% dari gaji</span></div>
    <div class="stat"><span>Boleh dipakai per hari</span><b>${rupiah(perDay)}</b><span>sisa ${DAYS_LEFT} hari ke 30 Nov</span></div>
  </div>`;
}

function renderHome() {
  setActiveNav("/");
  const spent = spentByCategory();
  const slices = CATEGORIES.filter((c) => spent[c.id] > 0).map((c) => ({ label: c.label, value: spent[c.id], color: c.color }));
  const biggest = [...state.expenses].sort((a, b) => b.amount - a.amount).slice(0, 5);
  const goalsHtml = state.goals.slice(0, 2).map((g) => `
    <div class="goal">
      <div class="goal-head"><b>${escapeHtml(g.name)}</b><span>${rupiah(g.saved)} / ${rupiah(g.target)}</span></div>
      ${progressBar(g.saved, g.target, "#059669")}
      <p class="muted">${percent(g.saved, g.target)}% tercapai — ${escapeHtml(g.note)}</p>
    </div>`).join("");
  view.innerHTML = `
    <section class="hero">
      <h1>Uang keluarga bulan ${HOUSEHOLD.month}, terkendali.</h1>
      <p>${escapeHtml(HOUSEHOLD.name)} — ${escapeHtml(HOUSEHOLD.members)}, ${escapeHtml(HOUSEHOLD.city)}. Pemasukan Rp12,5 juta, anggaran 7 kategori, dan setiap rupiah tercatat. Mulai dari ringkasan di bawah, lalu atur anggarannya.</p>
      <div class="hero-figures">
        <div><b>${rupiah(HOUSEHOLD.income)}</b><span>pemasukan</span></div>
        <div><b>${rupiah(totalSpent())}</b><span>terpakai (${state.expenses.length} catatan)</span></div>
        <div><b>${rupiah(remainingMoney(HOUSEHOLD.income, totalSpent()))}</b><span>sisa uang</span></div>
      </div>
    </section>
    ${statCards()}
    <div class="grid two">
      <section class="card">
        <h2>Ke mana uang pergi?</h2>
        <div class="donut-wrap">${donutChart(slices, 210)}${legend(slices)}</div>
        <p class="muted">Belanja dapur masih yang terbesar (${rupiahShort(spent.dapur)}), diikuti tabungan wajib dan tagihan. <a href="#/anggaran">Lihat anggaran lengkap →</a></p>
      </section>
      <section class="card">
        <h2>Target tabungan terdekat</h2>
        ${goalsHtml}
        <p><a class="btn" href="#/tabungan">Kelola semua target →</a></p>
      </section>
    </div>
    <div class="grid two" style="margin-top:18px">
      <section class="card">
        <h2>Pengeluaran terbesar bulan ini</h2>
        <table><thead><tr><th>Tanggal</th><th>Untuk apa</th><th class="amount">Jumlah</th></tr></thead><tbody>
        ${biggest.map((e) => `<tr><td>${tanggalIndo(e.date)}</td><td>${escapeHtml(e.label)}<br><span class="muted">${categoryOf(e.category).label}</span></td><td class="amount">${rupiah(e.amount)}</td></tr>`).join("")}
        </tbody></table>
        <p style="margin-top:12px"><a href="#/pengeluaran">Semua ${state.expenses.length} pengeluaran →</a></p>
      </section>
      <section class="card">
        <h2>Kalkulator cepat 50 / 30 / 20</h2>
        <p>Dari pemasukan ${rupiah(HOUSEHOLD.income)}, pembagian sehatnya:</p>
        ${calculatorHtml(HOUSEHOLD.income)}
        <p class="muted" style="margin-top:10px">Keluarga ini menabung ${rupiah(state.budgets.tabungan)} (${percent(state.budgets.tabungan, HOUSEHOLD.income)}%) — di atas patokan 20% bila dihitung bersama dana darurat. <a href="#/anggaran">Hitung dengan gajimu →</a></p>
      </section>
    </div>`;
}

function renderBudget() {
  setActiveNav("/anggaran");
  const spent = spentByCategory();
  const rows = CATEGORIES.map((c) => {
    const used = spent[c.id];
    const budget = state.budgets[c.id];
    const diff = budget - used;
    return `<div class="budget-row">
      <span class="cat">${c.icon} ${c.label}</span>
      <div>${progressBar(used, budget, c.color)}
        <span class="muted">${rupiah(used)} dari ${rupiah(budget)} — ${percent(used, budget)}%</span></div>
      <span class="nums"><b class="${diff < 0 ? "over-txt" : "under-txt"}">${diff < 0 ? "Lewat " + rupiah(-diff) : "Sisa " + rupiah(diff)}</b>
      <span class="muted">batas bisa diubah</span></span>
    </div>`;
  }).join("");
  const totalBudget = CATEGORIES.reduce((s, c) => s + state.budgets[c.id], 0);
  view.innerHTML = `
    <h1>Anggaran Bulan ${HOUSEHOLD.month}</h1>
    <p class="muted">Total anggaran ${rupiah(totalBudget)} dari pemasukan ${rupiah(HOUSEHOLD.income)}. Ubah batas tiap kategori — angkanya langsung tersimpan dan grafik ikut berubah.</p>
    ${statCards()}
    <div class="grid two">
      <section class="card"><h2>Anggaran per kategori</h2>${rows}
        <p class="muted" style="margin-top:12px">Tip: kalau satu kategori jebol, pindahkan sisa dari kategori hiburan — jangan ambil dari tabungan.</p>
      </section>
      <section class="card">
        <h2>Ubah batas anggaran</h2>
        <form id="budget-form" class="add">
          <div><label for="budget-cat">Kategori</label>
          <select id="budget-cat">${CATEGORIES.map((c) => `<option value="${c.id}">${c.label} — sekarang ${rupiah(state.budgets[c.id])}</option>`).join("")}</select></div>
          <div><label for="budget-amount">Batas baru (Rp)</label>
          <input id="budget-amount" type="number" min="0" step="10000" value="1000000" required></div>
          <button type="submit">Simpan batas baru</button>
        </form>
        <p class="notice" id="budget-msg" ${lastBudgetNotice ? "" : "hidden"}>${escapeHtml(lastBudgetNotice || "Batas anggaran tersimpan.")}</p>
        <h2 style="margin-top:22px">Kalkulator 50 / 30 / 20</h2>
        <p>Masukkan gajimu, lihat pembagian sehatnya.</p>
        <form id="calc-form" class="add">
          <div><label for="calc-income">Pemasukan sebulan (Rp)</label>
          <input id="calc-income" type="number" min="0" step="100000" value="${HOUSEHOLD.income}" required></div>
          <button type="submit">Hitung pembagian</button>
        </form>
        <div id="calc-out">${calculatorHtml(HOUSEHOLD.income)}</div>
        <div class="calc-result" id="calc-left" hidden></div>
      </section>
    </div>`;
  document.getElementById("budget-form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const cat = document.getElementById("budget-cat").value;
    const amount = Math.max(0, Number(document.getElementById("budget-amount").value) || 0);
    state.budgets[cat] = amount;
    saveState();
    lastBudgetNotice = `Batas ${categoryOf(cat).label} diubah jadi ${rupiah(amount)}.`;
    renderBudget();
  });
  document.getElementById("calc-form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const income = Math.max(0, Number(document.getElementById("calc-income").value) || 0);
    document.getElementById("calc-out").innerHTML = calculatorHtml(income);
    const left = document.getElementById("calc-left");
    left.hidden = false;
    left.innerHTML = `Dengan gaji <b>${rupiah(income)}</b>, sisihkan <b>${rupiah(Math.round(income * 0.2))}</b> untuk tabungan dulu — sisanya ${rupiah(Math.round(income * 0.8))} untuk hidup sebulan.`;
  });
}

function renderExpenses() {
  setActiveNav("/pengeluaran");
  const cats = [{ id: "semua", label: "Semua" }, ...CATEGORIES];
  const list = state.expenses
    .filter((e) => filterCategory === "semua" || e.category === filterCategory)
    .slice().sort((a, b) => b.date.localeCompare(a.date));
  const shownTotal = list.reduce((s, e) => s + e.amount, 0);
  view.innerHTML = `
    <h1>Pengeluaran ${HOUSEHOLD.month}</h1>
    <p class="muted">${state.expenses.length} catatan, total ${rupiah(totalSpent())}. Saring per kategori, tambah yang baru, atau hapus yang salah catat.</p>
    <section class="card">
      <div class="filters" role="group" aria-label="Saring kategori">
        ${cats.map((c) => `<button type="button" data-cat="${c.id}" class="${filterCategory === c.id ? "on" : ""}">${c.label}</button>`).join("")}
      </div>
      <p><strong>Menampilkan ${list.length} catatan — total ${rupiah(shownTotal)}</strong></p>
      <table><thead><tr><th>Tanggal</th><th>Untuk apa</th><th class="hide-mobile">Kategori</th><th class="amount">Jumlah</th><th></th></tr></thead><tbody>
      ${list.map((e) => `<tr><td>${tanggalIndo(e.date)}</td><td>${escapeHtml(e.label)}<br><span class="muted">${escapeHtml(e.note || "")}</span></td><td class="hide-mobile"><span class="pill">${categoryOf(e.category).label}</span></td><td class="amount">${rupiah(e.amount)}</td><td><button type="button" class="danger" data-del="${e.id}">Hapus</button></td></tr>`).join("") || `<tr><td colspan="5">Belum ada pengeluaran di kategori ini.</td></tr>`}
      </tbody></table>
    </section>
    <section class="card" style="margin-top:18px">
      <h2>Tambah pengeluaran baru</h2>
      <form id="expense-form" class="add">
        <div class="row">
          <div><label for="exp-label">Untuk apa?</label><input id="exp-label" type="text" maxlength="80" placeholder="cth: Belanja sayur pasar" required></div>
          <div><label for="exp-amount">Jumlah (Rp)</label><input id="exp-amount" type="number" min="1000" step="1000" placeholder="150000" required></div>
        </div>
        <div class="row">
          <div><label for="exp-cat">Kategori</label><select id="exp-cat">${CATEGORIES.map((c) => `<option value="${c.id}">${c.label}</option>`).join("")}</select></div>
          <div><label for="exp-date">Tanggal</label><input id="exp-date" type="date" value="2026-11-26" required></div>
        </div>
        <div><label for="exp-note">Catatan (boleh kosong)</label><input id="exp-note" type="text" maxlength="120" placeholder="cth: Untuk stok seminggu"></div>
        <button type="submit">Simpan pengeluaran</button>
      </form>
      <p class="notice" id="exp-msg" hidden>Pengeluaran tersimpan.</p>
    </section>`;
  view.querySelectorAll("[data-cat]").forEach((b) => b.addEventListener("click", () => { filterCategory = b.dataset.cat; renderExpenses(); }));
  view.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => {
    state.expenses = state.expenses.filter((e) => e.id !== b.dataset.del);
    saveState();
    renderExpenses();
  }));
  document.getElementById("expense-form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const item = {
      id: "e" + Date.now().toString(36),
      date: document.getElementById("exp-date").value,
      label: document.getElementById("exp-label").value.trim(),
      category: document.getElementById("exp-cat").value,
      amount: Math.max(0, Number(document.getElementById("exp-amount").value) || 0),
      note: document.getElementById("exp-note").value.trim(),
    };
    state.expenses.push(item);
    saveState();
    renderExpenses();
    document.getElementById("exp-msg").hidden = false;
  });
}

function renderGoals() {
  setActiveNav("/tabungan");
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  view.innerHTML = `
    <h1>Tabungan & Tujuan Keluarga</h1>
    <p class="muted">Terkumpul ${rupiah(totalSaved)} dari target ${rupiah(totalTarget)} (${percent(totalSaved, totalTarget)}%). Tambah setoran ke target mana pun — progresnya langsung bergerak.</p>
    <div class="grid two">
      <section class="card"><h2>Semua target</h2>
        ${state.goals.map((g) => `
        <div class="goal">
          <div class="goal-head"><b>${escapeHtml(g.name)}</b><span>${rupiah(g.saved)} / ${rupiah(g.target)}</span></div>
          ${progressBar(g.saved, g.target, "#059669")}
          <p class="muted">${percent(g.saved, g.target)}% tercapai — kurang ${rupiah(Math.max(0, g.target - g.saved))}. ${escapeHtml(g.note)}</p>
          <form class="add-goal" data-goal="${g.id}">
            <input type="number" min="10000" step="10000" placeholder="Setor Rp…" aria-label="Jumlah setoran untuk ${escapeHtml(g.name)}" required>
            <button type="submit" class="small">+ Setor</button>
          </form>
        </div>`).join("")}
      </section>
      <section class="card">
        <h2>Buat target baru</h2>
        <form id="goal-form" class="add">
          <div><label for="goal-name">Nama target</label><input id="goal-name" type="text" maxlength="60" placeholder="cth: Dana pendidikan Nara" required></div>
          <div class="row">
            <div><label for="goal-target">Target (Rp)</label><input id="goal-target" type="number" min="100000" step="50000" placeholder="5000000" required></div>
            <div><label for="goal-saved">Sudah terkumpul (Rp)</label><input id="goal-saved" type="number" min="0" step="50000" value="0"></div>
          </div>
          <button type="submit">Buat target</button>
        </form>
        <p class="notice" id="goal-msg" hidden>Target baru dibuat.</p>
        <h2 style="margin-top:22px">Kenapa dana darurat dulu?</h2>
        <p>Dana darurat ${rupiah(state.goals[0].saved)} dari ${rupiah(state.goals[0].target)} adalah bantalan kalau ada yang sakit atau motor rusak. Ahli keuangan menyarankan 3–6x pengeluaran pokok; keluarga ini menargetkan 6x karena ada dua anak.</p>
        <p class="muted">Saran setor: ${rupiah(500000)}/bulan ke dana darurat sampai penuh, lalu alihkan ke target berikutnya.</p>
      </section>
    </div>`;
  view.querySelectorAll("[data-goal]").forEach((f) => f.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const amount = Math.max(0, Number(f.querySelector("input").value) || 0);
    const goal = state.goals.find((g) => g.id === f.dataset.goal);
    if (goal && amount > 0) { goal.saved = Math.min(goal.target, goal.saved + amount); saveState(); }
    renderGoals();
  }));
  document.getElementById("goal-form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    state.goals.push({
      id: "g" + Date.now().toString(36),
      name: document.getElementById("goal-name").value.trim(),
      target: Math.max(0, Number(document.getElementById("goal-target").value) || 0),
      saved: Math.max(0, Number(document.getElementById("goal-saved").value) || 0),
      note: "Target baru keluarga.",
    });
    saveState();
    renderGoals();
    document.getElementById("goal-msg").hidden = false;
  });
}

function renderTips() {
  setActiveNav("/tips");
  view.innerHTML = `
    <h1>Tips Mengatur Uang Rumah Tangga</h1>
    <p class="muted">Enam kebiasaan yang dipakai keluarga contoh di situs ini — lengkap dengan angka nyatanya, bukan sekadar nasihat.</p>
    <div class="grid two">
      <section class="card"><h2>Enam kebiasaan yang terbukti</h2>
        ${TIPS.map((t) => `<div class="tip"><h3>${escapeHtml(t.title)}</h3><p>${escapeHtml(t.body)}</p></div>`).join("")}
      </section>
      <section class="card">
        <h2>Checklist akhir bulan</h2>
        <ul class="check">${CHECKLIST.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>
        <h2 style="margin-top:22px">Sumber pemasukan keluarga</h2>
        <table><thead><tr><th>Sumber</th><th class="amount">Sebulan</th></tr></thead><tbody>
        ${HOUSEHOLD.incomeSources.map((s) => `<tr><td>${escapeHtml(s.label)}</td><td class="amount">${rupiah(s.amount)}</td></tr>`).join("")}
        <tr><td><strong>Total</strong></td><td class="amount"><strong>${rupiah(HOUSEHOLD.income)}</strong></td></tr>
        </tbody></table>
        <p class="muted">Tiga sumber membuat keluarga tidak bergantung pada satu gaji saja. Jualan kue akhir pekan menyumbang ${rupiah(700000)} — cukup untuk menutup kategori hiburan sebulan.</p>
        <p><a class="btn" href="#/">Kembali ke beranda →</a></p>
      </section>
    </div>`;
}

window.addEventListener("hashchange", route);
route();
