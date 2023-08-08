import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authSlice from 'src/features/auth/authSlice';
import assetSlice from 'src/features/catalog/asset/assetSlice';
import roleSlice from 'src/features/setting/role/roleSlice';
import productSlice from 'src/features/catalog/product/productSlice';
import administratorSlice from 'src/features/setting/administrator/administratorSlice';
import customerSlice from 'src/features/customer/customerSlice';
import addressSlice from 'src/features/address/addressSlice';
import categorySlice from 'src/features/catalog/category/categorySlice';
import orderSlice from 'src/features/sale/order/actionSlice';
import promotionSlice from 'src/features/promotion/promotionSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  asset: assetSlice,
  role: roleSlice,
  product: productSlice,
  administrator: administratorSlice,
  customer: customerSlice,
  address: addressSlice,
  category: categorySlice,
  promotion: promotionSlice,
  order: orderSlice
})

export const store = configureStore({
  reducer: rootReducer,
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;