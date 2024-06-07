export interface IType {
  id: string;
  type?: string | null;
  amount?: string | null;
  schema?: string | null;
  model?: string | null;
  title?: string | null;
  isDefault?: boolean | null;
  isActive?: boolean | null;
  isFree?: boolean | null;
}

export type NewType = Omit<IType, 'id'> & { id: null };
