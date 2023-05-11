import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, User, ShoppingBag, Menu, X as Close } from "react-feather"

import Login from '../Login'
import Register from "../Register";

import Logo from "../../assets/logo/logo-01.png";

import "./header.scss";

const Header = () => {
  const [mobileOpenMenu, setMobileOpenMenu] = React.useState(false)
  const [show, setShow] = React.useState<string>()
  const [isShowLogin, setIsShowLogin] = React.useState<boolean>(false)
  const [isSwitchLoginAndRegister, setIsSwitchLoginAndRegister] = React.useState<boolean>(true)

  const { pathname } = useLocation()

  const showLogin = () => {
    setIsShowLogin(true)
  }

  const controlNavbar = () => {
    if (window.scrollY > 80) {
      setShow("!bg-white !shadow");
    } else {
      setShow("");
    }
  };

  const switchLoginAndRegister = () => {
    setIsSwitchLoginAndRegister(!isSwitchLoginAndRegister)
  }

  React.useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, []);

  React.useEffect(() => {
    setMobileOpenMenu(false)
  }, [pathname])

  return (
    <>
      <header className={pathname != '/' ? `sticky shadow lg:fixed top-0 bg-white z-50 w-full transition duration-200 ${show}` : `sticky shadow lg:fixed lg:shadow-none top-0 bg-white lg:bg-transparent z-50 w-full transition duration-200 ${show}`}>
        <div className="flex px-4 mx-auto h-16 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm justify-between items-center">
          <div className="flex items-center gap-8">
            <nav className="shrink-0">
              <Link to="/" className="logo">
                <img src={Logo} alt="img-logo" />
              </Link>
            </nav>
            <ul className="hidden lg:flex">
              <li className="p-4">
                <Link className="hover:text-primary transition-all ease-in-out duration-[0.2s] font-medium text-sm" to="/product">Product</Link>
              </li>
              <li className="p-4">
                <Link className="hover:text-primary transition-all ease-in-out duration-[0.2s] font-medium text-sm" to="/category">Category</Link>
              </li>
              <li className="p-4">
                <Link className="hover:text-primary transition-all ease-in-out duration-[0.2s] font-medium text-sm" to="/about">About</Link>
              </li>
            </ul>
          </div>
          <div className="flex gap-5">
            <div className="cursor-pointer">
              <Search size={24} />
            </div>
            <div className="cursor-pointer">
              <ShoppingBag size={24} />
            </div>
            <div className="cursor-pointer">
              <User size={24} onClick={() => showLogin()} />
            </div>
            <button className="lg:hidden cursor-pointer" onClick={() => setMobileOpenMenu(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>
      {
        mobileOpenMenu ? (
          <div className="transition-all ease-in-out duration-[0.2s]">
            <button className="fixed z-[51] inset-x-0 inset-y-0 bg-[black] opacity-50 transition-all ease-in-out duration-[0.2s]" onClick={() => setMobileOpenMenu(false)}></button>
            <div className="bg-white z-[52] absolute top-0 right-0 bottom-0 md:w-1/2 w-3/4">
              <div className="">
                <div className="flex gap-2 justify-between p-5 bg-[#f3f4f6]">
                  <p>Main Menu</p>
                  <Close size={24} className="cursor-pointer transition-all ease-in-out duration-[0.3s] hover:text-primary" onClick={() => setMobileOpenMenu(false)} />
                </div>
                <ul className="flex justify-end flex-col text-start p-5 pt-0">
                  <li className="p-4 pl-0 border-b border-[#D1D5DB]">
                    <Link className="hover:text-primary transition-all ease-in-out duration-[0.2s] font-medium text-sm" to="/product">Product</Link>
                  </li>
                  <li className="p-4 pl-0 border-b border-[#D1D5DB]">
                    <Link className="hover:text-primary transition-all ease-in-out duration-[0.2s] font-medium text-sm" to="/category">Category</Link>
                  </li>
                  <li className="p-4 pl-0 border-b border-[#D1D5DB]">
                    <Link className="hover:text-primary transition-all ease-in-out duration-[0.2s] font-medium text-sm" to="/about">About</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : null
      }

      {
        isShowLogin ? (
          <div className="transition-all ease-in-out duration-[0.2s]">
            <button className="fixed z-[51] inset-x-0 inset-y-0 bg-[black] opacity-50" onClick={() => setIsShowLogin(false)}></button>
            <div className="bg-white z-[52] absolute top-0 right-0 bottom-0 md:w-[35%] w-3/4">
              <div className="">
                <div className="flex gap-2 justify-between p-5 bg-[#f3f4f6]">
                  <p className="uppercase">
                    {
                      isSwitchLoginAndRegister ? 'Login' : 'Register'
                    }
                  </p>
                  <Close size={24} className="cursor-pointer transition-all ease-in-out duration-[0.3s] hover:text-primary" onClick={() => setIsShowLogin(false)} />
                </div>
                {
                  isSwitchLoginAndRegister ? (
                    <div>
                      <Login />
                      <p className='m-5 mt-0 underline cursor-pointer text-[gray] font-light' onClick={() => switchLoginAndRegister()}>New customer? Create your account</p>
                    </div>
                  ) : (
                    <div>
                      <Register />
                      <p className='m-5 mt-0 underline cursor-pointer text-[gray] font-light' onClick={() => switchLoginAndRegister()}>Already have an account? Login here</p>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        ) : null
      }

    </>
  );
};

export default Header;