import dayjs from 'dayjs/esm';

import { IRedeem, NewRedeem } from './redeem.model';

export const sampleWithRequiredData: IRedeem = {
  id: '77cc2174-07e9-4ee0-8922-341abe087410',
  date: dayjs('2024-05-20T05:53'),
  status: 'FAILED',
  type: 'cold meanwhile',
  author: 'especially',
  login: 'portion objection upliftingly',
  amount: 'gah whoa',
  code: 'shipper pish hmph',
};

export const sampleWithPartialData: IRedeem = {
  id: '72a7161a-ad53-4955-aad9-05e8fb3e1b3e',
  date: dayjs('2024-05-20T17:33'),
  status: 'FAILED',
  type: 'knowingly unto',
  author: 'regarding',
  login: 'aggravating master wise',
  amount: 'ha aha',
  code: 'defray accomplished',
};

export const sampleWithFullData: IRedeem = {
  id: '06bf53b8-36ee-4ac9-82c1-cd1f97fd9b42',
  date: dayjs('2024-05-21T00:24'),
  status: 'CANCELED',
  type: 'nifty',
  author: 'feline embarrassed inasmuch',
  login: 'who sharply blissfully',
  amount: 'heavily',
  code: 'flippant vain elastic',
};

export const sampleWithNewData: NewRedeem = {
  date: dayjs('2024-05-20T08:15'),
  status: 'USED',
  type: 'lovingly',
  author: 'puff pretzel heavily',
  login: 'hate',
  amount: 'sparse till',
  code: 'far beyond that',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
