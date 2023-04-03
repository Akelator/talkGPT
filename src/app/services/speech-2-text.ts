import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AvailabilityService, ChromeService } from ".";

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: "root",
})
export class Speech2TextService {
  private reconigition = new webkitSpeechRecognition();
  private chatText: string = "";
  private _recording$ = new BehaviorSubject<boolean>(false);

  recording$ = this._recording$.asObservable();

  constructor(private chrome: ChromeService, private availability: AvailabilityService) {}

  init(): void {
    this.reconigition.interimResults = true;
    this.reconigition.addEventListener("result", ({ results }: any) => this.mapSpeechResults(Array.from(results)));
  }

  start(lang = navigator.language): void {
    this.chrome.sendMessage({ type: "IDIOMA", text: lang });
    this.reconigition.lang = lang;
    this.recording = true;
    this.reconigition.start();
    this.reconigition.addEventListener("end", (e: any) => {
      if (this._recording$.value) this.sendText();
      this.stop();
    });
  }

  stop(): void {
    this.recording = false;
    this.reconigition.stop();
  }

  private mapSpeechResults(results: SpeechRecognitionResult[]): void {
    this.chatText = results.map((result: SpeechRecognitionResult) => result[0]?.transcript).join("");
  }

  private sendText(): void {
    if (this.chatText?.length) {
      this.availability.writting = true;
      this.chrome.sendMessage({ type: "extension", text: this.chatText });
    }
    this.chatText = "";
  }

  private set recording(value: boolean) {
    this._recording$.next(value);
    this.chrome.sendMessage({ type: "icon", text: value ? "-l" : "" });
  }
}
