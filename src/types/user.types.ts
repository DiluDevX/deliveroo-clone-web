export type IUser = {
  _id: string;
  createdAt: Date;
  updatedAt: Date;

  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};
