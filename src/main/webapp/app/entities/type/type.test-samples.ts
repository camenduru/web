import { IType, NewType } from './type.model';

export const sampleWithRequiredData: IType = {
  id: 'e59449d7-9266-4a70-823c-7172185be03a',
  type: 'bath softly',
  amount: 'lumpy if indolent',
  schema: 'ack elevation',
  model: 'after',
  title: 'whether',
  description: 'concentrate phooey',
  image: 'shovel when fabric',
  readme: 'furthermore since against',
  web: 'throughout',
  paper: 'opposite woot',
  code: 'skewer phooey productive',
  jupyter: 'ah',
  isDefault: true,
  isActive: true,
};

export const sampleWithPartialData: IType = {
  id: '111c5a88-39aa-4627-8b60-5d19270f5ae5',
  type: 'smoothly meanwhile',
  amount: 'via violently',
  schema: 'recollect reinstate belt',
  model: 'knuckle next barring',
  title: 'psych why rudely',
  description: 'strict',
  image: 'woot yum break',
  readme: 'aggressive ack',
  web: 'gauge aha',
  paper: 'duck via',
  code: 'complete longingly bleakly',
  jupyter: 'beneath stamp bandwidth',
  isDefault: false,
  isActive: false,
};

export const sampleWithFullData: IType = {
  id: 'd4c5a870-d4dc-4eff-aa51-b09bdf5cfe88',
  type: 'vivaciously',
  amount: 'conflate mom provided',
  schema: 'joyfully ew out',
  model: 'plus except',
  title: 'who mercerize surprisingly',
  description: 'critical likewise',
  image: 'huzzah',
  readme: 'dual queasily',
  web: 'soundproof that above',
  paper: 'yesterday aggravating',
  code: 'nervously shampoo reassert',
  jupyter: 'aw',
  isDefault: true,
  isActive: true,
};

export const sampleWithNewData: NewType = {
  type: 'mmm round outgoing',
  amount: 'the geez',
  schema: 'viciously',
  model: 'incidentally safe',
  title: 'knavishly brr innocent',
  description: 'although',
  image: 'inasmuch',
  readme: 'into',
  web: 'stepping-stone however barring',
  paper: 'after tremor toward',
  code: 'exhume unacceptable rewarding',
  jupyter: 'sweetly',
  isDefault: false,
  isActive: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
