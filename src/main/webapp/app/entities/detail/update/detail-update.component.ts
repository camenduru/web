import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccountService } from 'app/core/auth/account.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { IDetail } from '../detail.model';
import { DetailService } from '../service/detail.service';
import { DetailFormService, DetailFormGroup } from './detail-form.service';

@Component({
  standalone: true,
  selector: 'jhi-detail-update',
  templateUrl: './detail-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, HasAnyAuthorityDirective],
})
export class DetailUpdateComponent implements OnInit {
  isSaving = false;
  detail: IDetail | null = null;

  usersSharedCollection: IUser[] = [];

  protected detailService = inject(DetailService);
  protected detailFormService = inject(DetailFormService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);
  protected accountService = inject(AccountService);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: DetailFormGroup = this.detailFormService.createDetailFormGroup();

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ detail }) => {
      this.detail = detail;
      if (detail) {
        this.updateForm(detail);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const detail = this.detailFormService.getDetail(this.editForm);
    if (!this.accountService.hasAnyAuthority('ROLE_ADMIN')) {
      detail.user = {} as IUser;
      detail.login = 'detail.login';
      detail.total = 'detail.total';
    }
    if (detail.id !== null) {
      this.subscribeToSaveResponse(this.detailService.update(detail));
    } else {
      this.subscribeToSaveResponse(this.detailService.create(detail));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDetail>>): void {
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

  protected updateForm(detail: IDetail): void {
    this.detail = detail;
    this.detailFormService.resetForm(this.editForm, detail);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, detail.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.detail?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
