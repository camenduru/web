import dayjs from 'dayjs/esm';

import { IJob, NewJob } from './job.model';

export const sampleWithRequiredData: IJob = {
  id: '9d2469c2-a070-45ea-ab72-24c0c1c7d550',
  date: dayjs('2024-04-25T12:01'),
  status: 'WORKING',
  source: 'IOS',
  sourceId: 'humble underneath',
  sourceChannel: 'once longingly',
  command: 'anenst lovable',
  type: 'unless via upward',
  amount: 'once geez of',
  result: 'testimonial invoice',
  login: 'offensively beneath disguised',
};

export const sampleWithPartialData: IJob = {
  id: 'dfba4a74-d20d-4540-8d3f-4733322d7faa',
  date: dayjs('2024-04-25T23:24'),
  status: 'NEGATIVE',
  source: 'IOS',
  sourceId: 'yuck',
  sourceChannel: 'brr dismal',
  command: 'sorghum pro discourse',
  type: 'mmm but',
  amount: 'zowie to',
  result: 'per',
  login: 'geez manicure',
};

export const sampleWithFullData: IJob = {
  id: '7b4b2e89-7cd1-47ae-b308-1fb821e1d54a',
  date: dayjs('2024-04-25T18:55'),
  status: 'NEGATIVE',
  source: 'PAYPAL',
  sourceId: 'absent when',
  sourceChannel: 'hm cautious',
  command: 'revenant starchy blah',
  type: 'given cane and',
  amount: 'which',
  result: 'quarter because',
  login: 'small acidic woot',
};

export const sampleWithNewData: NewJob = {
  date: dayjs('2024-04-25T00:22'),
  status: 'WAITING',
  source: 'PAYPAL',
  sourceId: 'repeatedly',
  sourceChannel: 'nocturnal so',
  command: 'dependent indeed',
  type: 'lasso',
  amount: 'short-term because depression',
  result: 'even',
  login: 'able',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
