import { Dispatch } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { NavigateFunction } from "react-router-dom";
import { setLoading, setToken } from "../../slices/adminSlice";
import { apiconnector } from "../apiconnector";
import { endpoints } from "../apis";
import { setUser } from "../../slices/userSlice";

const { LOGIN_API } = endpoints;

interface AdminData {
    token: string;
    user: {
        username: string;
    };
}

interface LoginResponse {
    success: boolean;
    message?: string;
    data?: AdminData;
}

export function login(username: string, password: string, navigate: NavigateFunction) {
    return async (dispatch: Dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiconnector('POST', LOGIN_API, { username, password }) as { data: LoginResponse };

            if (!response.data.success) {
                toast.error(response.data.message as string)
                throw new Error(response.data.message || "Login failed");
            }

            toast.success("Login Successful!");

            console.log(response);

            const token = response.data.data?.token || "";
            const user = response.data.data?.user || { username: "" };

            dispatch(setToken(token));
            dispatch(setUser(user));

            localStorage.setItem('token', JSON.stringify(token));
            localStorage.setItem('user', JSON.stringify(user));

            navigate('/dashboard');
        } catch (error: unknown) {
            console.error("LOGIN API ERROR:", error);
            if (error instanceof Error) {
                toast.error(error.message || "Login Failed");
            }
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}

export function logout(navigate: NavigateFunction) {
    return (dispatch: Dispatch) => {
        dispatch(setToken(null))
        dispatch(setUser(null))
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        toast.success("Logged Out")
        navigate("/")
    }
}
