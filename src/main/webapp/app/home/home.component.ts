import { Component, NgZone, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, Observable, Subscription, tap } from 'rxjs';
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
import { SORT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { IJob } from '../entities/job/job.model';
import { EntityArrayResponseType as JobEntityArrayResponseType, JobService } from '../entities/job/service/job.service';
import { IType } from '../entities/type/type.model';
import { EntityArrayResponseType as TypeEntityArrayResponseType, TypeService } from '../entities/type/service/type.service';
import { JobFormService, JobFormGroup } from '../entities/job/update/job-form.service';
import { UserService } from '../entities/user/service/user.service';
import { JobStatus } from '../entities/enumerations/job-status.model';
import { JobSource } from '../entities/enumerations/job-source.model';
import { ISchema, TemplateSchemaModule } from 'ngx-schema-form';
import dayjs from 'dayjs/esm';
import { TrackerService } from 'app/core/tracker/tracker.service';

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
    TemplateSchemaModule,
  ],
  template:
    '<sf-form [schema]="activeSchema" [model]="activeModel" [actions]="activeActions"></sf-form><sf-form [schema]="passiveSchema" [model]="passiveModel"></sf-form>',
})
export default class HomeComponent implements OnInit, OnDestroy {
  isSaving = false;
  subscription: Subscription | null = null;
  account = signal<Account | null>(null);
  user: Account = {} as Account;
  types?: IType[];
  passiveTypes?: IType[];
  passiveObjects?: any = [];
  jobs?: IJob[];
  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;
  isLoading = false;
  sortState = sortStateSignal({});

  isActive = true;
  activeSchema: ISchema = {};
  activeModel: any = {};
  default_type: any = {};
  default_type_type: any = {};

  horizontal = false;
  percentage = false;
  isEqualSize = false;
  isConstantSize = false;
  gap = 5;
  resizeDebounce = 100;
  maxResizeDebounce = 0;
  autoResize = true;
  useFit = true;
  useTransform = false;
  renderOnPropertyChange = true;
  preserveUIOnDestroy = false;
  defaultDirection = 'end' as const;
  outlineLength = 0;
  outlineSize = 0;
  useRoundedSize = true;
  useResizeObserver = true;
  observeChildren = true;
  align = 'center' as const;

  column = 0;
  columnSize = 0;
  columnSizeRatio = 0;
  contentAlign = 'masonry' as const;
  columnCalculationThreshold = 1;
  maxStretchColumnSize = Infinity;
  // [column]="column"
  // [columnSize]="columnSize"
  // [columnSizeRatio]="columnSizeRatio"
  // [contentAlign]="contentAlign"
  // [columnCalculationThreshold]="columnCalculationThreshold"
  // [maxStretchColumnSize]="maxStretchColumnSize"

  columnRange = [3, 3];
  rowRange = [1, Infinity];
  sizeRange = [0, Infinity];
  displayedRow = -1;
  isCroppedSize = true;
  // [columnRange]="columnRange"
  // [rowRange]="rowRange"
  // [sizeRange]="sizeRange"
  // [displayedRow]="displayedRow"
  // [isCroppedSize]="isCroppedSize"

  aspectRatio = 1;
  sizeWeight = 1;
  ratioWeight = 100;
  weightPriority = 'custom' as const;

  frame = [
    [1, 1, 2, 2],
    [3, 3, 2, 2],
    [4, 4, 4, 5],
  ];
  useFrameFill = false;
  rectSize = 0;

  activeActions = {
    enter: (property: any) => {
      this.isSaving = true;
      const job = this.jobFormService.getJob(this.editForm);
      job.command = JSON.stringify(property.value);
      job.amount = 'job.amount';
      job.sourceChannel = 'job.sourceChannel';
      job.sourceId = 'job.sourceId';
      job.date = dayjs();
      job.status = JobStatus.WAITING;
      job.result = 'job.result';
      job.source = JobSource.WEB;
      job.login = 'job.login';
      if (job.id === null) {
        this.subscribeToSaveResponse(this.jobService.create(job));
      }
    },
  };

  protected jobFormService = inject(JobFormService);
  protected jobService = inject(JobService);
  protected typeService = inject(TypeService);
  protected sortService = inject(SortService);
  protected activatedRoute = inject(ActivatedRoute);
  protected ngZone = inject(NgZone);
  protected userService = inject(UserService);
  protected accountService = inject(AccountService);
  protected router = inject(Router);
  protected trackerService = inject(TrackerService);

