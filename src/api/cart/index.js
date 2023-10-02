import { apiPostAuth, apiGetAuth, apiDelete } from '../defaultApi';

export const addProductToCart = (data) => {
    return apiPostAuth(`api/Carts/addProductToCart`, data);
};

export const getCart = (userId, productVariantId) => {
    return apiGetAuth(`api/Carts/GetCart?userId=${userId}&productVariantId=${productVariantId}`);
};

export const getCartsByUserId = (userId) => {
    return apiGetAuth(`api/Carts/GetCartsByUserId/${userId}`);
};

export const deleteCart = (data) => {
    return apiDelete(`api/Carts/DeleteCart`, data);
};