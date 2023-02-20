import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

type InputMaskType = 'thousands';

interface InputMaskRule {
  key: string;
  isValid: (char: string) => boolean;
}

@Directive({
  selector: '[inputMask]',
})
export class InputMaskDirective {
  @Input() inputMask: string | InputMaskType = '';

  private readonly rules: InputMaskRule[] = [
    {
      key: '0',
      isValid: (char: string) => !!char.match('[0-9]'),
    },
    {
      key: 'A',
      isValid: (char: string) => !!char.match('[a-zA-Z]'),
    },
  ];

  constructor(private control: NgControl) {
    setTimeout(() => {
      this.control.valueAccessor?.registerOnChange(() => {});
    });
  }

  @HostListener('input', ['$event'])
  onInputChange(event: InputEvent) {
    const inputMaskValue = this.createInputMaskValue(
      (event.target as HTMLInputElement).value
    );

    this.control.control?.setValue(inputMaskValue);
  }

  private createInputMaskValue(inputValue: string): string {
    const loopArr = this.getLoopArr(inputValue);
    const splitValueArr = inputValue.split('');

    for (let index = 0; index < loopArr.length; index++) {
      const char = loopArr[index];

      if (splitValueArr[index] === undefined) {
        continue;
      }

      if (this.isCharMatchingToAnyRule(char)) {
        const rule = this.getRule(char);
        const isCharValid = rule.isValid(splitValueArr[index]);

        if (!isCharValid) {
          let matched = false;

          for (
            let missingIndex = index;
            missingIndex < splitValueArr.length;
            missingIndex++
          ) {
            if (splitValueArr[missingIndex] === undefined) {
              continue;
            }

            const isCharValid = rule.isValid(splitValueArr[missingIndex]);

            if (isCharValid) {
              splitValueArr.splice(index, 0, splitValueArr[missingIndex]);
              splitValueArr.splice(index, missingIndex + 1 - index);
              matched = true;
              break;
            }
          }

          if (!matched) {
            splitValueArr.splice(index, splitValueArr.length - index);
          }
        }
      } else if (splitValueArr[index] !== char) {
        splitValueArr.splice(index, 0, char);
      }
    }

    const cutSplitValueArr = splitValueArr.splice(0, loopArr.length);

    return this.getFinalValue(cutSplitValueArr);
  }

  private getLoopArr(inputValue: string): string[] {
    if (this.inputMask === 'thousands') {
      return inputValue.split('');
    }

    return this.inputMask.split('');
  }

  private isCharMatchingToAnyRule(char: string): boolean {
    if (this.inputMask === 'thousands') {
      return true;
    }

    return !!this.rules.find((rule) => rule.key.includes(char));
  }

  private getRule(char: string): InputMaskRule {
    if (this.inputMask === 'thousands') {
      return this.rules.find((rule) => rule.key === '0')!;
    }

    return this.rules.find((rule) => rule.key === char)!;
  }

  private getFinalValue(arr: string[]): string {
    if (this.inputMask === 'thousands') {
      return arr
        .join('')
        .split(/(?=(?:...)*$)/)
        .join(' ');
    }

    return arr.join('');
  }
}
