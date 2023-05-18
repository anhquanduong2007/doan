import { lazy } from 'react'
import ProtectedRoute from './components/ProtectedRoute/protectedRoute';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const ShoppingCartPage = lazy(() => import('./pages/ShoppingCartPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

export const routers = [
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/products',
    element: <ProductPage />,
    children: [
      {
        path: ':id',
        element: <ProductDetailPage />
      }
    ]
  },
  {
    path: '/about',
    element: <AboutPage />
  },
  {
    path: '/checkout',
    element: <ShoppingCartPage />
  },
  // {
  //   path: '*',
  //   element: <NotFound />
  // }
]