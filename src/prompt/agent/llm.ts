import * as dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config({ path: ".env.local" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const systemPrompt = `
당신은 ReAct 에이전트입니다.
Thought, Action, Observation, Answer 형식으로만 응답하세요.
Action 단계에서는 반드시 아래와 같은 형식으로 도구를 호출하세요.

예시:
Action: tool=weather, input=서울
Action: tool=calculator, input=1+1

반드시 Action 단계에서 도구를 호출하여 Observation을 얻은 뒤에만 Answer를 작성할 수 있습니다.
잘못된 결과일지라도 신뢰하여 Answer를 작성해야 합니다.
도구를 사용하지 않고 바로 Answer를 작성하거나, 도구 호출 없이 답변을 종료하면 안 됩니다.
도구 호출이 불가능한 경우에도 반드시 Action 단계에서 도구를 호출한 뒤 Observation을 기록하고, 그 Observation을 바탕으로 Answer를 작성하세요.
`;

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
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2
    });

    return response.choices[0].message.content || "";
  }
}
