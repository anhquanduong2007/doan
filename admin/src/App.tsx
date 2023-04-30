import * as React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Dashboard from './components/Dashboard/dashboard';
import User from './components/User';
import { HomePage, NotFoundPage, LoginPage } from './pages';
import Products from './components/Catalog/Products/list';
import Categories from './components/Catalog/Categories/categories';
import Assets from './components/Catalog/Assets/list';
import ProductCreate from './components/Catalog/Products/create';
import Customers from './components/Customers/list';
import Roles from './components/Settings/Roles/list';
import Administrators from './components/Settings/Administrators/list';
import RoleCreateUpdate from './components/Settings/Roles/create-update';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<NotFoundPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={<HomePage />} >
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/users' element={<User />} />
          <Route path='/categories' element={<Categories />} />
          <Route path='/assets'>
            <Route index element={<Assets />} />
          </Route>
          <Route path='/products' element={<Products />} />
          <Route path='/products/create' element={<ProductCreate />} />
          <Route path='/customers'>
            <Route index element={<Customers />} />
          </Route>
          <Route path='/administrators'>
            <Route index element={<Administrators />} />
          </Route>
          <Route path='roles'>
            <Route index element={<Roles />} />
            <Route path='create' element={<RoleCreateUpdate />} />
            <Route path='update/:id' element={<RoleCreateUpdate />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
