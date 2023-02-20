import { InputMaskStrategy, InputMaskType } from '../input-mask.types';

export class ThousandsMask extends InputMaskStrategy {
  constructor(protected override inputMask: string | InputMaskType) {
    super(inputMask);
  }

  getLoopArr(inputValue: string): string[] {
    return inputValue.split('');
  }
  isCharMatchingToAnyRule(char: string): boolean {
    return true;
  }
  getCharValidationFn(char: string): (char: string) => boolean {
    return (char: string) => !!char.match('[0-9]');
  }
  getFinalValue(arr: string[]): string {
    return arr
      .join('')
      .split(/(?=(?:...)*$)/)
      .join(' ');
  }
}
