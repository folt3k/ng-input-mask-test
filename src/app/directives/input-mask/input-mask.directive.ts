import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[inputMask]',
})
export class InputMaskDirective {
  @Input() inputMask: string = '';

  constructor(private control: NgControl) {
    setTimeout(() => {
      this.control.valueAccessor?.registerOnChange(() => {});
    });
  }

  @HostListener('input', ['$event'])
  onInputChange(event: InputEvent) {
    const splitMaskArr = this.inputMask.split('');
    const splitValueArr = (event.target as HTMLInputElement).value.split('');

    for (let index = 0; index < splitMaskArr.length; index++) {
      const char = splitMaskArr[index];

      if (splitValueArr[index] === undefined) {
        continue;
      }

      if (char === '0') {
        const isCharMatch = !!splitValueArr[index].match('[0-9]');

        if (!isCharMatch) {
          let matched = false;

          for (
            let missingIndex = index;
            missingIndex < splitValueArr.length;
            missingIndex++
          ) {
            if (splitValueArr[missingIndex] === undefined) {
              continue;
            }

            const isCharMatch = !!splitValueArr[missingIndex].match('[0-9]');

            if (isCharMatch) {
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
      } else {
        if (splitValueArr[index] === char) {
        } else {
          splitValueArr.splice(index, 0, char);
        }
      }
    }

    const finalSplitValueArr = splitValueArr.splice(0, splitMaskArr.length);

    this.control.control?.setValue(finalSplitValueArr.join(''));
  }
}
