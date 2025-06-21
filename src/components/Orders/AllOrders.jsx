import React, { useEffect, useState } from "react";
import { Table, Button, Space, Spin, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_url } from "../../utils/api";

const { Title } = Typography;

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [marginLeft, setMarginLeft] = useState(190); // Default marginLeft
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();

        const handleResize = () => {
            if (window.innerWidth < 768) {
                setMarginLeft(0);
            } else {
                setMarginLeft(190);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initial check

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found!");

            const response = await axios.get(`${api_url}/api/orders/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "#",
            dataIndex: "index",
            key: "index",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Book Title",
            dataIndex: ["book", "title"],
            key: "title",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => `${price} USD`,
        },
        {
            title: "Points",
            dataIndex: "points",
            key: "points",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<InfoCircleOutlined />}
                        onClick={() => navigate(`/orders/${record.id}`)}
                    >
                        View Details
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ paddingTop: 20, marginLeft: marginLeft , marginTop : 24 }}>
            <Title level={2}>All Orders</Title>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Table
                    columns={columns}
                    dataSource={orders.map((order) => ({ ...order, key: order.id }))}
                    pagination={{ pageSize: 5 }}
                />
            )}
        </div>
    );
};

export default AllOrders;
