import { Component } from '@angular/core';

@Component({
  selector: 'sf-button-widget',
  template: '<br /> <button class="btn btn-secondary me-2 float-end" (click)="button.action($event)">{{button.label}}</button>',
})
export class ButtonWidget {
  button: any;
}
