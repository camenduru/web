import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TypeComponent } from './list/type.component';
import { TypeDetailComponent } from './detail/type-detail.component';
import { TypeUpdateComponent } from './update/type-update.component';
import TypeResolve from './route/type-routing-resolve.service';

const typeRoute: Routes = [
  {
    path: '',
    component: TypeComponent,
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TypeDetailComponent,
    resolve: {
      type: TypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TypeUpdateComponent,
    resolve: {
      type: TypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TypeUpdateComponent,
    resolve: {
      type: TypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default typeRoute;
