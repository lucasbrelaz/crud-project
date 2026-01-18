export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: EUserStatus;
  createdAt: string;
}

export enum EUserStatus {
  ACTIVE = 'Ativo',
  INACTIVE = 'Inativo',
}
