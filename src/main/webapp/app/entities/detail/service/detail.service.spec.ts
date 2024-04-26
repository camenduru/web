import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDetail } from '../detail.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../detail.test-samples';

import { DetailService } from './detail.service';

const requireRestSample: IDetail = {
  ...sampleWithRequiredData,
};

describe('Detail Service', () => {
  let service: DetailService;
  let httpMock: HttpTestingController;
  let expectedResult: IDetail | IDetail[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DetailService);
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

    it('should create a Detail', () => {
      const detail = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(detail).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Detail', () => {
      const detail = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(detail).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Detail', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Detail', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Detail', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDetailToCollectionIfMissing', () => {
      it('should add a Detail to an empty array', () => {
        const detail: IDetail = sampleWithRequiredData;
        expectedResult = service.addDetailToCollectionIfMissing([], detail);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(detail);
      });

      it('should not add a Detail to an array that contains it', () => {
        const detail: IDetail = sampleWithRequiredData;
        const detailCollection: IDetail[] = [
          {
            ...detail,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDetailToCollectionIfMissing(detailCollection, detail);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Detail to an array that doesn't contain it", () => {
        const detail: IDetail = sampleWithRequiredData;
        const detailCollection: IDetail[] = [sampleWithPartialData];
        expectedResult = service.addDetailToCollectionIfMissing(detailCollection, detail);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(detail);
      });

      it('should add only unique Detail to an array', () => {
        const detailArray: IDetail[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const detailCollection: IDetail[] = [sampleWithRequiredData];
        expectedResult = service.addDetailToCollectionIfMissing(detailCollection, ...detailArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const detail: IDetail = sampleWithRequiredData;
        const detail2: IDetail = sampleWithPartialData;
        expectedResult = service.addDetailToCollectionIfMissing([], detail, detail2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(detail);
        expect(expectedResult).toContain(detail2);
      });

      it('should accept null and undefined values', () => {
        const detail: IDetail = sampleWithRequiredData;
        expectedResult = service.addDetailToCollectionIfMissing([], null, detail, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(detail);
      });

      it('should return initial array if no Detail is added', () => {
        const detailCollection: IDetail[] = [sampleWithRequiredData];
        expectedResult = service.addDetailToCollectionIfMissing(detailCollection, undefined, null);
        expect(expectedResult).toEqual(detailCollection);
      });
    });

    describe('compareDetail', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDetail(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareDetail(entity1, entity2);
        const compareResult2 = service.compareDetail(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareDetail(entity1, entity2);
        const compareResult2 = service.compareDetail(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareDetail(entity1, entity2);
        const compareResult2 = service.compareDetail(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
