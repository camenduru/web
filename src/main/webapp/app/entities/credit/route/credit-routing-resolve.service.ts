import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICredit } from '../credit.model';
import { CreditService } from '../service/credit.service';

const creditResolve = (route: ActivatedRouteSnapshot): Observable<null | ICredit> => {
  const id = route.params['id'];
  if (id) {
    return inject(CreditService)
      .find(id)
      .pipe(
        mergeMap((credit: HttpResponse<ICredit>) => {
          if (credit.body) {
            return of(credit.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default creditResolve;
