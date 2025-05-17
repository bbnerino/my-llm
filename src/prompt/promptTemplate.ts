export class PromptTemplate {
  constructor(private template: string) {}

  format(variables: Record<string, string | undefined>): string {
    let result = this.template;
    for (const key in variables) {
      if (Object.prototype.hasOwnProperty.call(variables, key)) {
        const value = variables[key];
        const safeValue = value === undefined ? '' : value;
        result = result.replace(new RegExp(`{\s*${key}\s*}`, 'g'), safeValue);
      }
    }
    return result;
  }
} 