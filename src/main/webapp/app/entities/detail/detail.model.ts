export interface IDetail {
  id: string;
  discord?: string | null;
  total?: string | null;
}

export type NewDetail = Omit<IDetail, 'id'> & { id: null };
