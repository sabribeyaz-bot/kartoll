import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLessonContent = async (topic: string = "genel kültür"): Promise<string> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Bana on parmak klavye çalışması için orta zorlukta bir metin oluştur.
      Konu: ${topic}.
      Dil: Türkçe.
      Uzunluk: Yaklaşık 40-50 kelime.
      İçerik: Düzgün cümleler, yaygın kelimeler ve temel noktalama işaretleri içermeli.
      Önemli: Sadece metni döndür, başlık veya açıklama ekleme. JSON formatında değil, düz metin (string) olarak ver.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error("Boş yanıt alındı.");
    }
    return text;
  } catch (error) {
    console.error("Gemini ile metin oluşturulurken hata:", error);
    return "Yapay zeka şu anda meşgul. Lütfen standart derslerle devam edin veya daha sonra tekrar deneyin.";
  }
};

export const generateRemedialContent = async (weakKeys: string[]): Promise<string> => {
  try {
    const model = "gemini-2.5-flash";
    const keysStr = weakKeys.join(", ");
    const prompt = `
      Kullanıcı şu harflerde hata yapıyor: [${keysStr}].
      Bu harflerin kullanımını içeren, kullanıcının bu zayıf noktalarını geliştirmesini sağlayacak Türkçe bir pratik metni oluştur.
      Uzunluk: 30-40 kelime.
      Anlamlı cümleler kurmaya çalış ama öncelik bu harflerin sık geçmesi olsun.
      Sadece metni döndür, başlık veya açıklama ekleme.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error("Boş yanıt alındı.");
    }
    return text;
  } catch (error) {
    console.error("Gemini ile telafi dersi oluşturulurken hata:", error);
    return `Hata analizi yapılamadı. Lütfen tekrar deneyin. (${weakKeys.join(' ')} tuşlarına odaklanın)`;
  }
};