
import { GoogleGenAI, Type } from "@google/genai";
import { SubtitleItem } from "../types";

const CHUNK_SIZE = 20;

export class GeminiTranslator {
  private ai: GoogleGenAI;
  private systemInstruction = `你是一位顶级的电影/纪录片字幕翻译专家，擅长“信、达、雅”的翻译风格。

**翻译原则：**
1. **意译优先**：不要死扣单词，要翻译出句子的神韵和语气。避免机械的“机翻感”。
2. **上下文连贯**：字幕往往被切碎在多个片段中，请将提供的文本视为一段连续的对话或旁白。确保前后句意衔接自然，逻辑通顺。
3. **雅致用词**：使用地道、优美的中文书面语。
   - "It's a little much perhaps" 翻译为 "也许有些夸张" 或 "或许稍显过火"。
   - "grand and dramatic" 翻译为 "壮丽而引人注目" 或 "宏伟而富有表现力"。
4. **格式控制**：如果是批量翻译，返回 JSON 数组；如果是单句翻译，直接返回翻译后的文本。
5. **禁忌**：不要在翻译中夹带英文，不要输出任何解释性文字。

**示例参考：**
原文："It's a little much perhaps, but what's clear is that the Victorians took great pride in their embankment, and thought it needed appropriately grand and dramatic decoration"
理想翻译："也许有些夸张，但很明显，维多利亚时代的人们对自己的堤岸充满自豪，认为它理应拥有壮丽而引人注目的装饰。"`;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async translateSingle(text: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `请将这段文字翻译为优雅、地道的中文：\n\n${text}`,
        config: {
          systemInstruction: this.systemInstruction,
          temperature: 0.7,
        },
      });
      return response.text || "翻译失败";
    } catch (error) {
      console.error("Single translation error:", error);
      return "翻译出错，请检查 API 状态。";
    }
  }

  async translateBatch(
    items: SubtitleItem[], 
    onProgress: (translatedBatch: { index: number, text: string }[]) => void
  ) {
    const chunks = [];
    for (let i = 0; i < items.length; i += CHUNK_SIZE) {
      chunks.push(items.slice(i, i + CHUNK_SIZE));
    }

    for (let i = 0; i < chunks.length; i++) {
      const currentChunk = chunks[i];
      const payload = currentChunk.map(item => ({ id: item.index, text: item.originalText }));

      try {
        const response = await this.ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `请翻译以下字幕片段，确保整体语境连贯，用词高雅：\n${JSON.stringify(payload)}`,
          config: {
            systemInstruction: this.systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  translatedText: { type: Type.STRING }
                },
                required: ["id", "translatedText"]
              }
            }
          }
        });

        const text = response.text;
        if (!text) throw new Error("Empty response from AI");
        
        const result = JSON.parse(text);
        onProgress(result.map((r: any) => ({ index: r.id, text: r.translatedText })));
      } catch (error) {
        console.error("Translation error in chunk", i, error);
        throw error;
      }
    }
  }
}
