export interface ResetPassword {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}