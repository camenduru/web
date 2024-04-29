import { IType, NewType } from './type.model';

export const sampleWithRequiredData: IType = {
  id: 'fa7f60c2-56ef-4e59-9449-d79266a7023c',
  type: 'swindle',
  amount: 'apprehensive',
};

export const sampleWithPartialData: IType = {
  id: 'ad815ca1-40cf-4c5f-9cde-8eb56a149b3b',
  type: 'supposing astride recliner',
  amount: 'an mesh',
};

export const sampleWithFullData: IType = {
  id: 'fa13a582-dc0f-44e6-8833-c93b465b3865',
  type: 'absentmindedly ouch',
  amount: 'plead boo vice',
};

export const sampleWithNewData: NewType = {
  type: 'over plantation namecheck',
  amount: 'mockingly instance',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
