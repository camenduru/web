import { IType, NewType } from './type.model';

export const sampleWithRequiredData: IType = {
  id: '0c256efe-5944-49d7-a926-6a7023c71721',
  type: 'nor',
  amount: 'incidentally why',
  schema: 'unimportant picture library',
  model: 'gah against after',
  title: 'whether',
  isDefault: false,
  isActive: true,
};

export const sampleWithPartialData: IType = {
  id: 'a8fa13a5-82dc-40f4-9e68-33c93b465b38',
  type: 'apprehensive',
  amount: 'why',
  schema: 'for alongside vaguely',
  model: 'although ack warmly',
  title: 'herald although',
  isDefault: true,
  isActive: true,
};

export const sampleWithFullData: IType = {
  id: '5422111c-5a88-439a-9a62-7b605d19270f',
  type: 'calmly ew',
  amount: 'herring',
  schema: 'since',
  model: 'now shore tugboat',
  title: 'yowza faraway',
  isDefault: true,
  isActive: true,
};

export const sampleWithNewData: NewType = {
  type: 'barring porcelain',
  amount: 'why rudely',
  schema: 'strict',
  model: 'woot yum break',
  title: 'aggressive ack',
  isDefault: true,
  isActive: true,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
