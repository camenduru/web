import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'webApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'job',
    data: { pageTitle: 'webApp.job.home.title' },
    loadChildren: () => import('./job/job.routes'),
  },
  {
    path: 'detail',
    data: { pageTitle: 'webApp.detail.home.title' },
    loadChildren: () => import('./detail/detail.routes'),
  },
  {
    path: 'type',
    data: { pageTitle: 'webApp.type.home.title' },
    loadChildren: () => import('./type/type.routes'),
  },
  {
    path: 'redeem',
    data: { pageTitle: 'webApp.redeem.home.title' },
    loadChildren: () => import('./redeem/redeem.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
