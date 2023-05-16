import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, User, ShoppingBag, Menu, X as Close, Trash2 } from "react-feather"

import Login from '../Login'
import Register from "../Register";

import Logo from "../../assets/logo/logo-01.png";

import "./header.scss";
import { useSelector } from "react-redux";
import { Button, Card, CardBody, CardFooter, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Heading, Image, Stack, Text, useDisclosure, useToast } from "@chakra-ui/react";

const Header = () => {
  const [mobileOpenMenu, setMobileOpenMenu] = React.useState(false)
  const [show, setShow] = React.useState<string>()
  const [isShowLogin, setIsShowLogin] = React.useState<boolean>(false)
  const [isSwitchLoginAndRegister, setIsSwitchLoginAndRegister] = React.useState<boolean>(true)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const storeAuth: any = useSelector<any>(state => state.auth)

  console.log(' storeAuth.register', storeAuth.register)

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

  React.useEffect(() => {
    if (isShowLogin) {
      window.document.body.style.overflow = 'hidden'
    } else {
      window.document.body.style.overflow = 'auto'
    }
  }, [isShowLogin])

  React.useEffect(() => {
    if (storeAuth && storeAuth?.isLogin) {
      setIsShowLogin(false)
      toast({
        title: `Login successfully!`,
        status: 'success',
        isClosable: true,
      })
    }
    if (storeAuth && storeAuth.register?.data?.success) {
      toast({
        title: `Register successfully!`,
        status: 'success',
        isClosable: true,
      })
      setIsSwitchLoginAndRegister(true)
    }
  }, [storeAuth])


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
                <Link className="hover:text-primary transition-all ease-in-out duration-[0.2s] font-medium text-sm" to="/products">Product</Link>
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
              <ShoppingBag size={24} onClick={() => onOpen()} />
            </div>
            <div className="cursor-pointer flex flex-row gap-1">
              <User size={24} onClick={() => showLogin()} />
              {
                storeAuth && storeAuth?.login?.data?.success ? <span className="hidden lg:block md:block">Hi, {storeAuth?.login?.data?.data?.last_name}</span> : null
              }
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
            <div className="bg-white z-[52] fixed top-0 right-0 bottom-0 md:w-[35%] w-3/4">
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

      <Drawer onClose={onClose} isOpen={isOpen} size='sm'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader className="font-bold uppercase" borderBottomWidth='1px'>your cart</DrawerHeader>
          <DrawerBody marginTop={'30px'} display='flex' flexDirection='column' gap='20px' height='500px' overflowY='auto'>
            <Card
              direction={{ base: 'column', sm: 'row' }}
              variant='outline'
              border='none'
              borderRadius='none'
              flexShrink='0'
              gap='0 20px'
            >
              <Image
                objectFit='cover'
                width={{ base: '100%', sm: '80px' }}
                height={{ base: '100%', sm: '100px' }}
                display={'flex'}
                flexShrink={'0'}
                src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
                alt='Caffe Latte'
              />
              <Stack padding='0px' width='100%'>
                <CardBody padding={'0px'} display='flex' flexDirection='row' justifyContent='space-between'>
                  <div className="flex flex-col justify-between">
                    <div className="flex flex-col">
                      <Link to={'/'} className="font-bold transition duration-150 hover:text-primary">The perfect latte</Link>
                      <p className="text-[#666] text-sm">Red / L</p>
                      <p>Quantity: 2</p>
                    </div>
                    <p>Price: 2</p>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <Trash2 size={20} className="cursor-pointer transition duration-150 hover:text-primary" />
                    <p> x $12.2</p>
                  </div>
                </CardBody>
              </Stack>
            </Card>
            <Card
              direction={{ base: 'column', sm: 'row' }}
              variant='outline'
              border='none'
              borderRadius='none'
              flexShrink='0'
              gap='0 20px'
            >
              <Image
                objectFit='cover'
                width={{ base: '100%', sm: '80px' }}
                height={{ base: '100%', sm: '100px' }}
                display={'flex'}
                flexShrink={'0'}
                src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
                alt='Caffe Latte'
              />
              <Stack padding='0px' width='100%'>
                <CardBody padding={'0px'} display='flex' flexDirection='row' justifyContent='space-between'>
                  <div className="flex flex-col justify-between">
                    <div className="flex flex-col">
                      <Link to={'/'} className="font-bold transition duration-150 hover:text-primary">The perfect latte</Link>
                      <p className="text-[#666] text-sm">Red / L</p>
                      <p>Quantity: 2</p>
                    </div>
                    <p>Price: 2</p>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <Trash2 size={20} className="cursor-pointer transition duration-150 hover:text-primary" />
                    <p> x $12.2</p>
                  </div>
                </CardBody>
              </Stack>
            </Card>
            
            
          </DrawerBody>
          <DrawerFooter display='flex' flexDirection='column'>
            <div className="w-full flex flex-col gap-5">
              <p className="font-bold text-left">Total: $12.22</p>
              <div className="flex justify-center gap-4 pb-14" >
                <Button
                  className="w-[50%] !bg-primary text-white uppercase hover:!bg-[#5866c9]"
                  variant='solid'
                  isLoading={false}
                >
                  View Cart
                </Button>
                <Button
                  className="w-[50%] !bg-primary text-white uppercase hover:!bg-[#5866c9]"
                  variant='solid'
                  isLoading={false}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;