import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
    token : string | null;
    loading : boolean,
}

const initialState:AdminState = {
    token : localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token") as string) : null,
    loading:false,
}

const adminSlice = createSlice({
    name : "admin",
    initialState,
    reducers: {
        setToken(state,action:PayloadAction<string | null>) {
            state.token = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        }
    }
})

export const { setToken, setLoading } = adminSlice.actions;
export default adminSlice.reducer;