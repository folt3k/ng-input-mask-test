import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideNgxMask, NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputMaskDirective } from './directives/input-mask/input-mask.directive';

@NgModule({
  declarations: [AppComponent, InputMaskDirective],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [provideNgxMask()],
  bootstrap: [AppComponent],
})
export class AppModule {}
