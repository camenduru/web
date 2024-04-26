import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICredit } from '../credit.model';
import { CreditService } from '../service/credit.service';

@Component({
  standalone: true,
  templateUrl: './credit-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CreditDeleteDialogComponent {
  credit?: ICredit;

  protected creditService = inject(CreditService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.creditService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
