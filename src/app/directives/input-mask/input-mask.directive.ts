import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

interface InputMaskRule {
  key: string;
  isValid: (char: string) => boolean;
}

@Directive({
  selector: '[inputMask]',
})
export class InputMaskDirective {
  @Input() inputMask: string = '';

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
    const splitMaskArr = this.inputMask.split('');
    const splitValueArr = inputValue.split('');

    for (let index = 0; index < splitMaskArr.length; index++) {
      const char = splitMaskArr[index];

      if (splitValueArr[index] === undefined) {
        continue;
      }

      if (this.isCharMatchingToAnyRule(char)) {
        const rule = this.rules.find((rule) => rule.key === char)!;
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

    return splitValueArr.splice(0, splitMaskArr.length).join('');
  }

  private isCharMatchingToAnyRule(char: string): boolean {
    return !!this.rules.find((rule) => rule.key.includes(char));
  }
}
