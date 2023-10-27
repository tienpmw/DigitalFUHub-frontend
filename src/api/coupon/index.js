import { apiGet, apiGetAuth, apiPostAuth } from '../defaultApi';

export const getCouponPublic = (shopId) => {
    return apiGet(`api/Coupons/GetCouponPublic?shopId=${shopId}`);
};

export const getCouponPrivate = (couponCode, shopId) => {
    return apiGet(`api/Coupons/GetCouponPrivate?couponCode=${couponCode}&shopId=${shopId}`);
};
export const getCouponSellerById = (couponId) => {
    return apiGetAuth(`api/Coupons/${couponId}`);
};
export const checkCouponCodeExist = async (action, couponCode) => {
    return await apiGetAuth(`api/Coupons/IsExistCouponCode/${action}/${couponCode}`);
};
export const getCouponsSeller = (data) => {
    return apiPostAuth('api/Coupons/List/Seller', data);
};
export const addCouponSeller = (data) => {
    return apiPostAuth('api/Coupons/Add', data);
};
export const editCouponSeller = (data) => {
    return apiPostAuth('api/Coupons/Edit', data);
};

export const updateStatusCouponSeller = (data) => {
    return apiPostAuth('api/Coupons/Edit/Status', data);
};

export const removeCouponSeller = (data) => {
    return apiPostAuth('api/Coupons/Remove', data);
};