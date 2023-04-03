import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss'],
})
export class CheckComponent {
  @Input() label: string = 'Label';
  @Input() checked: boolean = false;
  @Output() checkedChange = new EventEmitter<boolean>();
  constructor() {}
}
