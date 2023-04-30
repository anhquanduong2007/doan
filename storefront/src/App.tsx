import * as React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Header from "./components/Header";
import About from "./pages/About";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
const App = () => {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='*' element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
