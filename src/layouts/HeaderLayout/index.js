import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';
import { Layout, Space, Button, Dropdown, Avatar, Input, Typography } from 'antd';
import Logout from '~/components/Logout';
import Message from '~/components/Message';
import Notificaion from '~/components/Notification';
import {
    ShoppingCartOutlined,
    CreditCardOutlined, ShopOutlined, ShoppingOutlined, UserOutlined,
    HeartOutlined
} from '@ant-design/icons';

import userDefaultImage from '~/assets/images/user.jpg';
import logo from '~/assets/images/DIGITALFUHUB.png';
import { CUSTOMER_ROLE, RESPONSE_CODE_SUCCESS, SELLER_ROLE } from '~/constants';
import ModalRequestDeposit from '../../components/Modals/ModalRequestDeposit';
// import AccountBalance from '../../components/AccountBalance';
import debounce from "debounce-promise";

import classNames from 'classnames/bind';
import styles from './HeaderLayout.module.scss';
import { getSearchHint } from '~/api/search';
const debounceSearchHint = debounce((value) => {
    const res = getSearchHint(value)
    return Promise.resolve({ res: res });
}, 500);
const cx = classNames.bind(styles);

const { Header } = Layout;

const { Search } = Input;
const { Text } = Typography

const itemsFixed = [
    {
        key: 'settings',
        label: <Link to={"/settings/personal"}><><UserOutlined /> Tài khoản</></Link>,
        roles: [CUSTOMER_ROLE, SELLER_ROLE]
    },
    {
        key: 'history orders',
        label: <Link to={"/history/order"}><ShoppingOutlined /> Lịch sử mua hàng</Link>,
        roles: [CUSTOMER_ROLE, SELLER_ROLE]
    },
    {
        key: 'wishlist',
        label: <Link to={"/settings/wishlist"}><HeartOutlined /> Sản phẩm yêu thích</Link>,
        roles: [CUSTOMER_ROLE, SELLER_ROLE]
    },
    {
        key: 'history transaction',
        label: <Link to={"/finance"}><CreditCardOutlined /> Tài chính</Link>,
        roles: [CUSTOMER_ROLE, SELLER_ROLE]
    },
    {
        key: 'registerSeller',
        label: <Link to={"/settings/registerSeller"}><ShopOutlined /> Đăng ký bán hàng</Link>,
        roles: [CUSTOMER_ROLE]
    },
    {
        key: 'seller',
        label: <Link to={"/seller/statistic"}><ShopOutlined /> Kênh người bán</Link>,
        roles: [SELLER_ROLE]
    },
    {
        key: 'logout',
        label: <Logout />,
        roles: [CUSTOMER_ROLE, SELLER_ROLE]
    },
];

