/* eslint-disable */
import { Component } from '@angular/core';
import { ControlWidget } from 'ngx-schema-form';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'sf-readme-widget',
  templateUrl: 'readme.widget.html',
  imports: [CommonModule],
})
export class ReadmeWidget extends ControlWidget {}
