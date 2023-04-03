import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { skip } from "rxjs";

import { AvailabilityService, ChromeService, Speech2TextService, SubSink, Text2SpeechService } from "../../services";

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.scss"],
})
export class ContentComponent implements AfterViewInit, OnDestroy {
  private _sub = new SubSink();

  isChat: boolean = true;
  response: string = "";
  recording: boolean = false;
  writting: boolean = true;
  speaking: boolean = false;

  optionsOpened: boolean = false;

  private autoListen: boolean = false;

  constructor(private speech2Text: Speech2TextService, private chrome: ChromeService, private text2Speech: Text2SpeechService, private availability: AvailabilityService, private cdr: ChangeDetectorRef) {
    this.chrome.sendMessage({ type: "ask-location", text: "" });
    this.speech2Text.init();
  }

  ngAfterViewInit(): void {
    this.subscriptions();
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
    this._sub.unsubscribe();
  }

  private subscriptions(): void {
    window.addEventListener("blur", () => {
      this.chrome.sendMessage({ type: "icon", text: "-r" });
    });
    this._sub.sink = this.chrome.isChat$?.pipe(skip(1)).subscribe((isChat: boolean) => {
      this.isChat = isChat;
      if (this.isChat) this.chrome.sendMessage({ type: "icon", text: "" });
      else this.chrome.sendMessage({ type: "icon", text: "-r" });
      this.cdr.detectChanges();
    });
    this._sub.sink = this.chrome.response$?.subscribe((response: string | undefined) => {
      if (response) this.text2Speech.speak(response);
    });
    this._sub.sink = this.speech2Text.recording$?.subscribe((recording: boolean) => {
      this.recording = recording;
      this.cdr.detectChanges();
    });
    this._sub.sink = this.availability.writting$?.subscribe((writting: boolean) => {
      this.writting = writting;
      this.cdr.detectChanges();
    });
    this._sub.sink = this.availability.speaking$?.pipe(skip(1)).subscribe((speaking: boolean) => {
      this.speaking = speaking;
      if (!this.speaking) this.autoStart();
      this.cdr.detectChanges();
    });
  }

  private checkAuto(): void {
    if (!this.recording && !this.writting && !this.speaking) this.autoStart();
    if (this.autoListen && this.recording) this.speech2Text.stop();
  }

  private autoStart(): void {
    setTimeout(() => {
      if (!this.isChat) return;
      const storage = window.localStorage.getItem("auto-listen");
      this.autoListen = storage === "true";
      if (this.autoListen) this.start();
    }, 100);
  }
}
