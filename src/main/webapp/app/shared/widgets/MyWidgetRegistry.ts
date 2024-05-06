import { DefaultWidgetRegistry } from 'ngx-schema-form';
import { ButtonWidget } from './button.widget';

export class MyWidgetRegistry extends DefaultWidgetRegistry {
  constructor() {
    super();
    this.register('button', ButtonWidget);
  }
}
