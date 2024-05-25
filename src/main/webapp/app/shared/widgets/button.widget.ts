/* eslint-disable */
import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'sf-button-widget',
  templateUrl: 'button.widget.html',
})
export class ButtonWidget implements AfterViewInit {
  button: any;
  formProperty: any;

  ngAfterViewInit(): void {
    const llmButtons = document.querySelectorAll('.llm') as NodeListOf<HTMLButtonElement>;
    if (this.formProperty.findRoot().getProperty('chat')) {
      llmButtons.forEach((button: HTMLButtonElement) => {
        button.style.display = 'none';
      });
    } else {
      llmButtons.forEach((button: HTMLButtonElement) => {
        button.style.display = 'block';
      });
    }
  }
}
