import dayjs from 'dayjs/esm';

import { IJob, NewJob } from './job.model';

export const sampleWithRequiredData: IJob = {
  id: 'f9d2469c-2a07-405e-8ab7-224c0c1c7d55',
  date: dayjs('2024-04-25T12:04'),
  status: 'WORKING',
  source: 'DISCORD',
  sourceId: 'avaricious',
  sourceChannel: 'underneath brushfire',
  command: 'longingly impractical',
  type: 'lovable',
  amount: 'unless via upward',
  result: 'once geez of',
};

export const sampleWithPartialData: IJob = {
  id: '6865b37e-9308-4697-adcc-9a238e318344',
  date: dayjs('2024-04-25T00:48'),
  status: 'DONE',
  source: 'DISCORD',
  sourceId: 'favorable sulk dread',
  sourceChannel: 'meanwhile fairly',
  command: 'yuck',
  type: 'brr dismal',
  amount: 'sorghum pro discourse',
  result: 'mmm but',
};

export const sampleWithFullData: IJob = {
  id: 'a074169e-675d-449d-81e5-4fa4b602dba3',
  date: dayjs('2024-04-25T02:26'),
  status: 'CANCELED',
  source: 'ANDROID',
  sourceId: 'mmm stylish openly',
  sourceChannel: 'afore',
  command: 'outside when highly',
  type: 'above vast meanwhile',
  amount: 'legitimacy impractical anglicize',
  result: 'brown why apropos',
};

export const sampleWithNewData: NewJob = {
  date: dayjs('2024-04-25T01:17'),
  status: 'CANCELED',
  source: 'ANDROID',
  sourceId: 'and',
  sourceChannel: 'of eager stacking',
  command: 'by boo',
  type: 'tank especially',
  amount: 'forenenst marvelous',
  result: 'amidst',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
