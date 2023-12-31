import React, { useEffect, useState, useContext } from "react";
import classNames from 'classnames/bind';
import Spinning from "~/components/Spinning";
import styles from '~/pages/Cart/Cart.module.scss';
import ProductSpecifics from "../ProductSpecifics";
import { useAuthUser } from 'react-auth-kit';
import { formatPrice, ParseDateTime } from "~/utils";
import { Card, Space, Row, Button, Avatar } from "antd";
import { getProductSpecificOfCoupon } from "~/api/product";
import { getCouponDetailCustomerById } from "~/api/coupon";
import { Link, useNavigate, useParams } from "react-router-dom";
import { NotificationContext } from "~/context/UI/NotificationContext";
import { RESPONSE_CODE_DATA_NOT_FOUND, RESPONSE_CODE_SUCCESS, COUPON_TYPE_SPECIFIC_PRODUCTS, COUPON_TYPE_ALL_PRODUCTS_OF_SHOP } from "~/constants";

///
const cx = classNames.bind(styles);
require('moment/locale/vi');
const moment = require('moment');
///

/// styles
const styleContainer = { width: '100%', height: '100vh', backgroundColor: '#f5f5f5' };
const styleCardContainer = { width: '25%', height: 'fit-content' };
const styleAreCouponsAvailable = { marginTop: 5, marginBottom: 5, width: '80%', }
///

