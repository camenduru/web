import { IDetail, NewDetail } from './detail.model';

export const sampleWithRequiredData: IDetail = {
  id: '9833f39c-546f-402d-8049-64268df260a8',
  discord: 'political',
  sourceId: 'fictionalize taint',
  sourceChannel: 'autumn',
  total: 'pish walk impersonate',
  login: 'oof',
  membership: 'PAID',
};

export const sampleWithPartialData: IDetail = {
  id: '10a782d5-cc99-40b1-969f-2523bd1f1491',
  discord: 'hinge',
  sourceId: 'helpfully',
  sourceChannel: 'anti zowie',
  total: 'laze whereas sweltering',
  login: 'barring',
  membership: 'FREE',
};

export const sampleWithFullData: IDetail = {
  id: 'd614b635-bd75-48fc-961e-3ae3244b1e6a',
  discord: 'sketch lazily meanwhile',
  sourceId: 'till sometimes fervently',
  sourceChannel: 'apud always',
  total: 'stormy joyously before',
  login: 'traveler than',
  membership: 'PAID',
};

export const sampleWithNewData: NewDetail = {
  discord: 'yowza selfishly versus',
  sourceId: 'privilege once',
  sourceChannel: 'upon easy psst',
  total: 'oof gaseous',
  login: 'aperitif whose',
  membership: 'PAID',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
