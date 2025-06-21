import React, { useEffect, useState } from "react";
import { Table, Button, Space, Spin, Typography, Input } from "antd";
import { InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_url } from "../../utils/api";

const { Title } = Typography;

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [marginLeft, setMarginLeft] = useState(190);
    const [searchText, setSearchText] = useState("");
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
        handleResize();

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

    const filteredOrders = orders.filter((order) => {
        const text = searchText.trim().toLowerCase();
        if (!text) return true;
        return order.book?.title?.toLowerCase().includes(text);
    });

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
            render: (price) => `${price} EGP`,
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
            title: "User Name",
            dataIndex: ["user", "name"],
            key: "userName",
        },
        {
            title: "User Email",
            dataIndex: ["user", "email"],
            key: "userEmail",
        },
        {
            title: "User Phone",
            dataIndex: ["user", "phone"],
            key: "userPhone",
            render: (phone) => phone || "N/A",
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
        <div style={{ paddingTop: 20, marginLeft: marginLeft, marginTop: 24 }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                }}
            >
                <Title level={2} style={{ margin: 0 }}>
                    All Orders
                </Title>
                <Input
                    placeholder="Search by Book Title"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 250 }}
                    allowClear
                />
            </div>
            <Table
                columns={columns}
                dataSource={filteredOrders.map((order) => ({
                    ...order,
                    key: order.id,
                }))}
                pagination={{ pageSize: 5 }}
                loading={loading}
            />
        </div>
    );
};

export default AllOrders;