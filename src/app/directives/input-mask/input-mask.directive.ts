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

    splitMaskArr.forEach((char, index) => {
      if (splitValueArr[index] === undefined) {
        return;
      }
      if (char === '0') {
        const isCharMatch = !!splitValueArr[index].match('[0-9]');

        if (!isCharMatch) {
          splitValueArr.splice(index, 1);
        }
      } else {
        if (splitValueArr[index] === char) {
        } else {
          splitValueArr.splice(index, 0, char);
          splitValueArr.splice(index + 1, 0, splitValueArr[index]);
        }
      }
    });

    const finalSplitValueArr = splitValueArr.splice(0, splitMaskArr.length);
    console.log(finalSplitValueArr);

    this.control.control?.setValue(finalSplitValueArr.join(''));
  }
}
