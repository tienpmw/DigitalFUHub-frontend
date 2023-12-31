/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Divider, Layout, Space, Spin } from 'antd';
import classNames from "classnames/bind";
import { ALL_CATEGORY, FEEDBACK_TYPE_ALL, RESPONSE_CODE_SUCCESS, SORTED_BY_SALE } from "~/constants";
import { BulbOutlined, FilterOutlined } from "@ant-design/icons";
import { getAllCategory } from "~/api/category";
import { getListProductSearch } from "~/api/product";
import styles from "./Search.module.scss"
import { FilterGroupCategory, FilterGroupRating, InputRangePrice, Products, SortBar, MostPopularShop, SearchNotFound } from "~/components/SearchProduct";
import { getMostPopularShop } from "~/api/shop";

const cx = classNames.bind(styles);
const { Sider, Content } = Layout;

function ConvertSearchParamObjectToString(searchParam = {}) {
    let result = '';
    for (const property in searchParam) {
        if (searchParam[property] !== undefined && searchParam[property] !== null) {
            result += `${property}=${searchParam[property]}&`;
        }
    }
    return result.slice(0, result.length - 1)
}

function SearchProduct() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); //setSearchParams
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(false);
    const [mostPopularShop, setMostPopularShop] = useState();
    const getSearchParams = useMemo(() => {
        return {
            page: searchParams.get('page') ? searchParams.get('page') : 1,
            keyword: searchParams.get('keyword') ? searchParams.get('keyword').trim() : '',
            category: searchParams.get('category') ? searchParams.get('category') : ALL_CATEGORY,
            sort: searchParams.get('sort') ? searchParams.get('sort') : SORTED_BY_SALE,
            minPrice: searchParams.get('minPrice') ? searchParams.get('minPrice') : null,
            maxPrice: searchParams.get('maxPrice') ? searchParams.get('maxPrice') : null,
            rating: searchParams.get('rating') ? searchParams.get('rating') : FEEDBACK_TYPE_ALL
        }
    }, [searchParams])
    useEffect(() => {
        setProductsLoading(true);
        getListProductSearch(getSearchParams)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setProducts(res.data.result.products);
                    setTotalItems(res.data.result.totalItems);
                } else {
                    setProducts([]);
                    setTotalItems(0);
                }
            })
            .catch(err => {
                setProducts([]);
                setTotalItems(0);
            })
            .finally(() => {
                const idTimeout = setTimeout(() => {
                    setLoading(false);
                    setProductsLoading(false);
                    clearTimeout(idTimeout)
                }, 500)
            })
    }, [searchParams]);
    useEffect(() => {
        getMostPopularShop(getSearchParams.keyword)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setMostPopularShop(res.data.result);
                } else {
                    setMostPopularShop(null);
                }
            })
            .catch(err => {
                setMostPopularShop(null);
            })
    }, [searchParams])
    useEffect(() => {
        getAllCategory()
            .then((res) => {
                if (res.data.status.responseCode === "00") {
                    setCategories(res.data.result)
                } else {
                    setCategories([])
                }
            })
            .catch((err) => {
                setCategories([])
            })
    }, [searchParams])
    const handleChangeSelectRating = (e) => {
        let newSearchParams = { ...getSearchParams, rating: e.target.value, page: 1 };
        return navigate(`/search?${ConvertSearchParamObjectToString(newSearchParams)}`)
    }
    const handleInputRangePrice = (minPrice, maxPrice) => {
        let newSearchParams = { ...getSearchParams, minPrice, maxPrice, page: 1 };
        return navigate(`/search?${ConvertSearchParamObjectToString(newSearchParams)}`)
    }
    const handleChangeSelectCategory = (e) => {
        let newSearchParams = { ...getSearchParams, category: e.target.value, page: 1 };
        return navigate(`/search?${ConvertSearchParamObjectToString(newSearchParams)}`)
    }
    const handleChangeSelectSort = (e) => {
        let newSearchParams = { ...getSearchParams, sort: e.target.value, page: 1 };
        return navigate(`/search?${ConvertSearchParamObjectToString(newSearchParams)}`)
    }
    const handleSelectPage = (value) => {
        let newSearchParams = { ...getSearchParams, page: value };
        return navigate(`/search?${ConvertSearchParamObjectToString(newSearchParams)}`)
    }
    return (
        <Spin spinning={loading}>
            <Layout className={cx('container')} >
                {!loading
                    ?
                    <>
                        <Sider className={cx('sider')}>
                            <Space style={{ marginBottom: '1.8em' }}>
                                <FilterOutlined style={{ fontSize: '1.17em' }} />
                                <h3> Bộ Lọc Tìm Kiếm</h3>
                            </Space>
                            <FilterGroupCategory
                                valueSelected={parseInt(getSearchParams.category) ? parseInt(getSearchParams.category) : ALL_CATEGORY}
                                listCategory={categories}
                                onChange={handleChangeSelectCategory}
                            />
                            <Divider />
                            <InputRangePrice
                                minValue={!isNaN(parseInt(getSearchParams.minPrice)) ? parseInt(getSearchParams.minPrice) : null}
                                maxValue={!isNaN(parseInt(getSearchParams.maxPrice)) ? parseInt(getSearchParams.maxPrice) : null}
                                onChange={handleInputRangePrice} />
                            <Divider />
                            <FilterGroupRating
                                valueSelected={parseInt(getSearchParams.rating)}
                                onChange={handleChangeSelectRating}
                            />
                        </Sider>
                        <Layout className={cx('wrapper-content')} style={{ background: '#F4F7FE' }}>
                            {products && products.length > 0 ?
                                <Content className={cx('content')}>
                                    <MostPopularShop mostPopularShop={mostPopularShop} keyword={getSearchParams.keyword} />
                                    <div style={{ marginBottom: '1em' }}>
                                        <BulbOutlined style={{ fontSize: 18 }} />
                                        <span style={{ marginInlineStart: '0.8em', fontSize: 16 }}>Kết quả tìm kiếm cho từ khoá
                                            '<span style={{ color: '#1677ff' }}>{getSearchParams.keyword}</span>'
                                        </span>
                                    </div>
                                    <SortBar
                                        valueSelected={parseInt(getSearchParams.sort)}
                                        onChange={handleChangeSelectSort}
                                    />
                                    <Spin spinning={productsLoading} style={{ marginTop: '80px' }}>
                                        {!productsLoading &&
                                            <Products products={products} totalItems={totalItems} page={parseInt(getSearchParams.page) ? parseInt(getSearchParams.page) : 1} onSelectPage={handleSelectPage} />
                                        }
                                    </Spin>
                                </Content>
                                :
                                <SearchNotFound />
                            }
                        </Layout>
                    </>
                    : null
                }
            </Layout>
        </Spin>
    );
}

export default SearchProduct;