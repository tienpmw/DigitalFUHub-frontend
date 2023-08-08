import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input } from 'antd';
import { useSignIn } from 'react-auth-kit';

import { login } from '~/api/user';

function Login() {
    const signIn = useSignIn();
    const navigate = useNavigate();

    const data = {
        email: 'leduchieu2001x@gmail.com',
        password: '123',
    };

    const onFinish = (values) => {
        login(data).then((res) => {
            if (res.status === 200) {
                if (
                    signIn({
                        token: res.data.accessToken,
                        expiresIn: 10,
                        tokenType: 'Bearer',
                        authState: {
                            email: res.data.email,
                            firstName: res.data.firstName,
                            roleName: res.data.roleName,
                        },
                        refreshToken: res.data.refreshToken,
                        refreshTokenExpireIn: 10,
                    })
                ) {
                    return navigate('/dashboard');
                }
            } else if (res.status === 409) {
            } else {
                //Error
            }
        });
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            ;
        </>
    );
}

export default Login;
