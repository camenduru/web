import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CreditComponent } from './list/credit.component';
import { CreditDetailComponent } from './detail/credit-detail.component';
import { CreditUpdateComponent } from './update/credit-update.component';
import CreditResolve from './route/credit-routing-resolve.service';

const creditRoute: Routes = [
  {
    path: '',
    component: CreditComponent,
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CreditDetailComponent,
    resolve: {
      credit: CreditResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CreditUpdateComponent,
    resolve: {
      credit: CreditResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CreditUpdateComponent,
    resolve: {
      credit: CreditResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default creditRoute;
