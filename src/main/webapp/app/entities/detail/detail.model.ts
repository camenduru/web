import { IUser } from 'app/entities/user/user.model';

export interface IDetail {
  id: string;
  discord?: string | null;
  sourceId?: string | null;
  sourceChannel?: string | null;
  total?: string | null;
  login?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewDetail = Omit<IDetail, 'id'> & { id: null };
