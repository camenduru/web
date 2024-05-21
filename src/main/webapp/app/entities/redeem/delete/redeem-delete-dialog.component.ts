import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IRedeem } from '../redeem.model';
import { RedeemService } from '../service/redeem.service';

@Component({
  standalone: true,
  templateUrl: './redeem-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class RedeemDeleteDialogComponent {
  redeem?: IRedeem;

  protected redeemService = inject(RedeemService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.redeemService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
