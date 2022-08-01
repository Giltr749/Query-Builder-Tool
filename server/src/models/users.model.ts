export interface IUser {
    user_id: number,
    email: string,
    password: string,
    provider_id: string,
    secret: string,
    user_status: number,
    role_id?: number,
    role_name?: string,
    permissions: any
}


