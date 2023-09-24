import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Layout, Menu, theme, Button } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    GlobalOutlined,
    BankOutlined
} from '@ant-design/icons';



const { Content, Sider } = Layout;


const items = [
    {
        icon: UserOutlined,
        label: 'Thông tin của tôi',
        link: '/settings/personal',
    },
    {
        icon: GlobalOutlined,
        label: 'Bảo mật',
        link: '/settings/security',
    },
    {
        icon: BankOutlined,
        label: 'Tài khoản ngân hàng',
        link: '/settings/bankAccount',
    },
]

function SettingsLayout({ children }) {

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <>
            <Row>
                <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16, marginRight: 15 }}>
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </Button>
                <h1>Cài đặt</h1>
            </Row>
            <Layout style={{ height: '100vh' }}>
                <Sider
                    trigger={null}
                    collapsedWidth={0}
                    collapsed={collapsed}
                >
                    <Menu
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="vertical"
                        theme="light"
                        inlineCollapsed={collapsed}
                        style={{ height: "100vh" }}
                        items={items.map((item, index) => ({
                            key: String(index + 1),
                            icon: React.createElement(item.icon),
                            label: <Link to={item.link}>{item.label}</Link>,
                        }))}

                    />
                </Sider>
                <Content >
                    <div style={{ padding: 12, height: '100vh', background: colorBgContainer }}>
                        {/* <Outlet /> */}
                        {children}
                    </div>
                </Content>
            </Layout>

        </>
    );
}

export default SettingsLayout;