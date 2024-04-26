import { IDetail, NewDetail } from './detail.model';

export const sampleWithRequiredData: IDetail = {
  id: '192c9833-f39c-4546-9f02-d04964268df2',
  discord: 'qua',
  total: 'gripping meanwhile prospect',
};

export const sampleWithPartialData: IDetail = {
  id: '08ea0c6c-fba3-4e74-b364-0f6f079170c6',
  discord: 'rally whenever',
  total: 'uplift whoa',
};

export const sampleWithFullData: IDetail = {
  id: 'f1491429-b83e-4d62-90ca-cc75651d6d92',
  discord: 'optimal tremendously',
  total: 'obi naturally',
};

export const sampleWithNewData: NewDetail = {
  discord: 'split brr sparse',
  total: 'charge over',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
