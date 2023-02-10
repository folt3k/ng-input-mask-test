import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[inputMask]',
})
export class InputMaskDirective {
  @Input() inputMask: string = '';

  constructor(private inputElementRef: ElementRef) {}

  @HostListener('input', ['$event.target.value'])
  onInputChange(value: string) {
    let maskedInputValue = '';
    const splitMaskArr = this.inputMask.split('');

    value.split('').forEach((char, index) => {
      if (splitMaskArr[index] === undefined) {
        return;
      }
      if (splitMaskArr[index] === '0') {
        const isCharMatch = !!char.match('[a-z0-9]');

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

    console.log(maskedInputValue);
    this.inputElementRef.nativeElement.value = maskedInputValue;
  }
}
