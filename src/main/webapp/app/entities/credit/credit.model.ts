import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { CreditStatus } from 'app/entities/enumerations/credit-status.model';
import { CreditSource } from 'app/entities/enumerations/credit-source.model';

export interface ICredit {
  id: string;
  date?: dayjs.Dayjs | null;
  status?: keyof typeof CreditStatus | null;
  amount?: string | null;
  source?: keyof typeof CreditSource | null;
  total?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewCredit = Omit<ICredit, 'id'> & { id: null };
