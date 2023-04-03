import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { Observable, skip } from 'rxjs';
import { ChromeService } from 'src/api/chrome.service';

import { AvailabilityService } from './../api/availability.service';
import { Speech2TextService } from './../api/speech-2-text.service';
import { Text2SpeechService } from './../api/text-2-speech.service';

declare const chrome: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private sub0: any;
  private sub1: any;
  private sub2: any;
  private sub3: any;
  private sub4: any;
  private isChat$?: Observable<boolean>;
  private response$?: Observable<string | undefined>;
  private recording$?: Observable<boolean>;
  private writting$?: Observable<boolean>;
  private speaking$?: Observable<boolean>;
  isChat: boolean = false;
  response: string = '';
  recording: boolean = false;
  writting: boolean = true;
  speaking: boolean = false;

  optionsOpened: boolean = false;

  private autoListen: boolean = false;

  constructor(
    private speech2Text: Speech2TextService,
    private chrome: ChromeService,
    private text2Speech: Text2SpeechService,
    private availability: AvailabilityService,
    private cdr: ChangeDetectorRef
  ) {
    this.chrome.sendMessage({ sender: 'ask-location', text: '' });
    this.speech2Text.init();
    this.isChat$ = this.chrome.isChat$;
    this.response$ = this.chrome.response$;
    this.recording$ = this.speech2Text.recording$;
    this.writting$ = this.availability.writting$;
    this.speaking$ = this.availability.speaking$;
  }

  ngAfterViewInit(): void {
    window.addEventListener('blur', () => {
      this.chrome.sendMessage({ sender: 'icon', text: '-r' });
    });
    this.sub0 = this.isChat$?.pipe(skip(1)).subscribe((isChat: boolean) => {
      this.isChat = isChat;
      if (this.isChat) this.chrome.sendMessage({ sender: 'icon', text: '' });
      else this.chrome.sendMessage({ sender: 'icon', text: '-r' });
      this.cdr.detectChanges();
    });
    this.sub1 = this.response$?.subscribe((response) => {
      if (response) this.text2Speech.speak(response);
    });
    this.sub2 = this.recording$?.subscribe((recording: boolean) => {
      this.recording = recording;
      this.cdr.detectChanges();
    });
    this.sub3 = this.writting$?.subscribe((writting: boolean) => {
      this.writting = writting;
      this.cdr.detectChanges();
    });
    this.sub4 = this.speaking$?.pipe(skip(1)).subscribe((speaking: boolean) => {
      this.speaking = speaking;
      if (!this.speaking) this.autoStart();
      this.cdr.detectChanges();
    });
    this.checkAuto();
  }

  start(): void {
    if (this.recording || this.writting || this.speaking) return;
    this.speech2Text.start();
  }

  toggleOptions(): void {
    this.optionsOpened = !this.optionsOpened;
    this.cdr.detectChanges();
    if (!this.optionsOpened) this.checkAuto();
  }

  ngOnDestroy(): void {
    if (this.sub0) this.sub0.unsubscribe();
    if (this.sub1) this.sub1.unsubscribe();
    if (this.sub2) this.sub2.unsubscribe();
    if (this.sub3) this.sub3.unsubscribe();
    if (this.sub4) this.sub4.unsubscribe();
  }

  private checkAuto(): void {
    if (!this.recording && !this.writting && !this.speaking) this.autoStart();
    if (this.autoListen && this.recording) this.speech2Text.stop();
  }

  private autoStart(): void {
    setTimeout(() => {
      if (!this.isChat) return;
      const storage = window.localStorage.getItem('auto-listen');
      this.autoListen = storage === 'true';
      if (this.autoListen) this.start();
    }, 100);
  }
}
