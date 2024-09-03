export * from "./passwords"
export interface ServerResponse<T = any> {
    success?: boolean,
    statusCode?: number
    code?: number | string,
    data?: T
    message?: string,
    errors?: any[]
    stack?: any,
}

