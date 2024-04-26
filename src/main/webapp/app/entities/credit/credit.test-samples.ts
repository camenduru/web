import dayjs from 'dayjs/esm';

import { ICredit, NewCredit } from './credit.model';

export const sampleWithRequiredData: ICredit = {
  id: 'e24103c5-8642-4ac7-b4ff-a5ca15abddc7',
  date: dayjs('2024-04-25T23:33'),
  status: 'OUT',
  amount: 'ranger',
  source: 'IOS',
  total: 'biff',
};

export const sampleWithPartialData: ICredit = {
  id: '1bbde852-9e2b-4f04-bd06-5aa1e42a1d8a',
  date: dayjs('2024-04-25T15:05'),
  status: 'IN',
  amount: 'enraged next',
  source: 'IOS',
  total: 'blend',
};

export const sampleWithFullData: ICredit = {
  id: '01fe7ae3-9b26-49b9-a7a2-febd3a4bb201',
  date: dayjs('2024-04-25T21:42'),
  status: 'IN',
  amount: 'gah',
  source: 'IOS',
  total: 'finally',
};

export const sampleWithNewData: NewCredit = {
  date: dayjs('2024-04-25T02:39'),
  status: 'OUT',
  amount: 'afore handsome mixed',
  source: 'ANDROID',
  total: 'restaurant lest fussy',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
