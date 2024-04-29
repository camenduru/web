import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IType } from '../type.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../type.test-samples';

import { TypeService } from './type.service';

const requireRestSample: IType = {
  ...sampleWithRequiredData,
};

describe('Type Service', () => {
  let service: TypeService;
  let httpMock: HttpTestingController;
  let expectedResult: IType | IType[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TypeService);
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

    it('should create a Type', () => {
      const type = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(type).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Type', () => {
      const type = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(type).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Type', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Type', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Type', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTypeToCollectionIfMissing', () => {
      it('should add a Type to an empty array', () => {
        const type: IType = sampleWithRequiredData;
        expectedResult = service.addTypeToCollectionIfMissing([], type);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(type);
      });

      it('should not add a Type to an array that contains it', () => {
        const type: IType = sampleWithRequiredData;
        const typeCollection: IType[] = [
          {
            ...type,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTypeToCollectionIfMissing(typeCollection, type);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Type to an array that doesn't contain it", () => {
        const type: IType = sampleWithRequiredData;
        const typeCollection: IType[] = [sampleWithPartialData];
        expectedResult = service.addTypeToCollectionIfMissing(typeCollection, type);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(type);
      });

      it('should add only unique Type to an array', () => {
        const typeArray: IType[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const typeCollection: IType[] = [sampleWithRequiredData];
        expectedResult = service.addTypeToCollectionIfMissing(typeCollection, ...typeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const type: IType = sampleWithRequiredData;
        const type2: IType = sampleWithPartialData;
        expectedResult = service.addTypeToCollectionIfMissing([], type, type2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(type);
        expect(expectedResult).toContain(type2);
      });

      it('should accept null and undefined values', () => {
        const type: IType = sampleWithRequiredData;
        expectedResult = service.addTypeToCollectionIfMissing([], null, type, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(type);
      });

      it('should return initial array if no Type is added', () => {
        const typeCollection: IType[] = [sampleWithRequiredData];
        expectedResult = service.addTypeToCollectionIfMissing(typeCollection, undefined, null);
        expect(expectedResult).toEqual(typeCollection);
      });
    });

    describe('compareType', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareType(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareType(entity1, entity2);
        const compareResult2 = service.compareType(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareType(entity1, entity2);
        const compareResult2 = service.compareType(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareType(entity1, entity2);
        const compareResult2 = service.compareType(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
