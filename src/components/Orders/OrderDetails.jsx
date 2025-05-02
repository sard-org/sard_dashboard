import React, { useEffect, useState } from "react";
import { Descriptions, Card, Spin, Typography, Button, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { api_url } from "../../utils/api";

const { Title } = Typography;

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
            message.error("Error fetching order details");
            console.error("Error fetching order details:", error);
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
    }

    if (!order) {
        return <p style={{ textAlign: "center" }}>Order not found</p>;
    }

    return (
        <div style={{ padding: 20 }}>
            <Button onClick={() => navigate("/orders")} type="primary" style={{ marginBottom: 20 }}>
                Back to Orders
            </Button>
            <Card title={`Order Details`} style={{ width: "100%" }}>
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
