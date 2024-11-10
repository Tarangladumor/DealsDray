import axios, {AxiosResponse, Method } from "axios";

export const axiosInstance = axios.create();

export const apiconnector = async (
    method: Method,
    url: string,
    bodyData?: Record<string, unknown> | FormData,
    headers?: { [key: string]: string },
    params?: Record<string, unknown>
): Promise<AxiosResponse> => {
    return axiosInstance({
        method,
        url,
        data: bodyData || null,
        headers: headers || undefined,
        params,
    });
};
