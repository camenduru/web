import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { IDetail } from 'app/entities/detail/detail.model';
import { DetailService } from 'app/entities/detail/service/detail.service';
import { IJob } from '../job.model';
import { JobService } from '../service/job.service';
import { JobFormService } from './job-form.service';

import { JobUpdateComponent } from './job-update.component';

describe('Job Management Update Component', () => {
  let comp: JobUpdateComponent;
  let fixture: ComponentFixture<JobUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let jobFormService: JobFormService;
  let jobService: JobService;
  let userService: UserService;
  let detailService: DetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, JobUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(JobUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JobUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    jobFormService = TestBed.inject(JobFormService);
    jobService = TestBed.inject(JobService);
    userService = TestBed.inject(UserService);
    detailService = TestBed.inject(DetailService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const job: IJob = { id: 'CBA' };
      const user: IUser = { id: '4e721970-f867-4627-bd3d-7265264b9bbf' };
      job.user = user;

      const userCollection: IUser[] = [{ id: '4bb72124-bad9-4848-be96-0bacdcc776d6' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ job });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Detail query and add missing value', () => {
      const job: IJob = { id: 'CBA' };
      const discord: IDetail = { id: 'cf5156f5-cbe0-4d14-8b1f-0dcba1d13cbc' };
      job.discord = discord;
      const total: IDetail = { id: '9a8efb9e-089f-4b7f-8bb3-eb4fe69d1c7d' };
      job.total = total;

      const detailCollection: IDetail[] = [{ id: '0e44c70a-25ae-4f02-8e62-6fe9b479c763' }];
      jest.spyOn(detailService, 'query').mockReturnValue(of(new HttpResponse({ body: detailCollection })));
      const additionalDetails = [discord, total];
      const expectedCollection: IDetail[] = [...additionalDetails, ...detailCollection];
      jest.spyOn(detailService, 'addDetailToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ job });
      comp.ngOnInit();

      expect(detailService.query).toHaveBeenCalled();
      expect(detailService.addDetailToCollectionIfMissing).toHaveBeenCalledWith(
        detailCollection,
        ...additionalDetails.map(expect.objectContaining),
      );
      expect(comp.detailsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const job: IJob = { id: 'CBA' };
      const user: IUser = { id: '75aa936a-ae7a-4886-8d3f-d0c7eab04fc0' };
      job.user = user;
      const discord: IDetail = { id: '06a49775-dd23-4e51-892f-bc6cd19ed866' };
      job.discord = discord;
      const total: IDetail = { id: 'c9716dd6-e024-4520-8ee9-6dc1639957f8' };
      job.total = total;

      activatedRoute.data = of({ job });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.detailsSharedCollection).toContain(discord);
      expect(comp.detailsSharedCollection).toContain(total);
      expect(comp.job).toEqual(job);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJob>>();
      const job = { id: 'ABC' };
      jest.spyOn(jobFormService, 'getJob').mockReturnValue(job);
      jest.spyOn(jobService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ job });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: job }));
      saveSubject.complete();

      // THEN
      expect(jobFormService.getJob).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(jobService.update).toHaveBeenCalledWith(expect.objectContaining(job));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJob>>();
      const job = { id: 'ABC' };
      jest.spyOn(jobFormService, 'getJob').mockReturnValue({ id: null });
      jest.spyOn(jobService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ job: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: job }));
      saveSubject.complete();

      // THEN
      expect(jobFormService.getJob).toHaveBeenCalled();
      expect(jobService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJob>>();
      const job = { id: 'ABC' };
      jest.spyOn(jobService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ job });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(jobService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareDetail', () => {
      it('Should forward to detailService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(detailService, 'compareDetail');
        comp.compareDetail(entity, entity2);
        expect(detailService.compareDetail).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
