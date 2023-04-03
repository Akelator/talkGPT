import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ButtonsComponent } from './components/buttons/buttons.component';
import { CheckComponent } from './components/check/check.component';
import { OptionsComponent } from './components/options/options.component';
import { WaveformComponent } from './components/waveform/waveform.component';

@NgModule({
  declarations: [
    AppComponent,
    WaveformComponent,
    ButtonsComponent,
    OptionsComponent,
    CheckComponent,
  ],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
