import { Component, NgZone, inject, signal, OnInit, OnDestroy } from '@angular/core';
import {
  MasonryLayoutBreakpointsMap,
  unmatchedBreakpointKey,
  MasonryLayoutContainerComponent,
} from '../shared/masonry/masonry-layout-container.component';
import { Breakpoints } from '@angular/cdk/layout';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { ItemCountComponent } from 'app/shared/pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';

import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { IJob } from '../entities/job/job.model';
import { EntityArrayResponseType, JobService } from '../entities/job/service/job.service';
import { JobFormService, JobFormGroup } from '../entities/job/update/job-form.service';
import { UserService } from '../entities/user/service/user.service';
import { JobStatus } from '../entities/enumerations/job-status.model';
import { JobSource } from '../entities/enumerations/job-source.model';

@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ItemCountComponent,
    HasAnyAuthorityDirective,
    MasonryLayoutContainerComponent,
  ],
})
export default class HomeComponent implements OnInit, OnDestroy {
  isSaving = false;
  subscription: Subscription | null = null;
  account = signal<Account | null>(null);
  jobs?: IJob[];
  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;
  isLoading = false;
  sortState = sortStateSignal({});

  readonly masonryLayoutBreakpointsMap: MasonryLayoutBreakpointsMap = {
    [Breakpoints.XSmall]: 1,
    [Breakpoints.Small]: 2,
    [Breakpoints.Medium]: 2,
    [Breakpoints.Large]: 3,
    [unmatchedBreakpointKey]: 4,
  };

  protected jobFormService = inject(JobFormService);
  protected jobService = inject(JobService);
  protected sortService = inject(SortService);
  protected activatedRoute = inject(ActivatedRoute);
  protected ngZone = inject(NgZone);
  protected userService = inject(UserService);

  private readonly destroy$ = new Subject<void>();
  private accountService = inject(AccountService);
  private router = inject(Router);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: JobFormGroup = this.jobFormService.createJobFormGroup();

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const job = this.jobFormService.getJob(this.editForm);
    job.type = 'sdxl';
    job.amount = '1';
    job.sourceChannel = '1234257765258494003';
    job.sourceId = '616280178288623619';
    job.status = JobStatus.WAITING;
    job.result = this.account()?.login;
    job.source = JobSource.WEB;
    if (job.id !== null) {
      this.subscribeToSaveResponse(this.jobService.update(job));
    } else {
      this.subscribeToSaveResponse(this.jobService.create(job));
    }
  }

  trackId = (_index: number, item: IJob): string => this.jobService.getJobIdentifier(item);

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => this.account.set(account));
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => this.load()),
      )
      .subscribe();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(this.page, event);
  }

  navigateToPage(page: number): void {
    this.handleNavigation(page, this.sortState());
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const page = params.get(PAGE_HEADER);
    this.page = +(page ?? 1);
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.jobs = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: IJob[] | null): IJob[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    const { page } = this;

    this.isLoading = true;
    const pageToLoad: number = page;
    const queryObject: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      eagerload: true,
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.jobService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page: number, sortState: SortState): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: this.sortService.buildSortParam(sortState),
    };

    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
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
}
