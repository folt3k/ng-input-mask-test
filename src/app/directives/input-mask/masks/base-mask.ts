import {
  InputMaskCharValidationRule,
  InputMaskStrategy,
  InputMaskType,
} from '../input-mask.types';

export class BaseMask extends InputMaskStrategy {
  private readonly rules: InputMaskCharValidationRule[] = [
    {
      key: '0',
      isValid: (char: string) => !!char.match('[0-9]'),
    },
    {
      key: 'A',
      isValid: (char: string) => !!char.match('[a-zA-Z]'),
    },
  ];

  constructor(protected override inputMask: string | InputMaskType) {
    super(inputMask);
  }

  getLoopArr(inputValue: string): string[] {
    return this.inputMask.split('');
  }
  isCharMatchingToAnyRule(char: string): boolean {
    return !!this.rules.find((rule) => rule.key.includes(char));
  }
  getCharValidationFn(char: string): (char: string) => boolean {
    return this.rules.find((rule) => rule.key === char)!.isValid;
  }
  getFinalValue(arr: string[]): string {
    return arr.join('');
  }
}
