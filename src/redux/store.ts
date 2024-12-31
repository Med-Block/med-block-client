import { configureStore } from "@reduxjs/toolkit";
import { UserSlice } from "./slices/userSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const reduxStore = configureStore({
    reducer: {
        user: UserSlice.reducer
    }
});

export const useAppDispatch: () => typeof reduxStore.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof reduxStore.getState>> = useSelector;
