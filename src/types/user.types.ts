export interface CurrentUser {
  id: number;
  name: string;
  email: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  user: CurrentUser;
}

export type User = {
  id: number;
  name: string;
  email: string;
};

export type UsersResponse = {
  success: boolean;
  message: string;
  users: User[];
};
