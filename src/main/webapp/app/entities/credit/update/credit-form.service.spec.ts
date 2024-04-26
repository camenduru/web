import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../credit.test-samples';

import { CreditFormService } from './credit-form.service';

describe('Credit Form Service', () => {
  let service: CreditFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditFormService);
  });

  describe('Service methods', () => {
    describe('createCreditFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCreditFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            status: expect.any(Object),
            amount: expect.any(Object),
            source: expect.any(Object),
            total: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });

      it('passing ICredit should create a new form with FormGroup', () => {
        const formGroup = service.createCreditFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            status: expect.any(Object),
            amount: expect.any(Object),
            source: expect.any(Object),
            total: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });
    });

    describe('getCredit', () => {
      it('should return NewCredit for default Credit initial value', () => {
        const formGroup = service.createCreditFormGroup(sampleWithNewData);

        const credit = service.getCredit(formGroup) as any;

        expect(credit).toMatchObject(sampleWithNewData);
      });

      it('should return NewCredit for empty Credit initial value', () => {
        const formGroup = service.createCreditFormGroup();

        const credit = service.getCredit(formGroup) as any;

        expect(credit).toMatchObject({});
      });

      it('should return ICredit', () => {
        const formGroup = service.createCreditFormGroup(sampleWithRequiredData);

        const credit = service.getCredit(formGroup) as any;

        expect(credit).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICredit should not enable id FormControl', () => {
        const formGroup = service.createCreditFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCredit should disable id FormControl', () => {
        const formGroup = service.createCreditFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
