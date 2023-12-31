import React, { useEffect, useState } from 'react';
import Products from '~/components/Cart/Products';
import Prices from '~/components/Cart/Prices';
import Spinning from "~/components/Spinning";
import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { Row } from 'antd';
import { discountPrice } from '~/utils';
import { getCoinUser } from '~/api/user';
import { useAuthUser } from 'react-auth-kit';
import { getCartsByUserId } from '~/api/cart';
import { RESPONSE_CODE_SUCCESS } from '~/constants';

///
const cx = classNames.bind(styles);
///

const Cart = () => {
    /// variables
    const auth = useAuthUser();
    const user = auth();
    const initialTotalPrice = {
        originPrice: 0,
        discountPrice: 0,
        totalPriceProductDiscount: 0,
        totalPriceCouponDiscount: 0,
        totalPriceCoinDiscount: 0
    }
    ///

    /// states
    const [carts, setCarts] = useState([])
    const [reloadCartsFlag, setReloadCartsFlag] = useState(false)
    const [cartDetailIdSelecteds, setCartDetailIdSelecteds] = useState([]);
    const [cartDetails, setCartDetails] = useState([]); // all cart detail from carts
    const [totalPrice, setTotalPrice] = useState(initialTotalPrice);
    const [userCoin, setUserCoin] = useState(0);
    const [isUseCoin, setIsUseCoin] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [reloadCoinFlag, setReloadCoinFlag] = useState(false);
    const [couponSelecteds, setCouponSelecteds] = useState([]); // object type {shopId,couponCode,priceDiscount,minTotalOrderValue,productIds,quantity,couponTypeId}
    const [isLoadingCartInfo, setIsLoadingCartInfo] = useState(true);
    ///

    /// handles
    const loadingCartInfo = () => {
        setIsLoadingCartInfo(true);
    }

    const unLoadingCartInfo = () => {
        setIsLoadingCartInfo(false);
    }

    const getCouponCodeSelecteds = (shopId) => {
        if (couponSelecteds.length === 0) return;
        let couponCode = '';
        const coupon = couponSelecteds.find(x => x.shopId === shopId);
        if (coupon) {
            couponCode = coupon.couponCode;
        }
        return couponCode;
    }

    const getPriceDiscountCouponSelecteds = (shopId) => {
        if (couponSelecteds.length === 0) return 0;
        let priceDiscount = 0;
        const coupon = couponSelecteds.find(x => x.shopId === shopId);
        if (coupon) {
            priceDiscount = coupon.priceDiscount;
        }
        return priceDiscount;
    }
    ///


    /// useEffects
    useEffect(() => {
        if (user === null || user === undefined) return;
        loadingCartInfo();

        getCartsByUserId(user.id)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        const result = data.result;
                        setCarts(result);
                    }
                }
            })
            .catch(() => { }).finally(() => {
                setTimeout(() => {
                    unLoadingCartInfo();
                }, 500)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadCartsFlag])

    useEffect(() => {
        if (user === null || user === undefined) return;
        getCoinUser(user.id)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    if (data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                        if (userCoin !== data.result.coin) {
                            setUserCoin(data.result.coin);
                        }
                    }
                }
            }).catch(() => { })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadCoinFlag])


    useEffect(() => {

        const calculatorPrice = (cartDetailIdSelecteds) => {
            let newTotalPrice = {
                originPrice: 0,
                discountPrice: 0,
                totalPriceProductDiscount: 0,
                totalPriceCouponDiscount: 0,
                totalPriceCoinDiscount: 0
            }

            if (cartDetailIdSelecteds.length > 0) {
                // filter cart detail
                const cartDetailSelected = filterCartDetail(cartDetailIdSelecteds);;

                // calculator price
                if (cartDetailSelected) {
                    let totalOriginPrice = cartDetailSelected.reduce((accumulator, currentValue) => {
                        return accumulator + (currentValue.productVariantPrice * currentValue.quantity);
                    }, 0);


                    let totalDiscountPrice = cartDetailSelected.reduce((accumulator, currentValue) => {
                        return accumulator + (discountPrice(currentValue.productVariantPrice, currentValue.productVariantDiscount) * currentValue.quantity);
                    }, 0);

                    // total price discount product
                    const newTotalPriceProductDiscount = totalOriginPrice - totalDiscountPrice;

                    // total price coupons shop
                    let newTotalPriceCouponDiscount = 0;
                    if (couponSelecteds.length > 0) {
                        newTotalPriceCouponDiscount = couponSelecteds.reduce((accumulator, currentValue) => {
                            return accumulator + currentValue.priceDiscount;
                        }, 0);

                        // sub total discount price
                        totalDiscountPrice -= newTotalPriceCouponDiscount;
                    }

                    // total price coin
                    let totalPriceCoinDiscount = 0;

                    if (isUseCoin && userCoin > 0 && totalDiscountPrice > 0) {
                        if (totalDiscountPrice <= userCoin) {
                            totalPriceCoinDiscount = totalDiscountPrice;
                            totalDiscountPrice = 0;
                        }
                        else {
                            totalPriceCoinDiscount = userCoin;
                            totalDiscountPrice -= totalPriceCoinDiscount;
                        }
                    }

                    newTotalPrice = {
                        ...totalPrice,
                        originPrice: totalOriginPrice > 0 ? totalOriginPrice : 0,
                        discountPrice: totalDiscountPrice > 0 ? totalDiscountPrice : 0,
                        totalPriceProductDiscount: newTotalPriceProductDiscount > 0 ? newTotalPriceProductDiscount : 0,
                        totalPriceCouponDiscount: newTotalPriceCouponDiscount > 0 ? newTotalPriceCouponDiscount : 0,
                        totalPriceCoinDiscount: totalPriceCoinDiscount > 0 ? totalPriceCoinDiscount : 0
                    }
                }
            }
            setTotalPrice(newTotalPrice);
        }

        calculatorPrice(cartDetailIdSelecteds)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartDetailIdSelecteds, carts, couponSelecteds, isUseCoin])

    // get cart details from carts
    useEffect(() => {
        const getCartDetails = (carts) => {
            const cartDetails = [];
            for (let i = 0; i < carts.length; i++) {
                const products = carts[i].products;
                if (products) cartDetails.push(products);
            }

            // set cart detail state
            setCartDetails([].concat(...cartDetails));
        }

        getCartDetails(carts);
    }, [carts])

    useEffect(() => {
        if (cartDetailIdSelecteds.length === 0) {
            setIsUseCoin(false);
        }

    }, [cartDetailIdSelecteds])

    useEffect(() => {
        if (couponSelecteds.length > 0) {

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartDetailIdSelecteds])
    ///

    /// functions
    const filterCartDetail = (cartDetailIds) => {
        const cartDetails = [];
        for (let i = 0; i < carts.length; i++) {
            const products = carts[i].products;
            const filterProducts = products.filter(x => cartDetailIds.includes(x.cartDetailId));

            if (filterProducts) {
                cartDetails.push(filterProducts);
            }
        }
        return [].concat(...cartDetails);
    }

    const reloadCarts = () => {
        setReloadCartsFlag(!reloadCartsFlag);
    }
    ///


    /// data props
    const dataPropProductComponent = {
        carts: carts,
        cartDetailIdSelecteds: cartDetailIdSelecteds,
        setCartDetailIdSelecteds: setCartDetailIdSelecteds,
        reloadCarts: reloadCarts,
        couponSelecteds: couponSelecteds,
        setCouponSelecteds: setCouponSelecteds,
        coupons: coupons,
        setCoupons: setCoupons,
        getCouponSelecteds: getCouponCodeSelecteds,
        totalPrice: totalPrice,
        cartDetails: cartDetails,
        getPriceDiscountCouponSelecteds: getPriceDiscountCouponSelecteds
    }

    const dataPropPriceComponent = {
        carts: carts,
        totalPrice: totalPrice,
        userCoin: userCoin,
        setIsUseCoin: setIsUseCoin,
        cartDetailIdSelecteds: cartDetailIdSelecteds,
        setCartDetailIdSelecteds: setCartDetailIdSelecteds,
        isUseCoin: isUseCoin,
        reloadCarts: reloadCarts,
        getCouponCodeSelecteds: getCouponCodeSelecteds
    }
    ///

    return (
        <>
            {
                <Spinning wrapperClassName={cx('ant-spin-container', 'ant-spin-dot')} spinning={isLoadingCartInfo}>
                    <Row>
                        <Products dataPropProductComponent={dataPropProductComponent} />
                        <Prices dataPropPriceComponent={dataPropPriceComponent} />
                    </Row>
                </Spinning>
            }

        </>
    )
}

export default Cart

