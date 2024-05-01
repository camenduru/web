import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IDetail } from '../detail.model';

@Component({
  standalone: true,
  selector: 'jhi-detail-detail',
  templateUrl: './detail-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe, HasAnyAuthorityDirective],
})
export class DetailDetailComponent {
  detail = input<IDetail | null>(null);

  previousState(): void {
    window.history.back();
  }
}