  private readonly destroy$ = new Subject<void>();

  public constructor(private http: HttpClient) {
    this.queryTypeBackend().subscribe({
      next: (res: TypeEntityArrayResponseType) => {
        this.onTypeResponseSuccess(res);
      },
    });

    this.trackerService
      .subscribeToNotify('')
      .pipe(
        tap(() => {
          this.load();
        }),
      )
      .subscribe({
        next(message) {
          if (message.includes('insufficient')) {
            const notify = document.getElementById('notify');
            const notifyDivHTML = `
                <div id="notifyDiv" class="alert alert-dismissible alert-warning">
                    <button id="notifyButton" type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    ${message}
                </div>
            `;
            if (notify) {
              notify.innerHTML = notifyDivHTML;
              const notifyButton = document.getElementById('notifyButton');
              if (notifyButton) {
                notifyButton.addEventListener('click', notifyDivRemove);
              }
            }
          }
        },
      });
  }

  changeSchema(event: Event): void {
    const selectedValue = (event.target as HTMLInputElement).value;
    if (this.types && this.types.length > 0) {
      const type = this.types.find(item => item.type === selectedValue);
      const jsonSchema = type?.schema ? JSON.parse(type.schema) : null;
      this.activeSchema = jsonSchema as unknown as ISchema;
      const jsonModel = type?.model ? JSON.parse(type.model) : null;
      this.activeModel = jsonModel;
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: JobFormGroup = this.jobFormService.createJobFormGroup();

  trackId = (_index: number, item: IJob): string => this.jobService.getJobIdentifier(item);

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe({
      next: (user: Account | null) => {
        if (user) {
          this.user = user;
        }
      },
    });
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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  load(): void {
    this.queryJobBackend().subscribe({
      next: (res: JobEntityArrayResponseType) => {
        this.onJobResponseSuccess(res);
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

  protected onJobResponseSuccess(response: JobEntityArrayResponseType): void {
    this.fillComponentAttributesFromJobResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromJobResponseBody(response.body);
    this.jobs = dataFromBody;
  }

  protected fillComponentAttributesFromJobResponseBody(data: IJob[] | null): IJob[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromJobResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected queryJobBackend(): Observable<JobEntityArrayResponseType> {
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

  protected onTypeResponseSuccess(response: TypeEntityArrayResponseType): void {
    this.fillComponentAttributesFromTypeResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromTypeResponseBody(response.body);

    this.types = dataFromBody.filter(item => item.isActive === true).reverse();
    const type = this.types.find(item => item.isDefault === true);
    const jsonSchema = type?.schema ? JSON.parse(type.schema) : null;
    this.activeSchema = jsonSchema as unknown as ISchema;
    const jsonModel = type?.model ? JSON.parse(type.model) : null;
    this.activeModel = jsonModel;
    this.default_type_type = type?.type;

    this.passiveTypes = dataFromBody.reverse();
    this.passiveTypes.forEach(item => {
      const passiveJsonSchema = item.schema ? JSON.parse(item.schema) : null;
      const passiveSchema = passiveJsonSchema as unknown as ISchema;
      const passiveJsonModel = item.model ? JSON.parse(item.model) : null;
      this.passiveObjects.push({ schema: passiveSchema, model: passiveJsonModel });
      this.passiveObjects.sort((a: PassiveObject, b: PassiveObject) => {
        const tagA = a.schema.properties.readme.tags[0];
        const tagB = b.schema.properties.readme.tags[0];
        return tagA.localeCompare(tagB);
      });
    });
  }

  protected fillComponentAttributesFromTypeResponseBody(data: IType[] | null): IType[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromTypeResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected queryTypeBackend(): Observable<TypeEntityArrayResponseType> {
    const { page } = this;

    this.isLoading = true;
    const pageToLoad: number = page;
    const queryObject: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      eagerload: true,
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.typeService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
    this.load();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected download(link: string): void {
    const url = `${link}`;
    window.open(url);
  }
}

interface PassiveObject {
  schema: {
    properties: {
      readme: {
        tags: string[];
      };
    };
  };
}

function notifyDivRemove(): void {
  const notifyDiv = document.getElementById('notifyDiv');
  if (notifyDiv) {
    notifyDiv.remove();
  }
}
