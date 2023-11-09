import { apiGetAuth, apiPostAuth, apiPostAuthForm } from '../defaultApi';

export const getShopOfSeller = () => {
    return apiGetAuth(`api/Shops/Seller/Get`);
}

export const editShop = (data) => {
    return apiPostAuthForm('api/Shops/Seller/Edit', data);
}

export const checkExistShopName = async (data) => {
    return await apiGetAuth(`api/Shops/IsExistShopName/${data}`);
};

export const registerShop = (data) => {
    return apiPostAuthForm('api/Shops/Register', data);
}