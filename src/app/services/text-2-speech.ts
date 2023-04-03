import { Injectable } from "@angular/core";

import { AvailabilityService } from ".";

@Injectable({
  providedIn: "root",
})
export class Text2SpeechService {
  private utterance: any;

  constructor(private availability: AvailabilityService) {}

  speak(text: string): void {
    if ("speechSynthesis" in window) {
      this.startSpeech(text);
    } else {
      console.error("tu navegador no es compatible con la API de síntesis de voz.");
    }
  }

  private startSpeech(text: string): void {
    this.availability.speaking = true;
    this.availability.writting = false;
    this.utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(this.utterance);
    this.utterance.onend = () => this.endSpeech();
  }

  private endSpeech(): void {
    this.availability.speaking = false;
  }
}
