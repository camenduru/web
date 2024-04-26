import dayjs from 'dayjs/esm';

import { IJob, NewJob } from './job.model';

export const sampleWithRequiredData: IJob = {
  id: 'a2ac6212-520e-459f-b3f1-b4709b15196c',
  date: dayjs('2024-04-25T03:17'),
  status: 'POSITIVE',
  source: 'ANDROID',
  sourceID: 'meanwhile cooked',
  sourceChannel: 'small grass plate',
  sourceUsername: 'carefully shirt',
  command: 'archeology zowie',
  type: 'which even ugh',
  amount: 'but dispel',
  total: 'upon smoothly serious',
};

export const sampleWithPartialData: IJob = {
  id: 'af001880-1759-4e10-9446-9d1705695db3',
  date: dayjs('2024-04-25T21:05'),
  status: 'WORKING',
  source: 'PATREON',
  sourceID: 'whose heel',
  sourceChannel: 'eponym meh',
  sourceUsername: 'stack very',
  command: 'baggy',
  type: 'plop feminine',
  amount: 'to midst',
  total: 'wherever nearly supposing',
};

export const sampleWithFullData: IJob = {
  id: 'b7067949-7a8b-4c39-a5fb-08f1ef9171b8',
  date: dayjs('2024-04-25T04:10'),
  status: 'POSITIVE',
  source: 'DISCORD',
  sourceID: 'veneer twang complicate',
  sourceChannel: 'of whoa notwithstanding',
  sourceUsername: 'burden back-up suction',
  command: 'where fooey',
  type: 'er boastfully',
  amount: 'concrete vandalize',
  total: 'over multicolored',
};

export const sampleWithNewData: NewJob = {
  date: dayjs('2024-04-25T01:15'),
  status: 'NEGATIVE',
  source: 'PATREON',
  sourceID: 'coolly brown',
  sourceChannel: 'worriedly incidentally smart',
  sourceUsername: 'under',
  command: 'hmph',
  type: 'vaguely repeatedly',
  amount: 'frenetically hm',
  total: 'orderly onto',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