function HeaderLayout() {
    const navigate = useNavigate();
    const auth = useAuthUser();
    const user = auth();
    const [searchParams] = useSearchParams();
    const [items, setItems] = useState([]);
    const [userAvatart, setUserAvatart] = useState(null);
    const [showPopoverHintSearch, setShowPopoverHintSearch] = useState(false);
    const [searchValue, setSearchValue] = useState(searchParams.get('keyword') ? searchParams.get('keyword') : '');
    const [searchHintItems, setSearchHintItems] = useState([]);
    useEffect(() => {
        setSearchValue(searchParams.get('keyword') ? searchParams.get('keyword') : '')
    }, [searchParams])
    const handleSearch = (value, _e, info) => {
        // if (value === undefined || value.trim() === '') {
        //     setShowPopoverHintSearch(false);
        // } else {
        //     setShowPopoverHintSearch(true);
        // }
        if (value && value.trim() !== '') {
            setSearchValue(value.trim());
            setShowPopoverHintSearch(false);
            return navigate(`/search?keyword=${value.trim()}`)
        }
    };
    const handleSearchBoxChange = (e) => {
        if (!showPopoverHintSearch && e.target.value.trim()) {
            setShowPopoverHintSearch(true);
        } else if (!e.target.value.trim()) {
            setShowPopoverHintSearch(false);
        }
        setSearchValue(e.target.value)
        if (e.target.value.trim()) {
            debounceSearchHint(e.target.value.trim())
                .then(({ res }) => {
                    res.then((res) => {
                        if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                            setSearchHintItems(res.data.result);
                        } else {
                            setSearchHintItems([]);
                        }
                    }).catch((err) => {
                        setSearchHintItems([]);
                    })
                })

        }
    };
    const handleSearchBoxFocus = () => {
        setShowPopoverHintSearch(true);
    }

    const handleLinkHintClick = (e) => {
        // setSearchValue(e.target.textContent)
        setShowPopoverHintSearch(false);
    }
    const wrapperRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowPopoverHintSearch(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef])

    useEffect(() => {

        var itemsCanAccses = itemsFixed;
        if (user === null || user === undefined) return;
        itemsCanAccses = itemsFixed.filter(x => x.roles.includes(user.roleName));
        setItems(itemsCanAccses);
        return () => {
            setItems([]);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        if (user !== null) {
            if (user.avatar === undefined || user.avatar === "") {
                setUserAvatart(userDefaultImage)
            } else {
                setUserAvatart(user.avatar)
            }
        }
    }, [user])

    // const [isGridVisible, setIsGridVisible] = useState(true);

    // useEffect(() => {
    //     const handleResize = () => {
    //         if (window.innerWidth < 1100) {
    //             setIsGridVisible(false);
    //         } else {
    //             setIsGridVisible(true);
    //         }
    //     };

    //     handleResize();

    //     window.addEventListener('resize', handleResize);

    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, []);

    return (
        <>
            <div className={cx("header1")} />
            <Header className={cx("header2")}>
                <Space className={cx("item1")}>
                    {/* <Link to={'/home'}>
                        <img width={60} src={logo} />
                    </Link> */}
                    {/* {isGridVisible && ( */}
                    <Link to={'/home'} className={cx("link")}>
                        <img src={logo} style={{ width: '180px', 'marginTop': '1em' }} alt='logo' />
                    </Link>
                    {/* )} */}
                </Space>
                <div ref={wrapperRef}>
                    <Space className={cx("item2")}>
                        <Search
                            className={cx("search")}
                            placeholder="Tìm kiếm sản phẩm, cửa hàng"
                            allowClear
                            onFocus={handleSearchBoxFocus}
                            onChange={handleSearchBoxChange}
                            value={searchValue}
                            enterButton={true}
                            onSearch={handleSearch}
                        />
                        {showPopoverHintSearch && searchValue &&
                            <Space id='container-search-hint' className={cx('container-search-hint')} direction='vertical' size={[0, 0]} style={{
                                boxShadow: '0 1px 4px 0 rgba(0,0,0,.26)',
                                borderRadius: '2px',
                                width: '30vw',
                                height: 'auto',
                                position: 'absolute',
                                top: '6em',
                                left: '34.8%',
                                zIndex: 100,
                                backgroundColor: '#fff'
                            }}>
                                <Link to={`/searchShop?keyword=${searchValue.trim()}`} >
                                    <Text className={cx('search-hint')} onClick={handleLinkHintClick}><ShopOutlined /> {`Tìm cửa hàng "${searchValue.trim()}"`}</Text>
                                </Link>
                                {searchHintItems?.map((value, index) =>
                                    <Link key={index} to={`/search?keyword=${value}`} >
                                        <Text className={cx('search-hint')} onClick={handleLinkHintClick}>{value}</Text>
                                    </Link>)
                                }
                            </Space>
                        }
                    </Space>
                </div>

                <Space className={cx("item3")}>
                    {user === null ? (
                        <>
                            <Link to={'/login'}>
                                <Button type="primary" className={cx("button")}>Đăng nhập</Button>
                            </Link>
                            <Link to={'/signup'}>
                                <Button type="primary" className={cx("button")}>Đăng ký</Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* {isGridVisible && (
                                <>
                                    <AccountBalance />
                                    <ModalRequestDeposit userId={user.id} style={{ background: 'black' }} />
                                </>
                            )} */}
                            <ModalRequestDeposit userId={user.id} style={{ background: 'black' }} />

                            <Link to={'/cart'}>
                                <ShoppingCartOutlined className={cx("icon")} />
                            </Link>
                            <Notificaion />
                            <Message />
                            {/* <Link to={'/chatBox'}>
                                <MessageOutlined className={cx("icon")} />
                            </Link> */}
                            <Dropdown
                                menu={{ items }}
                                placement="bottomRight"
                                arrow={{
                                    pointAtCenter: true,
                                }}
                            >
                                <Avatar size={50} src={userAvatart} />
                            </Dropdown>
                        </>
                    )}
                </Space>
            </Header>
        </>
    );
}

export default HeaderLayout;
