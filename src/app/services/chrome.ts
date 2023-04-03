import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

declare const chrome: any;

@Injectable({
  providedIn: "root",
})
export class ChromeService {
  private _response$ = new BehaviorSubject<string | undefined>(undefined);
  private _isChat$ = new BehaviorSubject<boolean>(false);

  response$ = this._response$.asObservable();
  isChat$ = this._isChat$.asObservable();

  constructor() {
    this.listenMessages();
  }

  sendMessage(message: { type: string; text: string }): void {
    chrome?.runtime?.sendMessage(message);
  }

  private listenMessages(): void {
    chrome?.runtime?.onMessage.addListener((message: any) => {
      if (message.type === "voice") this._response$.next(message.text);
      if (message.type === "is-chat") this._isChat$.next(message.text);
    });
  }
}
