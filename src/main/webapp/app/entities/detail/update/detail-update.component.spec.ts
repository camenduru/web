import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { DetailService } from '../service/detail.service';
import { IDetail } from '../detail.model';
import { DetailFormService } from './detail-form.service';

import { DetailUpdateComponent } from './detail-update.component';

describe('Detail Management Update Component', () => {
  let comp: DetailUpdateComponent;
  let fixture: ComponentFixture<DetailUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let detailFormService: DetailFormService;
  let detailService: DetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DetailUpdateComponent],
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

    fixture = TestBed.createComponent(DetailUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    detailFormService = TestBed.inject(DetailFormService);
    detailService = TestBed.inject(DetailService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const detail: IDetail = { id: 'CBA' };

      activatedRoute.data = of({ detail });
      comp.ngOnInit();

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
});
