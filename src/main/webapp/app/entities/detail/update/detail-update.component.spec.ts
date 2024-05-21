import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { DetailService } from '../service/detail.service';
import { IDetail } from '../detail.model';
import { DetailFormService } from './detail-form.service';

import { DetailUpdateComponent } from './detail-update.component';

import { TranslateModule, TranslateService, MissingTranslationHandler } from '@ngx-translate/core';
import { missingTranslationHandler } from 'app/config/translation.config';

describe('Detail Management Update Component', () => {
  let comp: DetailUpdateComponent;
  let fixture: ComponentFixture<DetailUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let detailFormService: DetailFormService;
  let detailService: DetailService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        DetailUpdateComponent,
        TranslateModule.forRoot({
          missingTranslationHandler: {
            provide: MissingTranslationHandler,
            useFactory: missingTranslationHandler,
          },
        }),
      ],
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
      .overrideTemplate(DetailUpdateComponent, '')
      .compileComponents();
    const translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');

    fixture = TestBed.createComponent(DetailUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    detailFormService = TestBed.inject(DetailFormService);
    detailService = TestBed.inject(DetailService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const detail: IDetail = { id: 'CBA' };
      const user: IUser = { id: '17aa6bdb-98fa-4a87-8e5c-f5bad5e3b6e0' };
      detail.user = user;

      const userCollection: IUser[] = [{ id: '90ed59ae-8691-4f48-8232-172f6b43de8b' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ detail });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const detail: IDetail = { id: 'CBA' };
      const user: IUser = { id: '41bd28ad-51fe-4236-b9a0-285859df038c' };
      detail.user = user;

      activatedRoute.data = of({ detail });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.detail).toEqual(detail);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDetail>>();
      const detail = { id: 'ABC' };
      jest.spyOn(detailFormService, 'getDetail').mockReturnValue(detail);
      jest.spyOn(detailService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ detail });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: detail }));
      saveSubject.complete();

      // THEN
      expect(detailFormService.getDetail).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(detailService.update).toHaveBeenCalledWith(expect.objectContaining(detail));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDetail>>();
      const detail = { id: 'ABC' };
      jest.spyOn(detailFormService, 'getDetail').mockReturnValue({ id: null });
      jest.spyOn(detailService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ detail: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: detail }));
      saveSubject.complete();

      // THEN
      expect(detailFormService.getDetail).toHaveBeenCalled();
      expect(detailService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDetail>>();
      const detail = { id: 'ABC' };
      jest.spyOn(detailService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ detail });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(detailService.update).toHaveBeenCalled();
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
  });
});
