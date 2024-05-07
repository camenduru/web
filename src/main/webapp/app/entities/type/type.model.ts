export interface IType {
  id: string;
  type?: string | null;
  amount?: string | null;
  schema?: string | null;
  model?: string | null;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  readme?: string | null;
  web?: string | null;
  paper?: string | null;
  code?: string | null;
  jupyter?: string | null;
  isDefault?: boolean | null;
  isActive?: boolean | null;
}

export type NewType = Omit<IType, 'id'> & { id: null };
