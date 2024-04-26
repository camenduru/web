import dayjs from 'dayjs/esm';

import { IJob, NewJob } from './job.model';

export const sampleWithRequiredData: IJob = {
  id: '9d2469c2-a070-45ea-ab72-24c0c1c7d550',
  date: dayjs('2024-04-25T12:01'),
  status: 'WORKING',
  source: 'IOS',
  sourceID: 'humble underneath',
  sourceChannel: 'once longingly',
  sourceUsername: 'anenst lovable',
  command: 'unless via upward',
  type: 'once geez of',
  amount: 'testimonial invoice',
  total: 'offensively beneath disguised',
};

export const sampleWithPartialData: IJob = {
  id: 'dfba4a74-d20d-4540-8d3f-4733322d7faa',
  date: dayjs('2024-04-25T23:24'),
  status: 'NEGATIVE',
  source: 'IOS',
  sourceID: 'yuck',
  sourceChannel: 'brr dismal',
  sourceUsername: 'sorghum pro discourse',
  command: 'mmm but',
  type: 'zowie to',
  amount: 'per',
  total: 'geez manicure',
};

export const sampleWithFullData: IJob = {
  id: '7b4b2e89-7cd1-47ae-b308-1fb821e1d54a',
  date: dayjs('2024-04-25T18:55'),
  status: 'NEGATIVE',
  source: 'PAYPAL',
  sourceID: 'absent when',
  sourceChannel: 'hm cautious',
  sourceUsername: 'revenant starchy blah',
  command: 'given cane and',
  type: 'which',
  amount: 'quarter because',
  total: 'small acidic woot',
};

export const sampleWithNewData: NewJob = {
  date: dayjs('2024-04-25T00:22'),
  status: 'WORKING',
  source: 'PAYPAL',
  sourceID: 'repeatedly',
  sourceChannel: 'nocturnal so',
  sourceUsername: 'dependent indeed',
  command: 'lasso',
  type: 'short-term because depression',
  amount: 'even',
  total: 'able',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
