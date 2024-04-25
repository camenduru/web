import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 'c8d822a6-ea8a-44a3-92a0-68feb8b40b1b',
  login: 'EAN@WJV\\0dK\\vC\\NG',
};

export const sampleWithPartialData: IUser = {
  id: '677d5319-42eb-4b73-a4d4-844ca5ca5dde',
  login: '0be',
};

export const sampleWithFullData: IUser = {
  id: '2e4654dd-e303-4ccd-95ce-00d86ed1d275',
  login: '3?fyv@oxU\\,DfVQG\\30j\\Tlt\\.GItGyV',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
