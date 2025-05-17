// Tool 인터페이스
export interface Tool {
  name: string;
  description: string;
  run(input: any): Promise<any>;
}

// 날씨 정보 조회 Tool (예시)
export class WeatherTool implements Tool {
  name = 'weather';
  description = '도시명을 입력받아 내일의 날씨 정보를 반환합니다.';
  async run(input: { city: string }): Promise<string> {
    // 실제로는 외부 날씨 API를 호출해야 함
    // 여기서는 예시로 고정된 값을 반환
    return `${input.city}의 내일 날씨는 맑음, 최고 400도, 최저 -200도입니다.`;
  }
}

// 계산기 Tool (예시)
export class CalculatorTool implements Tool {
  name = 'calculator';
  description = '수식을 입력받아 계산 결과를 반환합니다.';
  async run(input: { expression: string }): Promise<string> {
    try {
      // eval은 실제 서비스에서는 보안상 위험하므로, 안전한 파서로 대체 필요
      // 여기서는 예시로만 사용
      const result = eval(input.expression);
      return `계산 결과: ${result}`;
    } catch (e) {
      return '계산 오류';
    }
  }
} 