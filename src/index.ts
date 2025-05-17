import { WeatherTool, CalculatorTool } from "./tool/tool";
import { ToolRegistry } from "./tool/toolRegistry";

import { PromptTemplate } from "./prompt/promptTemplate";
import { ReActAgent } from "./agent/agent";

// 1. Tool 등록
const toolRegistry = new ToolRegistry();

toolRegistry.register(new WeatherTool());
toolRegistry.register(new CalculatorTool());

// 2. LLM 및 프롬프트 템플릿 준비

const promptTemplate = new PromptTemplate(
  `질문: {question}
{context}
다음 단계(Thought, Action, Observation, Answer) 중 하나를 작성하세요.`
);

// 3. ReActAgent 생성
const agent = new ReActAgent(toolRegistry, promptTemplate);

async function main(question: string) {
  const answer = await agent.run(question);
  console.log("⭐️ 최종 답변 : ", answer);
}

// 4. 실행 예시
const question = "내일 서울 날씨 알려줘";
// const question = "5리터, 3리터, 2리터 물통이 있을 때, 4리터를 정확히 만들 수 있는 방법을 단계별로 설명해줘.";
main(question);
