import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { CreditStatus } from 'app/entities/enumerations/credit-status.model';
import { CreditSource } from 'app/entities/enumerations/credit-source.model';
import { CreditService } from '../service/credit.service';
import { ICredit } from '../credit.model';
import { CreditFormService, CreditFormGroup } from './credit-form.service';

@Component({
  standalone: true,
  selector: 'jhi-credit-update',
  templateUrl: './credit-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CreditUpdateComponent implements OnInit {
  isSaving = false;
  credit: ICredit | null = null;
  creditStatusValues = Object.keys(CreditStatus);
  creditSourceValues = Object.keys(CreditSource);

  usersSharedCollection: IUser[] = [];

  protected creditService = inject(CreditService);
  protected creditFormService = inject(CreditFormService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CreditFormGroup = this.creditFormService.createCreditFormGroup();

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ credit }) => {
      this.credit = credit;
      if (credit) {
        this.updateForm(credit);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const credit = this.creditFormService.getCredit(this.editForm);
    if (credit.id !== null) {
      this.subscribeToSaveResponse(this.creditService.update(credit));
    } else {
      this.subscribeToSaveResponse(this.creditService.create(credit));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICredit>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(credit: ICredit): void {
    this.credit = credit;
    this.creditFormService.resetForm(this.editForm, credit);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, credit.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.credit?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
