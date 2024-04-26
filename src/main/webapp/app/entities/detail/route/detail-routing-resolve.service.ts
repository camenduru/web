import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDetail } from '../detail.model';
import { DetailService } from '../service/detail.service';

const detailResolve = (route: ActivatedRouteSnapshot): Observable<null | IDetail> => {
  const id = route.params['id'];
  if (id) {
    return inject(DetailService)
      .find(id)
      .pipe(
        mergeMap((detail: HttpResponse<IDetail>) => {
          if (detail.body) {
            return of(detail.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default detailResolve;
