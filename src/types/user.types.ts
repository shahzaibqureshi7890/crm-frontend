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
