import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRedeem } from '../redeem.model';
import { RedeemService } from '../service/redeem.service';

const redeemResolve = (route: ActivatedRouteSnapshot): Observable<null | IRedeem> => {
  const id = route.params['id'];
  if (id) {
    return inject(RedeemService)
      .find(id)
      .pipe(
        mergeMap((redeem: HttpResponse<IRedeem>) => {
          if (redeem.body) {
            return of(redeem.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default redeemResolve;
