import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WaveformComponent } from './components/waveform/waveform.component';
import { ButtonsComponent } from './components/buttons/buttons.component';
import { OptionsComponent } from './components/options/options.component';
import { CheckComponent } from './components/check/check.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    WaveformComponent,
    ButtonsComponent,
    OptionsComponent,
    CheckComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
