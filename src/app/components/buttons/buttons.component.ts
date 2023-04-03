import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss'],
})
export class ButtonsComponent {
  @Input() recording: boolean = false;
  @Input() writting: boolean = false;
  @Input() speaking: boolean = false;

  @Output() start = new EventEmitter<null>();

  onStart(): void {
    this.start.emit();
  }
}
