import CardOrderItem from "../CardOrderItem";
import { Col, Empty, Row, Spin } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { customerUpdateStatusOrder, getListOrdersCustomer } from "~/api/order";
import { RESPONSE_CODE_ORDER_STATUS_CHANGED_BEFORE, RESPONSE_CODE_SUCCESS } from "~/constants";
import { NotificationContext } from "~/context/UI/NotificationContext";
import { getUserId } from "~/utils";

function OrdersComplaint({ status, loading, setLoading, onActiveTabKey = () => { } }) {
    const notification = useContext(NotificationContext);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [paramSearch, setParamSearch] = useState({
        userId: getUserId(),
        limit: 5,
        offset: 0,
        statusId: status
    });
    const [orders, setOrders] = useState([]);
    const nextOffset = useRef(0);
    const [loadingMoreData, setLoadingMoreData] = useState(false);
    useEffect(() => {
        if (nextOffset.current !== -1) {
            if (nextOffset.current !== 0) {
                setLoadingMoreData(true);
            }
            // call api
            getListOrdersCustomer(paramSearch)
                .then(res => {
                    if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                        setOrders([...orders, ...res.data.result.orders]);
                        nextOffset.current = res.data.result.nextOffset;
                    }
                })
                .catch(err => { })
            if (loading) {
                const idTimeout = setTimeout(() => {
                    setLoading(false);
                    clearTimeout(idTimeout)
                }, 300)
            }
            setLoadingMoreData(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramSearch])
    useEffect(() => {
        window.addEventListener("scroll", (e) => {
            var scrollMaxY = window.scrollMaxY || (document.documentElement.scrollHeight - document.documentElement.clientHeight)
            if (scrollMaxY - window.scrollY <= 150) {
                if (nextOffset.current !== -1 && !loadingMoreData) {
                    setParamSearch({ ...paramSearch, offset: nextOffset.current })
                }
            }
        })
        return () => {
            window.removeEventListener("scroll", () => { })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleOrderComplete = (orderId, shopId) => {
        const dataBody = {
            userId: getUserId(),
            shopId: shopId,
            orderId: orderId,
            statusId: 2
        }
        setButtonLoading(true);
        customerUpdateStatusOrder(dataBody)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrders(prev => {
                        const order = prev.find((value) => value.orderId === orderId);
                        order.statusId = dataBody.statusId
                        return [...prev]
                    })
                    notification("success", "Xác nhận đơn hàng thành công.")
                    onActiveTabKey('tab2')
                } else if (res.data.status.responseCode === RESPONSE_CODE_ORDER_STATUS_CHANGED_BEFORE) {
                    notification("error", "Trạng thái đơn hàng đã được thay đổi trước đó! Vui lòng tải lại trang!")
                } else {
                    notification("error", "Vui lòng kiểm tra lại.")
                }
            })
            .catch(err => { notification("error", "Đã có lỗi xảy ra.") })
            .finally(() => {
                const idTimeout = setTimeout(() => {
                    setButtonLoading(false);
                    clearTimeout(idTimeout);
                }, 500)
            })
    }
    return (<div>
        {!loading ?
            orders.length > 0 ?
                <Row gutter={[0, 16]} style={{ padding: '0 50px' }}>
                    {orders.map((v, i) => {
                        return <Col span={24}>
                            <CardOrderItem key={v.orderId}
                                orderId={v.orderId}
                                note={v.note}
                                orderDate={v.orderDate}
                                shopId={v.shopId}
                                shopName={v.shopName}
                                statusId={v.statusId}
                                conversationId={v.conversationId}
                                totalAmount={v.totalAmount}
                                totalCoinDiscount={v.totalCoinDiscount}
                                totalCouponDiscount={v.totalCouponDiscount}
                                totalPayment={v.totalPayment}
                                orderDetails={v.orderDetails}
                                buttonLoading={buttonLoading}
                                onOrderComplete={() => handleOrderComplete(v.orderId, v.shopId)}
                            />
                        </Col>
                    })}
                    <Col span={24}>
                        <Row justify="center" gutter={8}>
                            <Spin spinning={loadingMoreData}></Spin>
                        </Row>
                    </Col>
                </Row>
                :
                <Empty />
            : null
        }
    </div>);
}

export default OrdersComplaint;