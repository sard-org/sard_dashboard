import React, { useEffect, useState } from "react";
import { Descriptions, Card, Spin, Typography } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { api_url } from "../../utils/api";

const { Title } = Typography;

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found!");

            const response = await axios.get(`${api_url}/api/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrder(response.data);
        } catch (error) {
            console.error("Error fetching order details:", error);
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Spin size="large" />;
    }

    if (!order) {
        return <p>Order not found</p>;
    }

    return (
        <div style={{ padding: 20 }}>
            <Title level={2}>Order Details</Title>
            <Card>
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Book Title">{order.book?.title}</Descriptions.Item>
                    <Descriptions.Item label="Description">{order.book?.description}</Descriptions.Item>
                    <Descriptions.Item label="Price">{order.price} USD</Descriptions.Item>
                    <Descriptions.Item label="Points">{order.points}</Descriptions.Item>
                    <Descriptions.Item label="Status">{order.status}</Descriptions.Item>
                    <Descriptions.Item label="Payment ID">{order.paymentId || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {new Date(order.createdAt).toLocaleString()}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
};

export default OrderDetails;
