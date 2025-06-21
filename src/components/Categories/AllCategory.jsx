import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, message, Input } from "antd";
import { useNavigate } from "react-router-dom";
import {
    EditOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
    ExclamationCircleOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { api_url } from "../../utils/api";
import Title from "antd/es/typography/Title";

const { confirm } = Modal;

const AllCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [marginLeft, setMarginLeft] = useState(190);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();

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

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found!");

            const response = await axios.get(`${api_url}/api/categories`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id) => {
        confirm({
            title: "Are you sure you want to delete this category?",
            icon: <ExclamationCircleOutlined />,
            content: "This action cannot be undone.",
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk() {
                handleDelete(id);
            },
        });
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                message.error("You must be logged in!");
                return;
            }

            await axios.delete(`${api_url}/api/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            message.success("Category deleted successfully!");
            fetchCategories();
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Error deleting category";
            message.error(errorMsg);
            console.error("Error deleting Category:", error);
        }
    };

    // Filter categories based on search text
    const filteredCategories = categories.filter((category) => {
        const text = searchText.trim().toLowerCase();
        if (!text) return true;
        return category.name?.toLowerCase().includes(text);
    });

    const columns = [
        {
            title: "#",
            dataIndex: "index",
            key: "index",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Photo",
            dataIndex: "photo",
            key: "photo",
            render: (photo) => (
                <img
                    src={photo}
                    alt="Category"
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                />
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<InfoCircleOutlined />}
                        onClick={() => navigate(`/categories/${record.id}`)}
                    />
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/categories/update/${record.id}`)}
                    />
                    <Button danger icon={<DeleteOutlined />} onClick={() => confirmDelete(record.id)} />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ paddingTop: 20, marginLeft: marginLeft, marginTop: 24 }}>
            <Space
                style={{
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                }}
            >
                <Title level={2}>All Categories</Title>
                <Space>
                    <Input
                        placeholder="Search categories..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 200 }}
                        allowClear
                    />
                    <Button type="primary" onClick={() => navigate("/categories/add")}>
                        Add Category
                    </Button>
                </Space>
            </Space>
            <Table
                columns={columns}
                dataSource={filteredCategories.map((category, index) => ({
                    ...category,
                    key: category.id,
                    index,
                }))}
                loading={loading}
                pagination={{ pageSize: 6 }}
                bordered
            />
        </div>
    );
};

export default AllCategory;