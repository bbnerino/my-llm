import { LLM } from './llm';
import { ToolRegistry } from './toolRegistry';
import { PromptTemplate } from './promptTemplate';

interface Step {
  thought: string;
  action?: { tool: string; input: any };
  observation?: string;
}

export class ReActAgent {
  private steps: Step[] = [];

  constructor(
    private llm: LLM,
    private toolRegistry: ToolRegistry,
    private promptTemplate: PromptTemplate
  ) {}

  async run(question: string): Promise<string> {
    let done = false;
    let answer = '';
    let context = '';
    let stepCount = 0;

    while (!done && stepCount < 10) {
      // 1. 프롬프트 생성 (이전 단계 context 포함)
      const prompt = this.promptTemplate.format({
        question,
        context
      });
      // 2. LLM 호출 (Thought/Action 생성)
      const llmResponse = await this.llm.generate(prompt);
      // 3. LLM 응답 파싱 (예시: Action: tool=weather, input={city: '서울'})
      // 실제 구현에서는 LLM 응답 포맷에 맞게 파싱 필요
      // 여기서는 간단히 "Action: tool=weather, input=서울" 형태를 가정
      let thought = llmResponse;
      let actionMatch = llmResponse.match(/Action: tool=(\w+), input=(.+)/);
      let observation = '';
      if (actionMatch) {
        const toolName = actionMatch[1];
        const toolInput = actionMatch[2];
        const tool = this.toolRegistry.get(toolName);
        if (tool) {
          observation = await tool.run({ city: toolInput });
          context += `\n[Thought] ${thought}\n[Action] ${toolName}(${toolInput})\n[Observation] ${observation}`;
        } else {
          observation = '알 수 없는 도구 요청';
          context += `\n[Thought] ${thought}\n[Action] ${toolName}(${toolInput})\n[Observation] ${observation}`;
        }
      } else if (llmResponse.startsWith('Answer:')) {
        answer = llmResponse.replace('Answer:', '').trim();
        done = true;
        context += `\n[Thought] ${thought}\n[Answer] ${answer}`;
      } else {
        // Thought만 있는 경우
        context += `\n[Thought] ${thought}`;
      }
      stepCount++;
    }
    return answer || '답변을 생성하지 못했습니다.';
  }
} 