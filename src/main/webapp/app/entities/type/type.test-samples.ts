import { IType, NewType } from './type.model';

export const sampleWithRequiredData: IType = {
  id: 'c256efe5-9449-4d79-9266-a7023c717218',
  type: 'nervously incidentally why',
  amount: 'unimportant picture library',
  schema: 'gah against after',
  model: 'whether',
  title: 'concentrate phooey',
  isDefault: false,
  isActive: true,
  isFree: false,
};

export const sampleWithPartialData: IType = {
  id: '6833c93b-465b-4386-b539-5dd9020a312f',
  type: 'for alongside vaguely',
  amount: 'although ack warmly',
  schema: 'herald although',
  model: 'banker detain',
  title: 'excepting forenenst',
  isDefault: true,
  isActive: false,
  isFree: true,
};

export const sampleWithFullData: IType = {
  id: 'ae528051-b56b-4a04-b04f-771b6492f823',
  type: 'now shore tugboat',
  amount: 'yowza faraway',
  schema: 'opposite near',
  model: 'medal gadzooks',
  title: 'tiny',
  isDefault: false,
  isActive: false,
  isFree: false,
};

export const sampleWithNewData: NewType = {
  type: 'what gosh moralize',
  amount: 'defiantly fortress gauge',
  schema: 'yahoo',
  model: 'although',
  title: 'voluminous',
  isDefault: false,
  isActive: false,
  isFree: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
