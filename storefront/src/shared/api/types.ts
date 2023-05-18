export interface IResponse<T extends {}> {
  code: number;
  isValidate?: boolean;
  errors?: Array<{
      fieldError: string;
      message: string;
  }>;
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  data?: T;
  message?: string;
  fieldError?: string;
}
