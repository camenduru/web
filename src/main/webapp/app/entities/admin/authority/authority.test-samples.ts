import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '0f92069c-b8f6-4580-bb72-2ecd8b2e1f36',
};

export const sampleWithPartialData: IAuthority = {
  name: 'b8c9dd58-1a04-4320-bd74-ee41a1ebdc8c',
};

export const sampleWithFullData: IAuthority = {
  name: 'e1e2bb52-2ef5-411a-be32-fcb0255e649b',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
