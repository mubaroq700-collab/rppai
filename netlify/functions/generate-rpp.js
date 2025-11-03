// Impor library AI dari Google
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inisialisasi AI dengan API Key Anda
// API Key akan diambil dari variabel lingkungan Netlify untuk keamanan
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Ini adalah fungsi utama yang akan dijalankan oleh Netlify
exports.handler = async function (event, context) {
  // Hanya menerima permintaan POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // Ambil data yang dikirim dari website (misalnya: topik, kelas, dll.)
    const body = JSON.parse(event.body);
    const { topik, kelas, matapelajaran } = body;

    // Buat "perintah" atau "prompt" yang detail untuk AI
    const prompt = `
    Buatkan sebuah Rencana Pelaksanaan Pembelajaran (RPP) singkat dengan format berikut:
    - Kelas/Semester: ${kelas || 'V / 1'}
    - Mata Pelajaran: ${matapelajaran || 'Matematika'}
    - Topik: ${topik}
    - Model Pembelajaran: PBL (Problem Based Learning)
    - Alokasi Waktu: 1 x 30 menit

    Buatkan dalam bentuk poin-poin yang jelas untuk:
    1. Tujuan Pembelajaran (cognitive, psychomotor, affective)
    2. Langkah-langkah Kegiatan Pembelajaran (kegiatan awal, inti, penutup)
    `;

    // Panggil model AI Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Kirim hasilnya kembali ke website
    return {
      statusCode: 200,
      body: JSON.stringify({ rpp: text }),
    };
  } catch (error) {
    // Jika ada error, kirim pesan error
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Maaf, terjadi kesalahan pada server." }),
    };
  }
};