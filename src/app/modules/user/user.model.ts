export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: EUserStatus;
}

export enum EUserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
