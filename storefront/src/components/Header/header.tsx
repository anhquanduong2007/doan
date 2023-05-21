import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, ShoppingBag } from "react-feather"
import Logo from "../../assets/logo/logo-01.png";
import {
    Card,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    useDisclosure,
    useToast,
    Menu,
    MenuButton,
    MenuList,
    MenuItem
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { createAxiosJwt } from "src/axios/axiosInstance";
import { deleteFromCart, getListProductOnCart } from "src/features/cart/action";
import { Button, Row, Col } from 'antd'
import formatMoney from "src/shared/utils/formatMoney";
import { logOut } from "src/features/auth/action";

const Header = () => {
    // ** State
    const [show, setShow] = React.useState<string>()
    const [refresh, setRefresh] = React.useState<boolean>(false)

    // ** Variables
    const cart = useAppSelector((state) => state.cart);
    const auth = useAppSelector((state) => state.auth)
    const checkout = useAppSelector((state) => state.checkout)
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Third party
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const { pathname } = useLocation()
    const navigate = useNavigate();

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
    }, [localStorage.getItem("accessToken"), refresh, cart.addToCart.loading, checkout.createOrder.result])

    // ** Function handle
    const controlNavbar = () => {
        if (window.scrollY > 80) {
            setShow("!bg-white !shadow");
        } else {
            setShow("");
        }
    };

    const dataCartToRender = () => {
        if (!cart.listProductOnCart.loading && cart.listProductOnCart.result && cart.listProductOnCart.result.length) {
            return cart.listProductOnCart.result.map((p, index) => {
                return (
                    <Card key={index} variant="outline" padding="10px">
                        <Row gutter={[16, 0]}>
                            <Col span={8}>
                                <img src={p.product_variant?.featured_asset ? p.product_variant.featured_asset?.url : "https://inantemnhan.com.vn/wp-content/uploads/2017/10/no-image.png"} className="w-full object-cover" />
                            </Col>
                            <Col span={16}>
                                <p className="font-bold">{p.product_variant.name}</p>
                                <p className="text-xs text-[#808080]">{p.product_variant.sku}</p>
                                <p>Quantity: <span className="font-semibold">{p.quantity}</span></p>
                                <p>Price: {formatMoney(p.product_variant.price)}</p>
                                <p className="font-bold">Total: {formatMoney(p.product_variant.price * p.quantity)}</p>
                            </Col>
                        </Row>
                        <div className="flex justify-end">
                            <Button
                                type="primary"
                                onClick={() => {
                                    navigate(`/checkout/${p.id}`)
                                    onClose()
                                }}
                            >
                                Checkout
                            </Button>
                            <Button
                                type="primary"
                                className="ml-2"
                                danger
                                loading={cart.deleteProductFromCart.loading}
                                onClick={() => {
                                    deleteFromCart({
                                        axiosClientJwt,
                                        dispatch,
                                        id: p.product_variant.id,
                                        refresh,
                                        setRefresh,
                                        toast
                                    })
                                }}>
                                Delete
                            </Button>
                        </div>
                    </Card>
                )
            })
        }
        return null
    }

    return (
        <React.Fragment>
            <header className={pathname != '/' ? `sticky shadow lg:fixed top-0 bg-white z-50 w-full transition duration-200 ${show}` : `sticky shadow lg:fixed lg:shadow-none top-0 bg-white lg:bg-transparent z-50 w-full transition duration-200 ${show}`}>
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
                                        <Menu>
                                            <MenuButton as={"span"}>
                                                Hi, {!auth.login.loading && auth.login.result ? auth.login.result.first_name + auth.login.result.last_name : ''}
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem onClick={() => { navigate('/account') }}>My account</MenuItem>
                                                <MenuItem onClick={() => logOut(dispatch, navigate, axiosClientJwt, toast)}>Logout</MenuItem>
                                            </MenuList>
                                        </Menu>
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
                        {dataCartToRender()}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </React.Fragment>
    );
};

export default Header;