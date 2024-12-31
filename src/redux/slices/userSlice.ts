import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserData {
    firstName: string,
    lastName: string,
    role: string
}

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
        setCurrentUser: (state, action: PayloadAction<UserData>) => {
            state.currentUser = action.payload;
        }
    }
});

export default UserSlice.reducer;
export const { setCurrentUser } = UserSlice.actions;
