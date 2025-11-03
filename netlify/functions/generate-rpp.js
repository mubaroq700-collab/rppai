// netlify/functions/generate-rpp.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inisialisasi AI dengan API Key dari environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const { topik, kelas, matapelajaran } = body;

    const prompt = `
Buatkan Rencana Pelaksanaan Pembelajaran (RPP) singkat:
- Kelas/Semester: ${kelas || "V / 1"}
- Mata Pelajaran: ${matapelajaran || "Matematika"}
- Topik: ${topik}
- Model Pembelajaran: PBL (Problem Based Learning)
- Alokasi Waktu: 1 x 30 menit

Format RPP:
1. Tujuan Pembelajaran (cognitive, psychomotor, affective)
2. Langkah-langkah Kegiatan Pembelajaran (Pendahuluan, Inti, Penutup)
3. Penilaian
4. Sumber / Media
`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text(); // ✅ harus await

    return {
      statusCode: 200,
      body: JSON.stringify({ rpp: text }),
    };
  } catch (error) {
    console.error("Error generating RPP:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Gagal membuat RPP dari AI." }),
    };
  }
}
