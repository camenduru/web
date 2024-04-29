import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IType } from '../type.model';
import { TypeService } from '../service/type.service';

const typeResolve = (route: ActivatedRouteSnapshot): Observable<null | IType> => {
  const id = route.params['id'];
  if (id) {
    return inject(TypeService)
      .find(id)
      .pipe(
        mergeMap((type: HttpResponse<IType>) => {
          if (type.body) {
            return of(type.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default typeResolve;
