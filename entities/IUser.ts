// interface IUser
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  generateAuthToken: () => string; // generateAuthToken method
}
