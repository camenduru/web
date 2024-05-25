import { DefaultWidgetRegistry } from 'ngx-schema-form';
import { ButtonWidget } from './button.widget';
import { ReadmeWidget } from './readme.widget';
import { ChatWidget } from './chat.widget';

export class MyWidgetRegistry extends DefaultWidgetRegistry {
  constructor() {
    super();
    this.register('button', ButtonWidget);
    this.register('readme', ReadmeWidget);
    this.register('chat', ChatWidget);
  }
}
