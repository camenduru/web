import dayjs from 'dayjs/esm';

import { IJob, NewJob } from './job.model';

export const sampleWithRequiredData: IJob = {
  id: 'd2469c2a-0705-4eab-a722-4c0c1c7d5508',
  date: dayjs('2024-04-25T13:35'),
  status: 'NEGATIVE',
  source: 'ANDROID',
  sourceID: 'immediately',
  sourceChannel: 'manufacturer duh leek',
  sourceUsername: 'classmate whimsical',
  command: 'of mare what',
  type: 'um',
  amount: 'brr aw monger',
  total: 'rumple',
  result: 'aside why with',
};

export const sampleWithPartialData: IJob = {
  id: 'ba4a74d2-0d54-40d3-8f47-33322d7faa00',
  date: dayjs('2024-04-25T18:43'),
  status: 'NEGATIVE',
  source: 'ANDROID',
  sourceID: 'ouch beneath',
  sourceChannel: 'garland annoy',
  sourceUsername: 'notwithstanding jovially protest',
  command: 'acclaimed',
  type: 'loyally up',
  amount: 'advantage vacantly',
  total: 'resurrect forenenst cwtch',
  result: 'caddie',
};

export const sampleWithFullData: IJob = {
  id: 'e1d54ac3-3aa1-4154-b9c0-11cd55c8c057',
  date: dayjs('2024-04-25T23:07'),
  status: 'WORKING',
  source: 'IOS',
  sourceID: 'apud indoctrinate',
  sourceChannel: 'insidious modulo',
  sourceUsername: 'heifer exhibit tightly',
  command: 'dynamite and',
  type: 'of eager stacking',
  amount: 'by boo',
  total: 'tank especially',
  result: 'forenenst marvelous',
};

export const sampleWithNewData: NewJob = {
  date: dayjs('2024-04-25T17:49'),
  status: 'WORKING',
  source: 'WEB',
  sourceID: 'winner short-term',
  sourceChannel: 'extremely coffee even',
  sourceUsername: 'able',
  command: 'from bias showcase',
  type: 'sneaky lovingly gather',
  amount: 'upbeat um',
  total: 'chronometer however relate',
  result: 'hm',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
