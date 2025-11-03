// script.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-rpp');
  const resultContainer = document.getElementById('result-container');
  const hasilRpp = document.getElementById('hasil-rpp');
  const loading = document.getElementById('loading');
  const btnCopy = document.getElementById('btn-copy');
  const btnDownload = document.getElementById('btn-download');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Ambil nilai dari form
    const data = {
      kelas: document.getElementById('kelas').value.trim(),
      mapel: document.getElementById('mapel').value.trim(),
      materi: document.getElementById('materi').value.trim(),
      topik: document.getElementById('topik').value.trim(),
      model: document.getElementById('model').value.trim(),
      waktu: document.getElementById('waktu').value.trim(),
    };

    // Validasi input
    if (!data.kelas || !data.mapel || !data.materi || !data.topik) {
      alert('Lengkapi semua field terlebih dahulu.');
      return;
    }

    // Tampilkan loading
    resultContainer.style.display = 'block';
    loading.style.display = 'block';
    hasilRpp.textContent = '';

    try {
      // Kirim data ke fungsi Netlify
      const response = await fetch('/.netlify/functions/generate-rpp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kelas: data.kelas,
          matapelajaran: data.mapel,
          topik: `${data.materi} - ${data.topik}`,
        }),
      });

      const result = await response.json();
      loading.style.display = 'none';

      if (result.rpp) {
        hasilRpp.textContent = result.rpp;

        // buat file download
        const blob = new Blob([result.rpp], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        btnDownload.href = url;
        btnDownload.download = `RPP_${data.mapel}_${data.kelas}.txt`;
      } else {
        hasilRpp.textContent = '⚠️ Gagal mendapatkan hasil dari AI.';
      }

    } catch (error) {
      console.error('Error:', error);
      loading.style.display = 'none';
      hasilRpp.textContent = '⚠️ Terjadi kesalahan saat menghubungi server.';
    }
  });

  // Tombol salin
  btnCopy.addEventListener('click', async () => {
    const teks = hasilRpp.textContent;
    if (!teks) return;
    try {
      await navigator.clipboard.writeText(teks);
      btnCopy.textContent = '✅ Tersalin';
      setTimeout(() => (btnCopy.textContent = '📋 Salin Teks'), 1500);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = teks;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btnCopy.textContent = '✅ Tersalin';
      setTimeout(() => (btnCopy.textContent = '📋 Salin Teks'), 1500);
    }
  });

  // Reset form
  form.addEventListener('reset', () => {
    hasilRpp.textContent = '';
    resultContainer.style.display = 'none';
    loading.style.display = 'none';
    if (btnDownload.href) {
      try {
        URL.revokeObjectURL(btnDownload.href);
      } catch {}
      btnDownload.removeAttribute('href');
    }
  });
});
