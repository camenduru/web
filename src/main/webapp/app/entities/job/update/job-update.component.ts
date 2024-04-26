import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { JobStatus } from 'app/entities/enumerations/job-status.model';
import { JobSource } from 'app/entities/enumerations/job-source.model';
import { JobService } from '../service/job.service';
import { IJob } from '../job.model';
import { JobFormService, JobFormGroup } from './job-form.service';

@Component({
  standalone: true,
  selector: 'jhi-job-update',
  templateUrl: './job-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class JobUpdateComponent implements OnInit {
  isSaving = false;
  job: IJob | null = null;
  jobStatusValues = Object.keys(JobStatus);
  jobSourceValues = Object.keys(JobSource);

  usersSharedCollection: IUser[] = [];

  protected jobService = inject(JobService);
  protected jobFormService = inject(JobFormService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: JobFormGroup = this.jobFormService.createJobFormGroup();

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ job }) => {
      this.job = job;
      if (job) {
        this.updateForm(job);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const job = this.jobFormService.getJob(this.editForm);
    if (job.id !== null) {
      this.subscribeToSaveResponse(this.jobService.update(job));
    } else {
      this.subscribeToSaveResponse(this.jobService.create(job));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJob>>): void {
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

  protected updateForm(job: IJob): void {
    this.job = job;
    this.jobFormService.resetForm(this.editForm, job);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, job.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.job?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
