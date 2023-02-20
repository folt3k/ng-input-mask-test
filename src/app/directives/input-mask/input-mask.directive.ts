import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

import { InputMaskStrategy, InputMaskType } from './input-mask.types';
import { ThousandsMask } from './masks/thousands-mask';
import { BaseMask } from './masks/base-mask';

@Directive({
  selector: '[inputMask]',
})
export class InputMaskDirective {
  @Input() inputMask: string | InputMaskType = '';

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
    const maskStrategy = this.maskStrategyFactory();
    const loopArr = maskStrategy.getLoopArr(inputValue);
    const splitValueArr = inputValue.split('');

    for (let index = 0; index < loopArr.length; index++) {
      const char = loopArr[index];

      if (splitValueArr[index] === undefined) {
        continue;
      }

      if (maskStrategy.isCharMatchingToAnyRule(char)) {
        const isCharValidFn = maskStrategy.getCharValidationFn(char);
        const isCharValid = isCharValidFn(splitValueArr[index]);

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

            const isCharValid = isCharValidFn(splitValueArr[missingIndex]);

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

    return maskStrategy.getFinalValue(cutSplitValueArr);
  }

  private maskStrategyFactory(): InputMaskStrategy {
    switch (this.inputMask) {
      case 'thousands':
        return new ThousandsMask(this.inputMask);
      default:
        return new BaseMask(this.inputMask);
    }
  }
}
