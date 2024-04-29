import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { TypeService } from '../service/type.service';
import { IType } from '../type.model';
import { TypeFormService } from './type-form.service';

import { TypeUpdateComponent } from './type-update.component';

describe('Type Management Update Component', () => {
  let comp: TypeUpdateComponent;
  let fixture: ComponentFixture<TypeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let typeFormService: TypeFormService;
  let typeService: TypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TypeUpdateComponent],
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
      .overrideTemplate(TypeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    typeFormService = TestBed.inject(TypeFormService);
    typeService = TestBed.inject(TypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const type: IType = { id: 'CBA' };

      activatedRoute.data = of({ type });
      comp.ngOnInit();

      expect(comp.type).toEqual(type);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IType>>();
      const type = { id: 'ABC' };
      jest.spyOn(typeFormService, 'getType').mockReturnValue(type);
      jest.spyOn(typeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ type });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: type }));
      saveSubject.complete();

      // THEN
      expect(typeFormService.getType).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(typeService.update).toHaveBeenCalledWith(expect.objectContaining(type));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IType>>();
      const type = { id: 'ABC' };
      jest.spyOn(typeFormService, 'getType').mockReturnValue({ id: null });
      jest.spyOn(typeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ type: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: type }));
      saveSubject.complete();

      // THEN
      expect(typeFormService.getType).toHaveBeenCalled();
      expect(typeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IType>>();
      const type = { id: 'ABC' };
      jest.spyOn(typeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ type });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(typeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
