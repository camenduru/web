import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ICredit } from '../credit.model';

@Component({
  standalone: true,
  selector: 'jhi-credit-detail',
  templateUrl: './credit-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class CreditDetailComponent {
  credit = input<ICredit | null>(null);

  previousState(): void {
    window.history.back();
  }
}
