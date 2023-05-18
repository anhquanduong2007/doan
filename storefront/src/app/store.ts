import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import productSlice from '../features/product/productSlice';
// ...
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['login']
}

const authReducer = persistReducer(persistConfig, authSlice)
const productReducer = persistReducer(persistConfig, productSlice)

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer
  },
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== 'production'
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
