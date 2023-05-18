import * as React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loading from './components/Loading'

import { routers } from './routers'
const App = () => {
  return (
    <React.Suspense fallback={<Loading />}>
      <BrowserRouter>
        <Header />
        <Routes>
          {
            routers.map((route: any, index) => (
              route.children ? (
                <Route path={route.path} key={index}>
                  <Route index element={route.element} />
                  {
                    route.children.map((childRoute: any, childIndex: number) => (
                      <Route
                        key={childRoute.path}
                        path={childRoute.path}
                        element={childRoute.element}
                      />
                    ))
                  }
                </Route>
              ) : (
                <Route key={index} path={route.path} element={route.element} />
              )
            ))
          }
        </Routes>
        <Footer />
      </BrowserRouter>
    </React.Suspense >
  );
}

export default App;
