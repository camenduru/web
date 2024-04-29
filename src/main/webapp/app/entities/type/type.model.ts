export interface IType {
  id: string;
  type?: string | null;
  amount?: string | null;
}

export type NewType = Omit<IType, 'id'> & { id: null };
