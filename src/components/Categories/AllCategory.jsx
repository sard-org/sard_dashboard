import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { api_url } from "../../utils/api";
import Title from "antd/es/typography/Title";

const { confirm } = Modal;

const AllCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [marginLeft, setMarginLeft] = useState(190); // Default margin-left
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();

        // Handle window resize for responsive margin-left
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setMarginLeft(0); // Set margin-left to 0 for smaller screens
            } else {
                setMarginLeft(190); // Set margin-left to 190 for larger screens
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initial check on mount

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
                headers: { Authorization: `Bearer ${token}` }
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

            const response = await axios.delete(`${api_url}/api/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            message.success("Category deleted successfully!");
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
            message.error("Failed to delete category!");
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
                    <Button icon={<InfoCircleOutlined />} onClick={() => navigate(`/categories/${record.id}`)} />
                    <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/categories/update/${record.id}`)} />
                    <Button type="danger" icon={<DeleteOutlined />} onClick={() => confirmDelete(record.id)} />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ paddingTop: 20, marginLeft: marginLeft , marginTop : 24 }}>
            <Title level={2}>All Categories</Title>
            <Table
                columns={columns}
                dataSource={categories.map((category, index) => ({ ...category, key: category.id }))}
                loading={loading}
                pagination={{ pageSize: 6 }}
            />
        </div>
    );
};

export default AllCategory;
