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
    let maskedInputValue = '';
    const splitMaskArr = this.inputMask.split('');

    (event.target as HTMLInputElement).value
      .split('')
      .forEach((char, index) => {
        if (splitMaskArr[index] === undefined) {
          return;
        }
        if (splitMaskArr[index] === '0') {
          const isCharMatch = !!char.match('[0-9]');

          if (isCharMatch) {
            maskedInputValue = `${maskedInputValue}${char}`;
          }
        } else {
          if (splitMaskArr[index] === char) {
            maskedInputValue = `${maskedInputValue}${char}`;
          } else {
            maskedInputValue = `${maskedInputValue}${splitMaskArr[index]}${char}`;
          }
        }
      });

    this.control.control?.setValue(maskedInputValue);
  }
}
