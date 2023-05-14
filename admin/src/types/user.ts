export interface User {
    id: number
    first_name: string
    last_name: string
    gender: number
    date_of_birth: string
    email: string
    phone: string
    active: number
    created_date: string,
    modified_date: string,
    created_by: number,
    modified_by: number,
    users_role: Array<{ role_id: number }>
}