const CouponDetailCustomer = () => {
    /// states
    const [coupon, setCoupon] = useState({});
    const [isSpinningPage, setIsSpinningPage] = useState(false);
    const [productSpecifics, setProductSpecifics] = useState([]);
    const [isSpinningProductSpecifics, setIsSpinningProductSpecifics] = useState(false);
    const [isOpenModalProductSpecifics, setIsOpenModalProductSpecifics] = useState(false);
    const [searchParam, setSearchParam] = useState({
        couponId: 0,
        productName: ''
    });
    const navigate = useNavigate();
    const { couponId } = useParams();
    ///

    // contexts
    const notification = useContext(NotificationContext);
    //

    /// handles
    // const handle
    const handleClickToShop = (shopId) => {
        navigate(`/shop/${shopId}`);
    }

    const handleOpenModalProductSpecific = () => {
        if (user === null || user === undefined) return navigate("/login");
        // set new param
        setSearchParam({ ...searchParam, couponId: couponId, productName: '' });
        setIsOpenModalProductSpecifics(true);
    }
    ///

    /// variables
    const auth = useAuthUser();
    const user = auth();
    ///

    /// useEffects
    useEffect(() => {
        if (!isOpenModalProductSpecifics) return;

        setIsSpinningProductSpecifics(true);

        getProductSpecificOfCoupon(searchParam)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        setProductSpecifics(data.result);
                    } else if (status.responseCode === RESPONSE_CODE_DATA_NOT_FOUND) {
                        notification("error", "Không tìm thấy mã giảm giá, vui lòng thử lại!");
                    } else {
                        notification("error", "Có lỗi xảy ra từ hệ thống, vui lòng thử lại sau!");
                    }
                } else {
                    notification("error", "Có lỗi xảy ra từ hệ thống, vui lòng thử lại sau!");
                }

            })
            .catch(() => {
                notification("error", "Có lỗi xảy ra từ hệ thống, vui lòng thử lại sau!");
            })
            .finally(() => {
                setTimeout(() => {
                    setIsSpinningProductSpecifics(false);
                }, 500);
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParam])

    useEffect(() => {
        setIsSpinningPage(true);

        getCouponDetailCustomerById(couponId)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        setCoupon(data.result);
                    } else if (status.responseCode === RESPONSE_CODE_DATA_NOT_FOUND) {
                        navigate('/notFound');
                    } else {
                        navigate('/errorPage');
                    }
                }
            })
            .catch((err) => { })
            .finally(() => {
                setTimeout(() => { setIsSpinningPage(false); }, 500)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    ///

    return (<Spinning spinning={isSpinningPage}>
        <div style={styleContainer} className={cx('flex-item-center')}>
            <Card style={styleCardContainer} bodyStyle={{ padding: 10 }}>
                <Row className={cx('cardWrap')}>
                    <div className={cx('card', 'cardLeft')}>
                        <h1>Mã giảm giá của shop</h1>
                        <Space direction="vertical" className={cx('title')} style={{ marginBottom: 10 }}>
                            <h2>Giảm {formatPrice(coupon.priceDiscount)}</h2>
                            <h2>Đơn tối thiểu {formatPrice(coupon.minTotalOrderValue)}</h2>
                        </Space>
                        <div className={cx('time')}>
                            <Space align="center">
                                <span className={cx('text-span')}>HSD:</span>
                                {
                                    moment() > moment(coupon.endDate) ? <p style={{ color: 'red' }}>Đã hết hạn</p> : <h2>{ParseDateTime(coupon.endDate)}</h2>
                                }
                            </Space>
                        </div>
                    </div>
                    <div className={cx('card', 'cardRight')}>
                        <Space direction="vertical" className={cx('flex-item-center')}>
                            <div class="number">
                                <h3>{coupon.couponCode}</h3>
                            </div>

                            <Space onClick={() => handleClickToShop(coupon.shop?.userId)} direction="vertical" className={cx('number')} style={{ marginTop: 5 }}>
                                <Avatar size={65} src={coupon.shop?.avatar} />
                                <span>{coupon.shop?.shopName}</span>
                            </Space>
                        </Space>
                    </div>
                </Row>
                <div style={{ overflowY: 'auto', maxHeight: '50vh' }}>
                    {
                        !coupon.areCouponsAvailable ?
                            <Row className={cx('flex-item-center')}>
                                <Button size='middle' danger style={styleAreCouponsAvailable}>Đã hết</Button>
                            </Row>
                            : <></>
                    }
                    <Row className={cx('title')}>
                        <Space direction="vertical">
                            <h2>HẠN SỬ DỤNG MÃ</h2>
                            {
                                moment() > moment(coupon.endDate) ? <p style={{ color: 'red' }}>Đã hết hạn</p> : <p>{ParseDateTime(coupon.startDate)} - {ParseDateTime(coupon.endDate)}</p>
                            }
                        </Space>
                    </Row>
                    <Row className={cx('title')}>
                        <Space direction="vertical">
                            <h2>ƯU ĐÃI</h2>
                            <p>Lượt sử dụng có hạn. Nhanh tay kẻo lỡ bạn nhé! Giảm {formatPrice(coupon.priceDiscount)} Đơn Tối Thiểu {formatPrice(coupon.minTotalOrderValue)}</p>
                        </Space>
                    </Row>
                    <Row>
                        <Space className={cx('title')} direction="vertical">
                            <h2>ÁP DỤNG CHO SẢN PHẨM</h2>
                            {
                                coupon.couponTypeId === COUPON_TYPE_ALL_PRODUCTS_OF_SHOP ?
                                    (<Space direction="vertical">
                                        <p>Tất cả những sản phẩm trong cửa hàng</p>
                                        <Link to={`/shop/${coupon.shop?.userId}`}><p>Đi đến cửa hàng</p></Link>
                                    </Space>)
                                    : (<></>)
                            }

                            {
                                coupon.couponTypeId === COUPON_TYPE_SPECIFIC_PRODUCTS ?
                                    (<Space direction="vertical">
                                        <p>Những sản phẩm đặc biệt trong cửa hàng</p>
                                        <Button type="link" size="small" onClick={handleOpenModalProductSpecific}>Xem ngay</Button>
                                    </Space>)
                                    : (<></>)
                            }
                        </Space>
                    </Row>
                    <Row className={cx('title')}>
                        <Space direction="vertical">
                            <h2>XEM CHI TIẾT</h2>
                            <p>
                                Giảm ngay {formatPrice(coupon.priceDiscount)} cho đơn hàng từ {formatPrice(coupon.minTotalOrderValue)}. Áp dụng đến {ParseDateTime(coupon.endDate)}. Mã giảm giá phát hành bởi Người bán và sẽ không được hoàn lại với bất kỳ lý do nào.
                            </p>
                        </Space>
                    </Row>
                </div>
                <div style={{ width: '100%', marginTop: 10 }} className={cx('flex-item-center')}>
                    <Button type="primary" style={{ width: '40%' }} onClick={() => { window.close(); }}>Đồng ý</Button>
                </div>

                <ProductSpecifics isOpenModalProductSpecifics={isOpenModalProductSpecifics}
                    setIsOpenModalProductSpecifics={setIsOpenModalProductSpecifics}
                    productSpecifics={productSpecifics}
                    isSpinningProductSpecifics={isSpinningProductSpecifics}
                    searchParam={searchParam}
                    setSearchParam={setSearchParam} />
            </Card>
        </div>
    </Spinning>
    )
}

export default CouponDetailCustomer;