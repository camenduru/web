import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IDetail } from '../detail.model';

@Component({
  standalone: true,
  selector: 'jhi-detail-detail',
  templateUrl: './detail-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class DetailDetailComponent {
  detail = input<IDetail | null>(null);

  previousState(): void {
    window.history.back();
  }
}
