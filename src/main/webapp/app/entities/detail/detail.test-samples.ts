import { IDetail, NewDetail } from './detail.model';

export const sampleWithRequiredData: IDetail = {
  id: 'c9833f39-c546-4f02-ad04-964268df260a',
  discord: 'resect',
  sourceId: 'whereas cane',
  sourceChannel: 'pay plunder yum',
  total: 'boo',
  login: 'alongside nearly',
};

export const sampleWithPartialData: IDetail = {
  id: '2d5cc990-b169-4f25-823b-d1f1491429b8',
  discord: 'phew sponsor engulf',
  sourceId: 'even everlasting failing',
  sourceChannel: 'aw grit ratio',
  total: 'along atop despite',
  login: 'sketch lazily meanwhile',
};

export const sampleWithFullData: IDetail = {
  id: 'c074f71d-962b-427c-b828-d44362ada763',
  discord: 'when',
  sourceId: 'solidly what',
  sourceChannel: 'thunderstorm pro recant',
  total: 'pish',
  login: 'boo poorly',
};

export const sampleWithNewData: NewDetail = {
  discord: 'of fussy lest',
  sourceId: 'lazily brr',
  sourceChannel: 'robotics frankly',
  total: 'consult notwithstanding anti',
  login: 'bah yum',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
