export interface IAxiosResponse<T> {
    response: {
        code: number
        success: boolean
        data: T
        access_token?: string
        refresh_token?: string
        fieldError?: string
        message?: string
    }
}