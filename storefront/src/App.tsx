import * as React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFoundPage from "./pages/NotFound";
import HomePage from "./pages/HomePage/home";
import ProductPage from "./pages/ProductPage/productPage";
import ProductDetailPage from "./pages/ProductDetailPage/productDetailPage";
import LoginPage from "./pages/LoginPage/LoginPage";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='*' element={<NotFoundPage />} />
        <Route path='/' element={<HomePage />} />
        <Route path='login' element={<LoginPage />} />
        <Route path='products'>
          <Route index element={<ProductPage />} />
          <Route path=':id' element={<ProductDetailPage />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
