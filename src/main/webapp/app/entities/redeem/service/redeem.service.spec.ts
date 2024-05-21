import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRedeem } from '../redeem.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../redeem.test-samples';

import { RedeemService, RestRedeem } from './redeem.service';

const requireRestSample: RestRedeem = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.toJSON(),
};

describe('Redeem Service', () => {
  let service: RedeemService;
  let httpMock: HttpTestingController;
  let expectedResult: IRedeem | IRedeem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RedeemService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Redeem', () => {
      const redeem = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(redeem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Redeem', () => {
      const redeem = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(redeem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Redeem', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Redeem', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Redeem', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRedeemToCollectionIfMissing', () => {
      it('should add a Redeem to an empty array', () => {
        const redeem: IRedeem = sampleWithRequiredData;
        expectedResult = service.addRedeemToCollectionIfMissing([], redeem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(redeem);
      });

      it('should not add a Redeem to an array that contains it', () => {
        const redeem: IRedeem = sampleWithRequiredData;
        const redeemCollection: IRedeem[] = [
          {
            ...redeem,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRedeemToCollectionIfMissing(redeemCollection, redeem);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Redeem to an array that doesn't contain it", () => {
        const redeem: IRedeem = sampleWithRequiredData;
        const redeemCollection: IRedeem[] = [sampleWithPartialData];
        expectedResult = service.addRedeemToCollectionIfMissing(redeemCollection, redeem);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(redeem);
      });

      it('should add only unique Redeem to an array', () => {
        const redeemArray: IRedeem[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const redeemCollection: IRedeem[] = [sampleWithRequiredData];
        expectedResult = service.addRedeemToCollectionIfMissing(redeemCollection, ...redeemArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const redeem: IRedeem = sampleWithRequiredData;
        const redeem2: IRedeem = sampleWithPartialData;
        expectedResult = service.addRedeemToCollectionIfMissing([], redeem, redeem2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(redeem);
        expect(expectedResult).toContain(redeem2);
      });

      it('should accept null and undefined values', () => {
        const redeem: IRedeem = sampleWithRequiredData;
        expectedResult = service.addRedeemToCollectionIfMissing([], null, redeem, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(redeem);
      });

      it('should return initial array if no Redeem is added', () => {
        const redeemCollection: IRedeem[] = [sampleWithRequiredData];
        expectedResult = service.addRedeemToCollectionIfMissing(redeemCollection, undefined, null);
        expect(expectedResult).toEqual(redeemCollection);
      });
    });

    describe('compareRedeem', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRedeem(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareRedeem(entity1, entity2);
        const compareResult2 = service.compareRedeem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareRedeem(entity1, entity2);
        const compareResult2 = service.compareRedeem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareRedeem(entity1, entity2);
        const compareResult2 = service.compareRedeem(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
