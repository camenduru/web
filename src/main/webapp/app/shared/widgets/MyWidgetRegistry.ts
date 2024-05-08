import { DefaultWidgetRegistry } from 'ngx-schema-form';
import { ButtonWidget } from './button.widget';
import { ReadmeWidget } from './readme.widget';

export class MyWidgetRegistry extends DefaultWidgetRegistry {
  constructor() {
    super();
    this.register('button', ButtonWidget);
    this.register('readme', ReadmeWidget);
  }
}
