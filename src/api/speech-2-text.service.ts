import { AvailabilityService } from './availability.service';
import { ChromeService } from 'src/api/chrome.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root',
})
export class Speech2TextService {
  private reconigition = new webkitSpeechRecognition();
  private tempWords: string = '';

  private _recording$ = new BehaviorSubject<boolean>(false);
  recording$ = this._recording$.asObservable();

  constructor(
    private chrome: ChromeService,
    private availability: AvailabilityService
  ) {}

  init(): void {
    this.reconigition.interimResults = true;
    this.reconigition.addEventListener('result', ({ results }: any) =>
      this.mapSpeechResults(Array.from(results))
    );
  }

  start(lang = navigator.language): void {
    this.chrome.sendMessage({ sender: 'IDIOMA', text: lang });
    this.reconigition.lang = lang;
    this.recording = true;
    this.reconigition.start();
    this.reconigition.addEventListener('end', (e: any) => {
      if (!this._recording$.value) this.stop();
      else this.transcribe();
    });
  }

  stop(): void {
    this.recording = false;
    this.reconigition.stop();
  }

  private mapSpeechResults(results: SpeechRecognitionResult[]): void {
    this.tempWords = results
      .map((result: SpeechRecognitionResult) => result[0]?.transcript)
      .join('');
  }

  private transcribe(): void {
    this.wordConcat();
    this.stop();
  }

  private wordConcat(): void {
    if (this.tempWords?.length) {
      this.availability.writting = true;
      this.chrome.sendMessage({ sender: 'extension', text: this.tempWords });
    }
    this.tempWords = '';
  }

  private set recording(value: boolean) {
    this._recording$.next(value);
    this.chrome.sendMessage({ sender: 'icon', text: value ? '-l' : '' });
  }
}
