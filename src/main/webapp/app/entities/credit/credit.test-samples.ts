import dayjs from 'dayjs/esm';

import { ICredit, NewCredit } from './credit.model';

export const sampleWithRequiredData: ICredit = {
  id: '0e24103c-5864-42ac-974f-fa5ca15abddc',
  date: dayjs('2024-04-25T00:41'),
  status: 'IN',
  source: 'PATREON',
  total: 'ranger',
};

export const sampleWithPartialData: ICredit = {
  id: '32d379b2-11bb-4de8-8529-e2bf04d065aa',
  date: dayjs('2024-04-25T02:19'),
  status: 'IN',
  source: 'WEB',
  total: 'lively sedately',
};

export const sampleWithFullData: ICredit = {
  id: '376501f9-301e-48e9-a910-1fe7ae39b269',
  date: dayjs('2024-04-25T10:31'),
  status: 'IN',
  source: 'PAYPAL',
  total: 'however',
};

export const sampleWithNewData: NewCredit = {
  date: dayjs('2024-04-25T06:54'),
  status: 'OUT',
  source: 'WEB',
  total: 'truthfully',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
