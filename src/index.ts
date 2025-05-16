import { WeatherTool, CalculatorTool } from './tool';
import { ToolRegistry } from './toolRegistry';
import { LLM } from './llm';
import { PromptTemplate } from './promptTemplate';
import { ReActAgent } from './agent';

// 1. Tool 등록
const weatherTool = new WeatherTool();
const calculatorTool = new CalculatorTool();
const toolRegistry = new ToolRegistry();
toolRegistry.register(weatherTool);
toolRegistry.register(calculatorTool);

// 2. LLM 및 프롬프트 템플릿 준비
const llm = new LLM();
const promptTemplate = new PromptTemplate(
  `질문: {question}
{context}
다음 단계(Thought, Action, Observation, Answer) 중 하나를 작성하세요.`
);

// 3. ReActAgent 생성
const agent = new ReActAgent(llm, toolRegistry, promptTemplate);

// 4. 실행 예시
(async () => {
  const question = '내일 서울 날씨 알려줘';
  const answer = await agent.run(question);
  console.log('최종 답변:', answer);
})(); 