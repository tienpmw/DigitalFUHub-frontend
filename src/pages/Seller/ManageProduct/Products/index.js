import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table } from 'antd';
import { useAuthUser } from 'react-auth-kit'

import { getAllProducts } from "~/api/seller";
import Spinning from "~/components/Spinning";



const columns = [
    {
        title: 'Id',
        dataIndex: 'productId',
        width: '5%',
        onCell: (_, index) => ({
            rowSpan: 3
        }),
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'productId',
        width: '20%',
        render: (productId, record) => {
            return (
                <Link to={`/seller/product/${productId}`} style={{ display: "flex" }}>
                    <img src={record.thumbnail} alt="product" style={{ with: "40px", height: "60px" }} />
                    <span>{record.productName}</span>
                </Link>
            )
        }
    },
    {
        title: 'Phân loại hàng',
        dataIndex: 'productVariants',
        render: ((productVariants) => {
            return (
                <>
                    {productVariants.map((variant, index) => (
                        <p key={index}>{variant.name}</p>
                    ))
                    }
                </>
            )
        }),
        width: '20%',
    },
    {
        title: 'Giá',
        dataIndex: 'productVariants',
        render: ((productVariants) => {
            return (
                <>
                    {productVariants.map((variant, index) => (
                        <p key={index}>{variant.price}</p>
                    ))
                    }
                </>
            )
        }),
        width: '15%',
    },
    {
        title: 'Kho hàng',
        dataIndex: 'productVariants',
        render: ((productVariants) => {
            return (
                <>
                    {productVariants.map((variant, index) => (
                        <p key={index}>{variant.quantity}</p>
                    ))
                    }
                </>
            )
        }),
        width: '15%',
    },
    {
        title: '',
        dataIndex: 'productId',
        render: ((productId) => {
            return (
                <>
                    <Link to={`/seller/product/${productId}`}>Cập nhật</Link>
                </>
            )
        }),
        width: '15%',
    },
];

function Products() {

    const auth = useAuthUser()
    const user = auth();
    const [loading, setLoading] = useState(true);

    const [dataTable, setDataTable] = useState([]);

    useEffect(() => {
        getAllProducts(user.id)
            .then((res) => {
                setDataTable(res.data);
                setTimeout(() => {
                    setLoading(false)
                }, 500)
            })
            .catch((err) => {

            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return <>
        <Spinning spinning={loading}>
            <Table columns={columns} pagination={{ size: 10 }} dataSource={dataTable} />
        </Spinning>
    </>
}

export default Products;