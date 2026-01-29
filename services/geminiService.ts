import { GoogleGenAI, Modality, Type } from "@google/genai";
import { ComedianProfile } from "../types";

const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates the comedy routine text.
 */
export const generateComedyRoutine = async (
  topic: string,
  profile: ComedianProfile,
  customName: string,
  knowledgeBase: string,
  useWebSearch: boolean
) => {
  const ai = getClient();
  
  const comedianName = profile.isCustom ? customName : profile.name;
  const styleDesc = profile.isCustom ? "使用工具搜索并研究该演员的风格。" : profile.styleDescription;

  // Updated System Instruction to Chinese
  const systemInstruction = `你是一位世界级的中文脱口秀编剧和表演者。
  你的目标是根据用户提供的主题，严格按照指定的风格创作一段单口喜剧（Stand-up Comedy）。
  
  上下文与知识库:
  ${knowledgeBase ? `用户提供了以下逻辑或逐字稿作为创作风格的参考: "${knowledgeBase}"` : '无自定义知识库。'}

  指令:
  1. 扮演角色: ${comedianName}。
  2. 风格指南: ${styleDesc}。
  3. 如果需要“研究”，请使用 Google Search 查找 ${comedianName} 最近的段子或风格分析。
  4. 围绕主题: "${topic}" 写一段大约 200-300 字的段子。
  5. 必须在括号中包含舞台动作指导，例如 (叹气)、(来回踱步)、(笑)。
  6. 输出必须是纯粹的脱口秀文本和舞台指导。不要输出像“这是你的段子”这样的客套话。
  7. 语言必须是中文，贴合中文脱口秀的语境和梗。
  `;

  const tools = useWebSearch || profile.isCustom ? [{ googleSearch: {} }] : [];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Smartest model for style mimicry
      contents: `写一段关于这个主题的脱口秀: ${topic}`,
      config: {
        systemInstruction: systemInstruction,
        tools: tools,
        temperature: 0.9, // High creativity
      },
    });

    const text = response.text || "抱歉，我在台上忘词了。请再试一次。";
    
    // Extract grounding chunks if available
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web ? { uri: chunk.web.uri, title: chunk.web.title } : null)
      .filter(Boolean) || [];

    return { text, sources };
  } catch (error) {
    console.error("Comedy Generation Error:", error);
    throw error;
  }
};

/**
 * Converts text to speech using a specific voice persona.
 */
export const generateSpeech = async (text: string) => {
  const ai = getClient();
  
  // Clean text of stage directions for speech (remove content in parens)
  const cleanText = text.replace(/\(.*?\)/g, '').trim();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: cleanText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' }, // Energetic voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Helper to play audio from base64 (PCM)
 */
export const playAudio = async (base64String: string): Promise<void> => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  const audioContext = new AudioContext({ sampleRate: 24000 });
  
  const bytes = decode(base64String);
  const audioBuffer = await decodeAudioData(bytes, audioContext, 24000, 1);

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start(0);
};
