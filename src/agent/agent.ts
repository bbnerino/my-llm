import { LLM } from "./llm";
import { ToolRegistry } from "../tool/toolRegistry";
import { PromptTemplate } from "../prompt/promptTemplate";

interface Step {
  thought: string;
  action?: { tool: string; input: any };
  observation?: string;
}

export class ReActAgent {
  private llm: LLM = new LLM();
  private steps: Step[] = [];
  private toolRegistry: ToolRegistry;
  private promptTemplate: PromptTemplate;

  constructor(toolRegistry: ToolRegistry, promptTemplate: PromptTemplate) {
    this.toolRegistry = toolRegistry;
    this.promptTemplate = promptTemplate;
  }

  async run(question: string): Promise<string> {
    let done = false;
    let answer = "";
    let context = "";
    let stepCount = 0;
    const MAX_STEPS = 5;

    while (!done && stepCount < 10) {
      // 1. 프롬프트 생성 (이전 단계 context 포함)
      const prompt = this.promptTemplate.format({
        question,
        context
      });
      // 2. LLM 호출 (Thought/Action 생성)
      const llmResponse = await this.llm.generate(prompt);

      console.log("🟠", llmResponse);
      console.log("================================================\n");
      // 3. LLM 응답 파싱 (예시: Action: tool=weather, input={city: '서울'})
      // 실제 구현에서는 LLM 응답 포맷에 맞게 파싱 필요
      // 여기서는 간단히 "Action: tool=weather, input=서울" 형태를 가정
      const lines = llmResponse.split('\n').map(line => line.trim());
      const answerLine = lines.find(line => line.startsWith('Answer:'));
      if (answerLine) {
        answer = answerLine.replace('Answer:', '').trim();
        done = true;
        context += `\n${llmResponse}`;
        break;
      }

      let actionMatch = llmResponse.match(/Action: tool=(\w+), input=(.+)/);
      let observation = "";
      
      if (actionMatch) {
        const toolName = actionMatch[1];
        const toolInput = actionMatch[2];
        const tool = this.toolRegistry.get(toolName);
        if (tool) {
          observation = await tool.run({ city: toolInput });
          context += `\nThought ${llmResponse}\nAction ${toolName}(${toolInput})\nObservation ${observation}`;
        } else {
          observation = "알 수 없는 도구 요청";
          context += `\nThought ${llmResponse}\nAction ${toolName}(${toolInput})\nObservation ${observation}`;
        }
      } else {
        // Thought만 있는 경우
        context += `\nThought ${llmResponse}`;
      }
      stepCount++;
    }
    return answer || "답변을 생성하지 못했습니다.";
  }
}
