import * as React from "react";
import { Link } from "react-router-dom";
import { Search, User, ShoppingBag, Menu, X as Close } from "react-feather"

import Logo from "../../assets/logo/logo-01.png";

import "./header.scss";

const Header = () => {
  const [mobileOpenMenu, setMobileOpenMenu] = React.useState(false)

  return (
    <>
      <header className="sticky shadow lg:fixed lg:shadow-none top-0 bg-white lg:bg-transparent z-50 w-full">
        <div className="flex px-4 mx-auto h-16 xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm justify-between items-center">
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
              <User size={24} />
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
                <div className="flex gap-2 justify-end p-5 bg-[#f3f4f6]">
                  <p>Main Menu</p>
                  <Close size={24} className="cursor-pointer" onClick={() => setMobileOpenMenu(false)}/>
                </div>
                <ul className="flex justify-end flex-col text-end p-5 pt-0">
                  <li className="p-4 border-b border-[#D1D5DB]">
                    <Link className="hover:text-primary transition-all ease-in-out duration-[0.2s] font-medium text-sm" to="/product">Product</Link>
                  </li>
                  <li className="p-4 border-b border-[#D1D5DB]">
                    <Link className="hover:text-primary transition-all ease-in-out duration-[0.2s] font-medium text-sm" to="/category">Category</Link>
                  </li>
                  <li className="p-4 border-b border-[#D1D5DB]">
                    <Link className="hover:text-primary transition-all ease-in-out duration-[0.2s] font-medium text-sm" to="/about">About</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : null
      }

    </>
  );
};

export default Header;