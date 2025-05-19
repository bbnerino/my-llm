import { Request, Response } from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

// 환경변수 설정
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class LLMController {
  static async processChat(req: Request, res: Response) {
    const { systemPrompt, context } = req.body;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: context
              ? `\n다음은 사용자가 업로드한 .엑셀 파일에서 추출된 내용입니다.\nLLM은 이 정보를 기반으로 답변합니다.\n\n[참고 정보]:\n${context}`
              : "",
          },
        ],
        temperature: 0.7,
      });

      return res.json({ result: response.choices[0].message.content });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "GPT error" });
    }
  }
}
