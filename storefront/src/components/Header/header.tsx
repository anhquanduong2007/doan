import * as React from "react";
import { Link, useNavigate, } from "react-router-dom";
import { User, ShoppingBag, Trash2 } from "react-feather"
import Logo from "../../assets/logo/logo-01.png";
import "./header.scss";
import { Button, Card, CardBody, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Heading, Image, Stack, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { createAxiosJwt } from "src/axios/axiosInstance";
import { getListProductOnCart } from "src/features/cart/action";

const Header = () => {
  // ** State
  const [show, setShow] = React.useState<string>()

  // ** Variables
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();

  // ** Third party
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const navigate = useNavigate();

  // ** Function handle
  const controlNavbar = () => {
    if (window.scrollY > 80) {
      setShow("!bg-white !shadow");
    } else {
      setShow("");
    }
  };

  // ** Effect
  React.useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, []);

  React.useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      getListProductOnCart({
        axiosClientJwt,
        dispatch,
        toast
      })
    }
  }, [localStorage.getItem("accessToken")])

  console.log(cart)
  return (
    <React.Fragment>
      <header className={`sticky shadow lg:fixed lg:shadow-none top-0 bg-white lg:bg-transparent z-50 w-full transition duration-200 ${show}`}>
        <div className="flex px-4 mx-auto h-16 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm justify-between items-center">
          <div className="flex items-center gap-8">
            <nav className="shrink-0">
              <Link to="/" className="logo">
                <img src={Logo} alt="img-logo" />
              </Link>
            </nav>
            <ul className="hidden lg:flex m-0">
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
            {
              localStorage.getItem("accessToken") ? (
                <div className="cursor-pointer relative">
                  <ShoppingBag size={24} onClick={() => onOpen()} />
                  <div className="bg-primary absolute -top-1 -right-1 text-white text-[0.625rem] font-medium subpixel-antialiased flex items-center justify-center leading-none rounded-full w-4 h-4">
                    <span>{!cart.listProductOnCart.loading && cart.listProductOnCart.result ? cart.listProductOnCart.result?.length : 0}</span>
                  </div>
                </div>
              ) : null
            }
            <div className="cursor-pointer flex flex-row gap-1">
              {
                localStorage.getItem("accessToken") ? (
                  <div className="flex items-end justify-center">
                    <User />
                    <div className="ml-2">Hi, Quan</div>
                  </div>
                ) : (
                  <Link to="/login" className="font-semibold">Sign In</Link>
                )
              }
            </div>
          </div>
        </div>
      </header>
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
        </DrawerContent>
      </Drawer>
    </React.Fragment>
  );
};

export default Header;