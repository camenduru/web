import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { ICredit } from 'app/entities/credit/credit.model';
import { JobStatus } from 'app/entities/enumerations/job-status.model';
import { JobSource } from 'app/entities/enumerations/job-source.model';

export interface IJob {
  id: string;
  date?: dayjs.Dayjs | null;
  status?: keyof typeof JobStatus | null;
  source?: keyof typeof JobSource | null;
  sourceID?: string | null;
  sourceChannel?: string | null;
  sourceUsername?: string | null;
  command?: string | null;
  server?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  credit?: ICredit | null;
}

export type NewJob = Omit<IJob, 'id'> & { id: null };
