import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { RedeemStatus } from 'app/entities/enumerations/redeem-status.model';

export interface IRedeem {
  id: string;
  date?: dayjs.Dayjs | null;
  status?: keyof typeof RedeemStatus | null;
  type?: string | null;
  author?: string | null;
  login?: string | null;
  amount?: string | null;
  code?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewRedeem = Omit<IRedeem, 'id'> & { id: null };
