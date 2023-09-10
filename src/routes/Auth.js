import { useLayoutEffect, useEffect, useState } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons'
import { useSignIn } from 'react-auth-kit';

import { getUserId, getTokenInCookies, removeUserInfoInCookie } from '~/utils';
import { getUserByIdForAuth } from '~/api/user';
import { NOT_HAVE_MEANING_FOR_TOKEN, NOT_HAVE_MEANING_FOR_TOKEN_EXPRIES } from '~/constants';

function Auth(props) {
    const signIn = useSignIn();

    const token = getTokenInCookies();
    const userId = getUserId();

    const [loading, setLoading] = useState(false);

    const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    //check user was logined
    useLayoutEffect(() => {
        setLoading(true);
        ///token not expires in cookie
        if (token !== undefined && userId !== undefined) {
            getUserByIdForAuth(userId)
                .then((res) => {
                    signIn({
                        token: NOT_HAVE_MEANING_FOR_TOKEN,
                        expiresIn: NOT_HAVE_MEANING_FOR_TOKEN_EXPRIES,
                        authState: {
                            id: res.data.userId,
                            email: res.data.email,
                            firstName: res.data.email,
                            roleName: res.data.roleName,
                        },
                    });
                    //saveDataAuthToCookies(userId, token, res.data.refreshToken, res.data.jwtId);
                })
                .catch((err) => {
                    removeUserInfoInCookie();
                }).finally(() => {
                    setTimeout(() => {
                        setLoading(false)
                    }, 500)
                });
        } else {
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, token]);


    //check user sign-in or sign-out in other windown(tab)
    useEffect(() => {
        const interval = setInterval(() => {
            const newToken = getTokenInCookies();
            if (newToken !== token) {
                window.location.reload();
            }
        }, 1000)

        return () => clearInterval(interval);

    }, [token])

    return (
        <>
            <Spin tip="Loading" size="large" indicator={loadingIcon} spinning={loading}>
                {props.children}
            </Spin>
        </>
    )
}

export default Auth;
