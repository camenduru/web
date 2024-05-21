import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IRedeem } from '../redeem.model';

@Component({
  standalone: true,
  selector: 'jhi-redeem-detail',
  templateUrl: './redeem-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class RedeemDetailComponent {
  redeem = input<IRedeem | null>(null);

  previousState(): void {
    window.history.back();
  }
}
