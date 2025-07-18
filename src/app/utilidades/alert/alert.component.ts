import { Component, EventEmitter, Input, Output } from '@angular/core';

export enum AlertaTipo {
  save = 'save',
  edit = 'edit',
  delete = 'delete',
  error = 'error',
  none = 'none',
}

@Component({
  selector: 'app-alert',
  templateUrl: 'alert.component.html',
  styles: [],
})
export class AlertComponent {
  @Input() alertaTipo!: AlertaTipo;
  @Input() alertaMessage: string = '';

  @Output() close = new EventEmitter<void>();
}
