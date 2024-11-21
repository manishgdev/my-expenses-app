import { configureStore } from "@reduxjs/toolkit";
import bankReducer from './reducers/bankReducer'

const store = configureStore({reducer: {
    bankStore: bankReducer
}})

export type RootState = ReturnType<typeof store.getState>

export default store

export type AppDispatch = typeof store.dispatch