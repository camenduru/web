import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IType } from '../type.model';
import { TypeService } from '../service/type.service';
import { TypeFormService, TypeFormGroup } from './type-form.service';

@Component({
  standalone: true,
  selector: 'jhi-type-update',
  templateUrl: './type-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TypeUpdateComponent implements OnInit {
  isSaving = false;
  type: IType | null = null;

  protected typeService = inject(TypeService);
  protected typeFormService = inject(TypeFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TypeFormGroup = this.typeFormService.createTypeFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ type }) => {
      this.type = type;
      if (type) {
        this.updateForm(type);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const type = this.typeFormService.getType(this.editForm);
    if (type.id !== null) {
      this.subscribeToSaveResponse(this.typeService.update(type));
    } else {
      this.subscribeToSaveResponse(this.typeService.create(type));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IType>>): void {
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

  protected updateForm(type: IType): void {
    this.type = type;
    this.typeFormService.resetForm(this.editForm, type);
  }
}
