export interface AuthLoginResponse {
    response: {
        accessToken: string
        code: number
        message: string
        refreshToken: string
        success: boolean
        user: {
            address: string
            created_at: string
            email: string
            first_name: string
            gender: number
            id: number
            last_name: string
            phone: string
            status: number
            updated_at: string
        }
    }
}

