/* eslint-disable */
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ControlWidget } from 'ngx-schema-form';
import { CommonModule } from '@angular/common';
import 'deep-chat';

@Component({
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'sf-chat-widget',
  templateUrl: 'chat.widget.html',
  imports: [CommonModule],
})
export class ChatWidget extends ControlWidget {}
