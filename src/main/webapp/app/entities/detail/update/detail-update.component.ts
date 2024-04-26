import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IDetail } from '../detail.model';
import { DetailService } from '../service/detail.service';
import { DetailFormService, DetailFormGroup } from './detail-form.service';

@Component({
  standalone: true,
  selector: 'jhi-detail-update',
  templateUrl: './detail-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class DetailUpdateComponent implements OnInit {
  isSaving = false;
  detail: IDetail | null = null;

  protected detailService = inject(DetailService);
  protected detailFormService = inject(DetailFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: DetailFormGroup = this.detailFormService.createDetailFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ detail }) => {
      this.detail = detail;
      if (detail) {
        this.updateForm(detail);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const detail = this.detailFormService.getDetail(this.editForm);
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
  }
}
