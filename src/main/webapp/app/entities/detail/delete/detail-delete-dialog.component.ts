import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IDetail } from '../detail.model';
import { DetailService } from '../service/detail.service';

@Component({
  standalone: true,
  templateUrl: './detail-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class DetailDeleteDialogComponent {
  detail?: IDetail;

  protected detailService = inject(DetailService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.detailService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
