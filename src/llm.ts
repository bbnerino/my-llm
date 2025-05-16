import * as dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config({ path: ".env.local" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export class LLM {
  // 생성자에서 API 키 등 옵션을 받을 수 있도록 설계
  constructor(private apiKey: string = OPENAI_API_KEY || "") {}

  async generate(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error("OpenAI API 키가 설정되어 있지 않습니다.");
    }
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "당신은 ReAct 에이전트로, Thought, Action, Observation, Answer 형식으로만 응답해야 합니다."
        },
        {
          role: "user",
          content: "안녕하세요"
        }
      ],
      temperature: 0.7
    });

    console.log("response", response.choices[0].message.content);
    console.log("================================================");
    return response.choices[0].message.content || "";
  }
}
