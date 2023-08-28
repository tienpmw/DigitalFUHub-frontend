import axios from 'axios';
import { getTokenInCookies } from '~/utils';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const getHeaderConfig = () => {
    return {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenInCookies()}`,
        },
    };
};

export const apiPost = async (url, data) => {
    const response = axios.post(baseURL + url, data, getHeaderConfig());
    return response;
};