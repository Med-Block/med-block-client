import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import UserData from "../../data_types/UserData";

interface UserState {
    currentUser: UserData | null
}

const initialState: UserState = {
    currentUser: null
};

export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<UserData | null>) => {
            state.currentUser = action.payload;
        }
    }
});

export default UserSlice.reducer;
export const { setCurrentUser } = UserSlice.actions;
