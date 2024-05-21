import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../redeem.test-samples';

import { RedeemFormService } from './redeem-form.service';

describe('Redeem Form Service', () => {
  let service: RedeemFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RedeemFormService);
  });

  describe('Service methods', () => {
    describe('createRedeemFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRedeemFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            status: expect.any(Object),
            type: expect.any(Object),
            author: expect.any(Object),
            login: expect.any(Object),
            amount: expect.any(Object),
            code: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });

      it('passing IRedeem should create a new form with FormGroup', () => {
        const formGroup = service.createRedeemFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            status: expect.any(Object),
            type: expect.any(Object),
            author: expect.any(Object),
            login: expect.any(Object),
            amount: expect.any(Object),
            code: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });
    });

    describe('getRedeem', () => {
      it('should return NewRedeem for default Redeem initial value', () => {
        const formGroup = service.createRedeemFormGroup(sampleWithNewData);

        const redeem = service.getRedeem(formGroup) as any;

        expect(redeem).toMatchObject(sampleWithNewData);
      });

      it('should return NewRedeem for empty Redeem initial value', () => {
        const formGroup = service.createRedeemFormGroup();

        const redeem = service.getRedeem(formGroup) as any;

        expect(redeem).toMatchObject({});
      });

      it('should return IRedeem', () => {
        const formGroup = service.createRedeemFormGroup(sampleWithRequiredData);

        const redeem = service.getRedeem(formGroup) as any;

        expect(redeem).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRedeem should not enable id FormControl', () => {
        const formGroup = service.createRedeemFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRedeem should disable id FormControl', () => {
        const formGroup = service.createRedeemFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
