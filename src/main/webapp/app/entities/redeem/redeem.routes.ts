import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RedeemComponent } from './list/redeem.component';
import { RedeemDetailComponent } from './detail/redeem-detail.component';
import { RedeemUpdateComponent } from './update/redeem-update.component';
import RedeemResolve from './route/redeem-routing-resolve.service';

const redeemRoute: Routes = [
  {
    path: '',
    component: RedeemComponent,
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RedeemDetailComponent,
    resolve: {
      redeem: RedeemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RedeemUpdateComponent,
    resolve: {
      redeem: RedeemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RedeemUpdateComponent,
    resolve: {
      redeem: RedeemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default redeemRoute;
