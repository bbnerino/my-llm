# ReAct 기반 에이전트 구현 기획서 (TypeScript)

## 1. 목표
- LLM(대형 언어 모델)과 외부 도구(Tool)를 결합하여, ReAct 프롬프트 패턴(추론-행동-관찰-반복)으로 동작하는 에이전트 시스템을 TypeScript로 직접 구현한다.
- LangChain의 구조와 ReAct 프롬프트 패턴을 참고하여, 다양한 Tool을 쉽게 추가/확장할 수 있도록 설계한다.

---

## 2. 주요 컴포넌트 설계

### 2.1 LLM Wrapper
- OpenAI, HuggingFace 등 다양한 LLM API와 통신하는 모듈
- 프롬프트 입력 → LLM 응답 반환

### 2.2 Prompt Template
- 입력값을 받아 동적으로 프롬프트를 생성하는 템플릿 시스템

### 2.3 Tool 인터페이스 및 구현체
- Tool 인터페이스: `run(input: any): Promise<any>`
- 예시 Tool: 날씨 검색, 계산기, 티켓 가격 조회 등
- Tool은 이름과 설명, 입력/출력 타입을 명확히 정의

### 2.4 Tool Registry
- 여러 Tool을 등록/관리하는 레지스트리
- Action 단계에서 Tool 이름으로 호출 가능

### 2.5 ReAct Agent (Controller)
- 입력(질문)을 받아, 아래의 과정을 반복
  1. Thought(추론): LLM이 다음 행동을 결정
  2. Action(행동): Tool 호출 필요 시, Tool 실행
  3. Observation(관찰): Tool 실행 결과를 LLM에 전달
  4. 반복(필요시)
  5. Answer(최종 답변): LLM이 최종 답변 생성ㅋㅈ
- 각 단계별 로그 및 상태 관리

### 2.6 Memory/State
- 대화/작업의 맥락(Thought, Action, Observation 등)을 저장
- 반복적인 추론/행동에 활용

---

## 3. 동작 흐름 예시

1. 사용자가 질문 입력
2. Agent가 프롬프트 생성 → LLM 호출 (Thought/Action 결정)
3. Action이 Tool 호출이면, Tool Registry에서 해당 Tool 실행
4. Observation(결과)을 LLM에 전달
5. 필요시 반복 (여러 단계 가능)
6. 최종 Answer 생성 및 반환

---

## 4. 확장성 및 유지보수
- Tool 인터페이스 표준화로 새로운 Tool을 쉽게 추가 가능
- LLM Wrapper 교체/확장 가능
- 프롬프트 템플릿 커스터마이즈 지원
- 각 단계별 로깅 및 디버깅 기능 내장

---

## 5. 예시 코드 구조 (TypeScript)

```
// Tool 인터페이스
interface Tool {
  name: string;
  description: string;
  run(input: any): Promise<any>;
}

// Tool Registry
class ToolRegistry {
  private tools: Map<string, Tool> = new Map();
  register(tool: Tool) { this.tools.set(tool.name, tool); }
  get(name: string): Tool | undefined { return this.tools.get(name); }
}

// LLM Wrapper (예시)
class LLM {
  async generate(prompt: string): Promise<string> {
    // OpenAI API 등 호출
    return "LLM 응답";
  }
}

// ReAct Agent
class ReActAgent {
  constructor(private llm: LLM, private toolRegistry: ToolRegistry) {}
  async run(question: string): Promise<string> {
    // 1. Thought/Action 생성
    // 2. Action이 Tool이면 실행, Observation 생성
    // 3. 반복 및 최종 Answer 생성
    return "최종 답변";
  }
}
```

---

## 6. 개발 및 테스트 계획
- MVP: LLM Wrapper + Tool 인터페이스 + ToolRegistry + ReActAgent 기본 동작 구현
- 샘플 Tool(날씨, 계산기 등) 2~3개 구현
- 실제 LLM 연동 및 프롬프트 설계
- 단계별 유닛 테스트 및 통합 테스트

---

## 7. 참고 자료
- [Prompting Guide - ReAct](https://www.promptingguide.ai/kr/techniques/react)
- LangChain 공식 문서 및 예제 