import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { IType } from '../type.model';
import { TypeService } from '../service/type.service';

import typeResolve from './type-routing-resolve.service';

describe('Type routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: TypeService;
  let resultType: IType | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    service = TestBed.inject(TypeService);
    resultType = undefined;
  });

  describe('resolve', () => {
    it('should return IType returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      TestBed.runInInjectionContext(() => {
        typeResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultType = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultType).toEqual({ id: 'ABC' });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      TestBed.runInInjectionContext(() => {
        typeResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultType = result;
          },
        });
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultType).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IType>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      TestBed.runInInjectionContext(() => {
        typeResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultType = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultType).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
