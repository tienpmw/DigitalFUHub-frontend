import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Row, Layout, Menu, theme, Button } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    GlobalOutlined,
    BankOutlined,
    ShopOutlined,
    ShoppingOutlined,
    CreditCardOutlined,
    HeartOutlined,
    WalletOutlined
} from '@ant-design/icons';
import { CUSTOMER_ROLE, SELLER_ROLE } from '~/constants';
import { useAuthUser } from 'react-auth-kit';



const { Content, Sider } = Layout;


const items = [
    {
        icon: UserOutlined,
        label: 'Thông tin của tôi',
        link: '/settings/personal',
        role: [CUSTOMER_ROLE, SELLER_ROLE],
    },
    {
        icon: WalletOutlined,
        label: 'Ví của tôi',
        link: '/settings/wallet',
        role: [CUSTOMER_ROLE, SELLER_ROLE],
    },
    {
        icon: GlobalOutlined,
        label: 'Bảo mật',
        link: '/settings/security',
        role: [CUSTOMER_ROLE, SELLER_ROLE],
    },
    {
        icon: BankOutlined,
        label: 'Tài khoản ngân hàng',
        link: '/settings/bankAccount',
        role: [CUSTOMER_ROLE, SELLER_ROLE],
    },
    {
        icon: CreditCardOutlined,
        label: 'Tài chính',
        link: '/finance',
        role: [CUSTOMER_ROLE, SELLER_ROLE]
    },
    {
        icon: HeartOutlined,
        label: 'Sản phẩm yêu thích',
        link: '/settings/wishlist',
        role: [CUSTOMER_ROLE, SELLER_ROLE]
    },
    {
        icon: ShoppingOutlined,
        label: 'Lịch sử mua hàng',
        link: '/history/order',
        role: [CUSTOMER_ROLE, SELLER_ROLE]
    },
    {
        icon: ShopOutlined,
        label: 'Đăng ký bán hàng',
        link: '/settings/registerSeller',
        role: [CUSTOMER_ROLE]
    },

]

function SettingsLayout({ children }) {
    const auth = useAuthUser();
    const user = auth();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };
    const location = useLocation();
    const getSelectedKey = () => {
        const path = location.pathname.replace(/[0-9]+/g, "");
        if (path[path.length - 1] === '/') {
            return [path.slice(0, path.length - 1)]
        } else {
            return [path];
        }
    }

    return (
        <>
            <Row>
                <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16, marginRight: 15 }}>
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </Button>
                <h1>Tài khoản</h1>
            </Row>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    trigger={null}
                    collapsedWidth={0}
                    collapsed={collapsed}
                    style={{ minHeight: '100vh', background: 'white' }}
                >
                    <Menu
                        defaultSelectedKeys={['/settings/personal']}
                        selectedKeys={getSelectedKey()}
                        mode="vertical"
                        theme="light"
                        inlineCollapsed={collapsed}
                        style={{ minHeight: "100vh" }}
                        items={items.map((item, index) => {
                            if (item.role.includes(user.roleName)) {
                                return {
                                    key: item.link,
                                    icon: React.createElement(item.icon),
                                    label: <Link to={item.link}>{item.label}</Link>,
                                }
                            } else {
                                return <></>
                            }
                        })}
                    />
                </Sider>
                <Content >
                    <div style={{ padding: 12, minHeight: '100vh', background: colorBgContainer }}>
                        {/* <Outlet /> */}
                        {children}
                    </div>
                </Content>
            </Layout>

        </>
    );
}

export default SettingsLayout;