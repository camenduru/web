import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICredit } from '../credit.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../credit.test-samples';

import { CreditService, RestCredit } from './credit.service';

const requireRestSample: RestCredit = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.toJSON(),
};

describe('Credit Service', () => {
  let service: CreditService;
  let httpMock: HttpTestingController;
  let expectedResult: ICredit | ICredit[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CreditService);
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

    it('should create a Credit', () => {
      const credit = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(credit).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Credit', () => {
      const credit = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(credit).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Credit', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Credit', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Credit', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCreditToCollectionIfMissing', () => {
      it('should add a Credit to an empty array', () => {
        const credit: ICredit = sampleWithRequiredData;
        expectedResult = service.addCreditToCollectionIfMissing([], credit);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(credit);
      });

      it('should not add a Credit to an array that contains it', () => {
        const credit: ICredit = sampleWithRequiredData;
        const creditCollection: ICredit[] = [
          {
            ...credit,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCreditToCollectionIfMissing(creditCollection, credit);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Credit to an array that doesn't contain it", () => {
        const credit: ICredit = sampleWithRequiredData;
        const creditCollection: ICredit[] = [sampleWithPartialData];
        expectedResult = service.addCreditToCollectionIfMissing(creditCollection, credit);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(credit);
      });

      it('should add only unique Credit to an array', () => {
        const creditArray: ICredit[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const creditCollection: ICredit[] = [sampleWithRequiredData];
        expectedResult = service.addCreditToCollectionIfMissing(creditCollection, ...creditArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const credit: ICredit = sampleWithRequiredData;
        const credit2: ICredit = sampleWithPartialData;
        expectedResult = service.addCreditToCollectionIfMissing([], credit, credit2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(credit);
        expect(expectedResult).toContain(credit2);
      });

      it('should accept null and undefined values', () => {
        const credit: ICredit = sampleWithRequiredData;
        expectedResult = service.addCreditToCollectionIfMissing([], null, credit, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(credit);
      });

      it('should return initial array if no Credit is added', () => {
        const creditCollection: ICredit[] = [sampleWithRequiredData];
        expectedResult = service.addCreditToCollectionIfMissing(creditCollection, undefined, null);
        expect(expectedResult).toEqual(creditCollection);
      });
    });

    describe('compareCredit', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCredit(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareCredit(entity1, entity2);
        const compareResult2 = service.compareCredit(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareCredit(entity1, entity2);
        const compareResult2 = service.compareCredit(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareCredit(entity1, entity2);
        const compareResult2 = service.compareCredit(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
