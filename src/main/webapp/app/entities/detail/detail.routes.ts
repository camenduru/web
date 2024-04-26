import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DetailComponent } from './list/detail.component';
import { DetailDetailComponent } from './detail/detail-detail.component';
import { DetailUpdateComponent } from './update/detail-update.component';
import DetailResolve from './route/detail-routing-resolve.service';

const detailRoute: Routes = [
  {
    path: '',
    component: DetailComponent,
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DetailDetailComponent,
    resolve: {
      detail: DetailResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DetailUpdateComponent,
    resolve: {
      detail: DetailResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DetailUpdateComponent,
    resolve: {
      detail: DetailResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default detailRoute;
