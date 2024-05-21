import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { RedeemStatus } from 'app/entities/enumerations/redeem-status.model';
import { RedeemService } from '../service/redeem.service';
import { IRedeem } from '../redeem.model';
import { RedeemFormService, RedeemFormGroup } from './redeem-form.service';

@Component({
  standalone: true,
  selector: 'jhi-redeem-update',
  templateUrl: './redeem-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class RedeemUpdateComponent implements OnInit {
  isSaving = false;
  redeem: IRedeem | null = null;
  redeemStatusValues = Object.keys(RedeemStatus);

  usersSharedCollection: IUser[] = [];

  protected redeemService = inject(RedeemService);
  protected redeemFormService = inject(RedeemFormService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: RedeemFormGroup = this.redeemFormService.createRedeemFormGroup();

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ redeem }) => {
      this.redeem = redeem;
      if (redeem) {
        this.updateForm(redeem);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const redeem = this.redeemFormService.getRedeem(this.editForm);
    if (redeem.id !== null) {
      this.subscribeToSaveResponse(this.redeemService.update(redeem));
    } else {
      this.subscribeToSaveResponse(this.redeemService.create(redeem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRedeem>>): void {
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

  protected updateForm(redeem: IRedeem): void {
    this.redeem = redeem;
    this.redeemFormService.resetForm(this.editForm, redeem);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, redeem.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.redeem?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
