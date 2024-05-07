import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../type.test-samples';

import { TypeFormService } from './type-form.service';

describe('Type Form Service', () => {
  let service: TypeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeFormService);
  });

  describe('Service methods', () => {
    describe('createTypeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTypeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            amount: expect.any(Object),
            schema: expect.any(Object),
            model: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            image: expect.any(Object),
            readme: expect.any(Object),
            web: expect.any(Object),
            paper: expect.any(Object),
            code: expect.any(Object),
            jupyter: expect.any(Object),
            isDefault: expect.any(Object),
            isActive: expect.any(Object),
          }),
        );
      });

      it('passing IType should create a new form with FormGroup', () => {
        const formGroup = service.createTypeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            amount: expect.any(Object),
            schema: expect.any(Object),
            model: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            image: expect.any(Object),
            readme: expect.any(Object),
            web: expect.any(Object),
            paper: expect.any(Object),
            code: expect.any(Object),
            jupyter: expect.any(Object),
            isDefault: expect.any(Object),
            isActive: expect.any(Object),
          }),
        );
      });
    });

    describe('getType', () => {
      it('should return NewType for default Type initial value', () => {
        const formGroup = service.createTypeFormGroup(sampleWithNewData);

        const type = service.getType(formGroup) as any;

        expect(type).toMatchObject(sampleWithNewData);
      });

      it('should return NewType for empty Type initial value', () => {
        const formGroup = service.createTypeFormGroup();

        const type = service.getType(formGroup) as any;

        expect(type).toMatchObject({});
      });

      it('should return IType', () => {
        const formGroup = service.createTypeFormGroup(sampleWithRequiredData);

        const type = service.getType(formGroup) as any;

        expect(type).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IType should not enable id FormControl', () => {
        const formGroup = service.createTypeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewType should disable id FormControl', () => {
        const formGroup = service.createTypeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
