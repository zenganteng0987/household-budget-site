// Data awal keluarga contoh: Keluarga Rahma & Budi, dua anak, tinggal di Bandung.
// Semua angka dalam Rupiah. Data bisa diubah dari situs dan tersimpan di localStorage.
export const HOUSEHOLD = {
  name: "Keluarga Rahma & Budi",
  members: "2 dewasa + 2 anak",
  city: "Bandung",
  month: "November 2026",
  income: 12500000,
  incomeSources: [
    { label: "Gaji Budi (kantor)", amount: 8200000 },
    { label: "Gaji Rahma (guru)", amount: 3600000 },
    { label: "Jualan kue akhir pekan", amount: 700000 },
  ],
};

export const CATEGORIES = [
  { id: "dapur", label: "Belanja Dapur", color: "#0f766e", budget: 3000000, icon: "◉" },
  { id: "tagihan", label: "Tagihan & Rumah", color: "#2563eb", budget: 2200000, icon: "⌂" },
  { id: "transport", label: "Transport", color: "#d97706", budget: 1500000, icon: "➤" },
  { id: "sekolah", label: "Sekolah Anak", color: "#7c3aed", budget: 1800000, icon: "✎" },
  { id: "hiburan", label: "Hiburan & Jajan", color: "#db2777", budget: 800000, icon: "✿" },
  { id: "tabungan", label: "Tabungan Wajib", color: "#059669", budget: 2000000, icon: "⬢" },
  { id: "lain", label: "Lain-lain", color: "#64748b", budget: 700000, icon: "•" },
];

export const SEED_EXPENSES = [
  { id: "e01", date: "2026-11-02", label: "Belanja mingguan pasar & supermarket", category: "dapur", amount: 685000, note: "Beras 10 kg, ayam, sayur seminggu" },
  { id: "e02", date: "2026-11-03", label: "Listrik PLN (token)", category: "tagihan", amount: 450000, note: "Token 900 VA" },
  { id: "e03", date: "2026-11-04", label: "Bensin motor Budi", category: "transport", amount: 120000, note: "Pertalite, 2 minggu" },
  { id: "e04", date: "2026-11-05", label: "SPP Nara bulan November", category: "sekolah", amount: 650000, note: "SD kelas 4" },
  { id: "e05", date: "2026-11-06", label: "Belanja dapur tengah bulan", category: "dapur", amount: 512000, note: "Lauk, buah, bumbu" },
  { id: "e06", date: "2026-11-07", label: "Internet rumah 50 Mbps", category: "tagihan", amount: 350000, note: "Tagihan bulanan" },
  { id: "e07", date: "2026-11-09", label: "Ongkos ojek online Rahma", category: "transport", amount: 86000, note: "4x perjalanan" },
  { id: "e08", date: "2026-11-10", label: "Buku & alat tulis Dimas", category: "sekolah", amount: 178000, note: "SMP kelas 8" },
  { id: "e09", date: "2026-11-12", label: "Nonton & makan keluarga", category: "hiburan", amount: 342000, note: "Bioskop + makan siang" },
  { id: "e10", date: "2026-11-14", label: "Air PDAM", category: "tagihan", amount: 185000, note: "Pemakaian Oktober" },
  { id: "e11", date: "2026-11-16", label: "Belanja dapur akhir pekan", category: "dapur", amount: 498000, note: "Stok minggu ketiga" },
  { id: "e12", date: "2026-11-18", label: "Servis motor + ganti oli", category: "transport", amount: 275000, note: "Bengkel langganan" },
  { id: "e13", date: "2026-11-20", label: "Les renang Nara", category: "sekolah", amount: 300000, note: "4x pertemuan" },
  { id: "e14", date: "2026-11-22", label: "Jajan & camilan anak", category: "hiburan", amount: 94000, note: "Kantin sekolah" },
  { id: "e15", date: "2026-11-24", label: "Setor tabungan wajib", category: "tabungan", amount: 2000000, note: "Auto-debit tanggal 24" },
  { id: "e16", date: "2026-11-25", label: "Obat & vitamin keluarga", category: "lain", amount: 156000, note: "Apotek dekat rumah" },
];

export const SEED_GOALS = [
  { id: "g1", name: "Dana Darurat", target: 15000000, saved: 9200000, note: "Target 6x pengeluaran pokok. Sisa 5,8 jt lagi." },
  { id: "g2", name: "Liburan Keluarga ke Yogyakarta", target: 6000000, saved: 3750000, note: "Berangkat libur sekolah Juni 2027." },
  { id: "g3", name: "Laptop Baru untuk Dimas", target: 7500000, saved: 2100000, note: "Untuk tugas sekolah & belajar coding." },
  { id: "g4", name: "Renovasi Dapur", target: 12000000, saved: 3400000, note: "Ganti wastafel & rak, dicicil 2027." },
];

export const TIPS = [
  { title: "Bayar tabungan dulu, baru belanja", body: "Begitu gaji masuk, pindahkan 15–20% ke rekening tabungan terpisah. Keluarga Rahma & Budi memindahkan Rp2.000.000 tiap tanggal 24 lewat auto-debit, jadi tidak sempat terpakai." },
  { title: "Belanja dapur pakai daftar, seminggu sekali", body: "Susun menu seminggu, tulis daftarnya, dan belanja sekali. Keluarga contoh menghemat sekitar Rp400.000 sebulan setelah berhenti belanja harian tanpa daftar." },
  { title: "Pisahkan amplop digital per kategori", body: "Beri tiap kategori batasnya sendiri — dapur Rp3 jt, tagihan Rp2,2 jt — dan cek sisanya tiap Minggu malam. Kalau satu kategori jebol, ambil dari kategori hiburan, bukan dari tabungan." },
  { title: "Aturan 24 jam untuk beli yang tidak direncanakan", body: "Barang di atas Rp300.000 yang tidak ada di daftar ditunda sehari. Kalau besok masih terasa perlu, baru beli. Sembilan dari sepuluh kali, keinginannya hilang sendiri." },
  { title: "Tagihan tahunan dicicil bulanan", body: "Pajak motor, asuransi, dan uang sekolah tahunan dibagi 12 dan ditabung tiap bulan. Jadi tidak ada bulan yang tiba-tiba berat." },
  { title: "Rapat uang 15 menit tiap Minggu", body: "Duduk berdua, buka halaman Pengeluaran, lihat kategori mana yang mendekati batas. Anak-anak boleh ikut — mereka belajar bahwa uang ada batasnya." },
];

export const CHECKLIST = [
  "Gaji masuk — pindahkan tabungan wajib",
  "Cek sisa tiap kategori (Minggu malam)",
  "Bayar listrik, air & internet sebelum tanggal 10",
  "Tutup buku bulan ini tanggal 30",
];
