import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    user : Record<string, unknown> | null;
    loading : boolean
}

const initialState:UserState = {
    user:localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null,
    loading : false
}

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers: {
        setUser(state,action: PayloadAction<Record<string,unknown> | null>){
            state.user = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        }
    }
})

export const {setUser,setLoading} = userSlice.actions;
export default userSlice.reducer;