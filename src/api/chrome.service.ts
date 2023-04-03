import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare const chrome: any;

@Injectable({
  providedIn: 'root',
})
export class ChromeService {
  _response$ = new BehaviorSubject<string | undefined>(undefined);
  response$ = this._response$.asObservable();

  _isChat$ = new BehaviorSubject<boolean>(false);
  isChat$ = this._isChat$.asObservable();

  constructor() {
    this.listenChatResponses();
  }

  sendMessage(message: { sender: string; text: string }): void {
    chrome?.runtime?.sendMessage(message);
  }

  listenChatResponses(): void {
    chrome?.runtime?.onMessage.addListener((message: any) => {
      if (message.sender === 'voice') this._response$.next(message.text);
      if (message.sender === 'is-chat') this._isChat$.next(message.text);
    });
  }
}
