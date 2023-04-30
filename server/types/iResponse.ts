export class IResponse<T extends {}> {
    code: number;
    success: boolean;
    message?: string;
    accessToken?: string;
    refreshToken?: string;
    fieldError?: string;
    data?: T;
}
