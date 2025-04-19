import {AxiosRequestOptions, Methods} from "./types";
import axios, {AxiosError} from "axios";

export interface HTTPRequestOptions {
    baseURL?: string,
    route?: string,
    data?: any,
    params?: any,
    method: Methods,
    headers?: any,
    auth?: any
}

export default class HttpClient {
    public baseURL: string

    protected async request(
        options: HTTPRequestOptions,
    ) {
        const baseURL = options.baseURL || this.baseURL
        const {
            route,
            data,
            params,
            method,
            headers,
            auth
        } = options;


        let requestOptions: AxiosRequestOptions = {
            url: `${baseURL}${route}`,
            method: method,
            params,
            data,
            headers: headers,
            auth: auth
        }

        try {
            const resp = await axios(requestOptions);
            return resp.data
        } catch (e: any) {
            console.error(e)
            if (e instanceof AxiosError) {
                return e.response!.data
            }
            throw e
        }
    }
}

export {
    Methods,
    HttpClient
}
