import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../detail.test-samples';

import { DetailFormService } from './detail-form.service';

describe('Detail Form Service', () => {
  let service: DetailFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailFormService);
  });

  describe('Service methods', () => {
    describe('createDetailFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDetailFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            discord: expect.any(Object),
            sourceId: expect.any(Object),
            sourceChannel: expect.any(Object),
            total: expect.any(Object),
            login: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });

      it('passing IDetail should create a new form with FormGroup', () => {
        const formGroup = service.createDetailFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            discord: expect.any(Object),
            sourceId: expect.any(Object),
            sourceChannel: expect.any(Object),
            total: expect.any(Object),
            login: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });
    });

    describe('getDetail', () => {
      it('should return NewDetail for default Detail initial value', () => {
        const formGroup = service.createDetailFormGroup(sampleWithNewData);

        const detail = service.getDetail(formGroup) as any;

        expect(detail).toMatchObject(sampleWithNewData);
      });

      it('should return NewDetail for empty Detail initial value', () => {
        const formGroup = service.createDetailFormGroup();

        const detail = service.getDetail(formGroup) as any;

        expect(detail).toMatchObject({});
      });

      it('should return IDetail', () => {
        const formGroup = service.createDetailFormGroup(sampleWithRequiredData);

        const detail = service.getDetail(formGroup) as any;

        expect(detail).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDetail should not enable id FormControl', () => {
        const formGroup = service.createDetailFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDetail should disable id FormControl', () => {
        const formGroup = service.createDetailFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
