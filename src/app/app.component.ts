import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { InputMaskDirective } from './directives/input-mask/input-mask.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  inputControl = new FormControl('');

  ngOnInit(): void {
    this.inputControl.valueChanges.subscribe((value) => {
      console.log('form value:', value);
    });
  }
}
