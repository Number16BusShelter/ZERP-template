export interface AxiosRequestOptions {
    url: string
    auth?: {
        username: string,
        password: string,
    }
    method: Methods,
    headers?: any,
    data?: any,
    params?: any,
}


export enum Methods {
    'POST' = 'POST',
    'GET' = 'GET',
    'PUT' = 'PUT',
    'DELETE' = 'DELETE',
}
