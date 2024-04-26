import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IJob } from '../job.model';

@Component({
  standalone: true,
  selector: 'jhi-job-detail',
  templateUrl: './job-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class JobDetailComponent {
  job = input<IJob | null>(null);

  previousState(): void {
    window.history.back();
  }
}
