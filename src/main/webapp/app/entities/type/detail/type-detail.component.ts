import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IType } from '../type.model';

@Component({
  standalone: true,
  selector: 'jhi-type-detail',
  templateUrl: './type-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class TypeDetailComponent {
  type = input<IType | null>(null);

  previousState(): void {
    window.history.back();
  }
}
