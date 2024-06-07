import { IUser } from 'app/entities/user/user.model';
import { Membership } from 'app/entities/enumerations/membership.model';

export interface IDetail {
  id: string;
  discord?: string | null;
  sourceId?: string | null;
  sourceChannel?: string | null;
  total?: string | null;
  login?: string | null;
  membership?: keyof typeof Membership | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewDetail = Omit<IDetail, 'id'> & { id: null };
