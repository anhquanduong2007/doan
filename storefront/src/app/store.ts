import { configureStore } from '@reduxjs/toolkit';
import counterSlice from '../features/counter/counterSlice';
// ...
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage,
}

const counterReducer = persistReducer(persistConfig, counterSlice)

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== 'production'
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
