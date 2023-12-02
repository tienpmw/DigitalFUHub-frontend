import { QuestionCircleOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic, Tooltip } from "antd";
import { memo, useEffect, useState } from "react";
import { getStatisticSalesCurrentMonth } from "~/api/statistic";
import { RESPONSE_CODE_SUCCESS } from "~/constants";
import { formatPrice } from "~/utils";

const stylesCard = { width: '100%' };
function SalesSummaryCurrentMonth() {
    const [data, setData] = useState();
    useEffect(() => {
        getStatisticSalesCurrentMonth()
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setData(res.data.result);
                }
            })
            .catch(err => {

            })
    }, [])
    return (<>
        <Row gutter={[16, 16]}>
            <Col span={8}>
                <Card style={stylesCard}>
                    <Statistic
                        title={<div><span>Doanh thu</span> <Tooltip title="Tổng giá trị các đơn hàng trong tháng hiện tại (bao gồm tất cả các trạng thái đơn hàng)"><QuestionCircleOutlined /></Tooltip></div>}
                        value={formatPrice(!data?.revenue ? 0 : data?.revenue)}
                        valueStyle={{
                            color: '#3f8600',
                        }}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card style={stylesCard}>
                    <Statistic
                        title={<div><span>Lợi nhuận</span> <Tooltip title="Tổng lợi nhuận các đơn hàng trong tháng hiện tại (bao gồm tất cả các trạng thái đơn hàng) và đã trừ phí dịch vụ"><QuestionCircleOutlined /></Tooltip></div>}
                        value={formatPrice(!data?.profit ? 0 : data?.profit)}
                        valueStyle={{
                            color: '#3f8600',
                        }}
                    // prefix={<StarOutlined />}
                    // suffix={<StarOutlined />}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card style={stylesCard}>
                    <Statistic
                        title={<div><span>Đơn hàng</span> <Tooltip title="Tổng số các đơn hàng tháng hiện tại (bao gồm tất cả các trạng thái đơn hàng)"><QuestionCircleOutlined /></Tooltip></div>}
                        value={!data?.totalOrders ? 0 : data?.totalOrders}
                        valueStyle={{
                            color: '#3f8600',
                        }}
                    // prefix={<StarOutlined />}
                    // suffix={<StarOutlined />}
                    />
                </Card>
            </Col>
        </Row>
    </>);
}

export default memo(SalesSummaryCurrentMonth);