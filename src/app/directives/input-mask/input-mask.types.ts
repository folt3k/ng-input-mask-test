export type InputMaskType = 'thousands';

export interface InputMaskCharValidationRule {
  key: string;
  isValid: (char: string) => boolean;
}

export abstract class InputMaskStrategy {
  constructor(protected inputMask: string | InputMaskType) {}

  abstract getLoopArr(inputValue: string): string[];
  abstract isCharMatchingToAnyRule(char: string): boolean;
  abstract getCharValidationFn(char: string): (char: string) => boolean;
  abstract getFinalValue(arr: string[]): string;
}
