import * as React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Dashboard from './components/Dashboard/dashboard';
import User from './components/User';
import { HomePage, NotFoundPage, LoginPage } from './pages';
import Products from 'src/pages/Catalog/Products/list';
import ProductCreate from 'src/pages/Catalog/Products/create';
import Roles from 'src/pages/Settings/Roles/list';
import RoleCreateUpdate from 'src/pages/Settings/Roles/create-update';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<NotFoundPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={<HomePage />} >
          <Route path='catalog'>
            <Route path='products'>
              <Route index element={<Products />} />
              <Route path='create' element={<ProductCreate />} />
            </Route>
          </Route>
          <Route path='settings'>
            <Route path='roles'>
              <Route index element={<Roles />} />
              <Route path='create' element={<RoleCreateUpdate />} />
              <Route path='update/:id' element={<RoleCreateUpdate />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
