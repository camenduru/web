import dayjs from 'dayjs/esm';

import { IJob, NewJob } from './job.model';

export const sampleWithRequiredData: IJob = {
  id: 'bf9d2469-c2a0-4705-9eab-7224c0c1c7d5',
  date: dayjs('2024-04-26T00:08'),
  status: 'FAILED',
  source: 'ANDROID',
  sourceID: 'sip geez',
  sourceChannel: 'hourly endear',
  sourceUsername: 'right',
  command: 'plus married',
  server: 'impugn',
};

export const sampleWithPartialData: IJob = {
  id: 'f8cf314e-b032-421e-98fb-e644345370a9',
  date: dayjs('2024-04-25T11:10'),
  status: 'DONE',
  source: 'IOS',
  sourceID: 'mention obvious buffet',
  sourceChannel: 'mealy real',
  sourceUsername: 'sulk',
  command: 'merrily meanwhile',
  server: 'enormously yuck which',
};

export const sampleWithFullData: IJob = {
  id: '5467ed93-b616-4f4b-9d0b-51b5b89b1c94',
  date: dayjs('2024-04-25T14:59'),
  status: 'DONE',
  source: 'IOS',
  sourceID: 'purport',
  sourceChannel: 'amidst snarl doom',
  sourceUsername: 'stereotype but beneath',
  command: 'stylish openly uselessly',
  server: 'debt',
};

export const sampleWithNewData: NewJob = {
  date: dayjs('2024-04-25T08:00'),
  status: 'FAILED',
  source: 'WEB',
  sourceID: 'against',
  sourceChannel: 'awful into apud',
  sourceUsername: 'immerse',
  command: 'obnoxiously',
  server: 'majority ah',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
