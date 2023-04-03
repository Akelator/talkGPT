import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { ButtonsComponent } from "./components/buttons/buttons.component";
import { CheckComponent } from "./components/check/check.component";
import { OptionsComponent } from "./components/options/options.component";
import { WaveformComponent } from "./components/waveform/waveform.component";
import { ContentComponent } from "./components/content/content.component";

@NgModule({
  declarations: [WaveformComponent, ButtonsComponent, OptionsComponent, CheckComponent, ContentComponent],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [ContentComponent],
})
export class AppModule {}
