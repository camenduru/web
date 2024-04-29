import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IType } from '../type.model';
import { TypeService } from '../service/type.service';

@Component({
  standalone: true,
  templateUrl: './type-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TypeDeleteDialogComponent {
  type?: IType;

  protected typeService = inject(TypeService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.typeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
