import * as React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFound';
import LoginPage from './pages/Login';
import ProductListPage from 'src/pages/Catalog/Products/list';
import ProductCreatePage from 'src/pages/Catalog/Products/create';
import AdministratorListPage from 'src/pages/Settings/Administrators/list';
import RoleListPage from 'src/pages/Settings/Roles/list';
import RoleCreateUpdatePage from 'src/pages/Settings/Roles/create-update';
import AdministratorCreateUpdatePage from './pages/Settings/Administrators/create-update';
import CustomerListPage from './pages/Customer/list';
import CustomerCreateUpdatePage from './pages/Customer/create-update';

interface ProtectRouteProps {
  children: React.ReactNode
}

const ProtectRoute = ({ children }: ProtectRouteProps) => {
  const accessToken = localStorage.getItem("accessToken")
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!accessToken) {
      navigate('/login')
    }
  }, [accessToken])

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  )
}
const App = () => {
  return (
    <BrowserRouter>
      <ProtectRoute>
        <Routes>
          <Route path='*' element={<NotFoundPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/' element={<HomePage />} >
            <Route path='catalog'>
              <Route path='products'>
                <Route index element={<ProductListPage />} />
                <Route path='create' element={<ProductCreatePage />} />
              </Route>
            </Route>
            <Route path='customers'>
              <Route index element={<CustomerListPage />} />
              <Route path='create' element={<CustomerCreateUpdatePage />} />
              <Route path='update/:id' element={<CustomerCreateUpdatePage />} />
            </Route>
            <Route path='settings'>
              <Route path='administrators'>
                <Route index element={<AdministratorListPage />} />
                <Route path='create' element={<AdministratorCreateUpdatePage />} />
                <Route path='update/:id' element={<AdministratorCreateUpdatePage />} />
              </Route>
              <Route path='roles'>
                <Route index element={<RoleListPage />} />
                <Route path='create' element={<RoleCreateUpdatePage />} />
                <Route path='update/:id' element={<RoleCreateUpdatePage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </ProtectRoute>
    </BrowserRouter>
  );
};

export default App;
