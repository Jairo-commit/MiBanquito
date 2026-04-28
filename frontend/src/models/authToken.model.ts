export interface AuthToken {
    access: string;
    refresh: string;
}

export interface LoginPayload {
    username: string;
    password: string;
}
