import { IType, NewType } from './type.model';

export const sampleWithRequiredData: IType = {
  id: '256efe59-449d-4792-a66a-7023c7172185',
  type: 'parchment sometimes ack',
  amount: 'remarkable plus',
  schema: 'functional',
  model: 'how',
  title: 'er macaroni hiccups',
  isDefault: false,
  isActive: false,
  isFree: false,
  cooldown: 'whereas ugh',
};

export const sampleWithPartialData: IType = {
  id: '33c93b46-5b38-4653-b95d-d9020a312ffc',
  type: 'against sweatshirt write',
  amount: 'vent formulate gadzooks',
  schema: 'or',
  model: 'incidentally since',
  title: 'opposite brr',
  isDefault: false,
  isActive: true,
  isFree: false,
  cooldown: 'circa',
};

export const sampleWithFullData: IType = {
  id: '28051b56-ba04-404f-b771-b6492f823ce3',
  type: 'recollect reinstate belt',
  amount: 'knuckle next barring',
  schema: 'psych why rudely',
  model: 'strict',
  title: 'woot yum break',
  isDefault: false,
  isActive: false,
  isFree: false,
  cooldown: 'finally concerning',
};

export const sampleWithNewData: NewType = {
  type: 'er absorb adhere',
  amount: 'passionate where',
  schema: 'gadzooks mmm maximize',
  model: 'drake gosh',
  title: 'still',
  isDefault: true,
  isActive: false,
  isFree: false,
  cooldown: 'after whose rapidly',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
