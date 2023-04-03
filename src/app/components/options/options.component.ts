import { Component } from "@angular/core";

@Component({
  selector: "app-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"],
})
export class OptionsComponent {
  auto: boolean = true;

  constructor() {
    const storage = window.localStorage.getItem("auto-listen");
    this.auto = storage === "true";
  }

  setAuto(value: boolean): void {
    this.auto = value;
    window.localStorage.setItem("auto-listen", this.auto.toString());
  }
}
