import { lazy } from 'react'

const HomePage = lazy(() => import('./pages/HomePage'));

export const routes = [
  {
    path: '/',
    element: HomePage
  },
  {
    path: '/products',
    element: HomePage,
    children: [
      {
        path: '/:id',
        element: HomePage
      }
    ]
  }
]