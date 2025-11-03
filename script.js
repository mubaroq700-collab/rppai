// script.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-rpp');
  const resultContainer = document.getElementById('result-container');
  const hasilRpp = document.getElementById('hasil-rpp');
  const loading = document.getElementById('loading');
  const btnCopy = document.getElementById('btn-copy');
  const btnDownload = document.getElementById('btn-download');

  function generateRppText(data) {
    // Template RPP sederhana, bisa dikembangkan lagi
    return [
      `RPP SINGKAT`,
      `==============================`,
      `Kelas / Semester : ${data.kelas}`,
      `Mata Pelajaran   : ${data.mapel}`,
      `Materi Pokok     : ${data.materi}`,
      `Topik/Sub Materi : ${data.topik}`,
      `Model Pembelajaran: ${data.model}`,
      `Alokasi Waktu    : ${data.waktu}`,
      ``,
      `I.  Kompetensi Inti (KI)`,
      `  - KI 1: ...`,
      `  - KI 2: ...`,
      `  - KI 3: ...`,
      `  - KI 4: ...`,
      ``,
      `II. Kompetensi Dasar (KD)`,
      `  - KD 1: ...`,
      `  - KD 2: ...`,
      ``,
      `III. Tujuan Pembelajaran`,
      `  Setelah mengikuti pembelajaran ini, peserta didik diharapkan:`,
      `  1. ... (kognitif)`,
      `  2. ... (psikomotor)`,
      `  3. ... (afektif)`,
      ``,
      `IV. Langkah-langkah Pembelajaran (${data.waktu})`,
      `  A. Pendahuluan (5 menit)`,
      `    - Apersepsi dan motivasi singkat terkait ${data.topik}.`,
      `  B. Kegiatan Inti`,
      `    1. Eksplorasi: Guru memfasilitasi kegiatan ${data.model} untuk mengenalkan ${data.materi}.`,
      `    2. Elaborasi: Peserta didik bekerja kelompok untuk menyelesaikan tugas penjumlahan/latihan (atau sesuai materi).`,
      `    3. Konfirmasi: Guru mengecek pemahaman dan memberi umpan balik.`,
      `  C. Penutup`,
      `    - Refleksi singkat, tugas rumah, dan evaluasi formatif.`,
      ``,
      `V. Penilaian`,
      `  - Teknik: Observasi, Tes Tertulis, Penugasan`,
      `  - Bentuk: Soal PG, Isian, Projek kecil`,
      ``,
      `VI. Sumber / Media`,
      `  - Buku siswa, Lembar Kerja, Alat Peraga sederhana, PPT.`,
      ``,
      `Catatan: Silakan edit KD, indikator, dan langkah rinci sesuai silabus/kurikulum sekolah Anda.`
    ].join('\n');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // ambil nilai
    const data = {
      kelas: document.getElementById('kelas').value.trim(),
      mapel: document.getElementById('mapel').value.trim(),
      materi: document.getElementById('materi').value.trim(),
      topik: document.getElementById('topik').value.trim(),
      model: document.getElementById('model').value.trim(),
      waktu: document.getElementById('waktu').value.trim()
    };

    // Validasi sederhana
    if (!data.kelas || !data.mapel || !data.materi || !data.topik || !data.model || !data.waktu) {
      alert('Lengkapi semua field terlebih dahulu.');
      return;
    }

    // tampilkan result container
    resultContainer.style.display = 'block';
    loading.style.display = 'block';
    hasilRpp.textContent = '';

    // simulasi pembuatan (singkat) — hasil langsung tersedia setelah delay kecil
    setTimeout(() => {
      const teks = generateRppText(data);
      loading.style.display = 'none';
      hasilRpp.textContent = teks;

      // update download link (plain text file)
      const blob = new Blob([teks], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      btnDownload.href = url;

    }, 600); // 600ms agar terasa responsif (bukan proses server)
  });

  btnCopy.addEventListener('click', async () => {
    const teks = hasilRpp.textContent;
    if (!teks) return;
    try {
      await navigator.clipboard.writeText(teks);
      btnCopy.textContent = '✅ Tersalin';
      setTimeout(() => btnCopy.textContent = '📋 Salin Teks', 1500);
    } catch (err) {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = teks;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        btnCopy.textContent = '✅ Tersalin';
        setTimeout(() => btnCopy.textContent = '📋 Salin Teks', 1500);
      } finally {
        document.body.removeChild(ta);
      }
    }
  });

  // optional: clear generated download object URLs on reset
  form.addEventListener('reset', () => {
    hasilRpp.textContent = '';
    resultContainer.style.display = 'none';
    loading.style.display = 'none';
    if (btnDownload.href) {
      try { URL.revokeObjectURL(btnDownload.href); } catch (e) {}
      btnDownload.removeAttribute('href');
    }
  });
});
