import React, { useEffect, useState } from "react";
import { Table, Button, Image, Space, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { api_url } from "../../utils/api";

const { confirm } = Modal;

const AllAuthor = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found!");

            const response = await axios.get(`${api_url}/api/authors`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAuthors(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching authors:", error);
            setAuthors([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = (photo) => {
        setPreviewImage(photo);
        setPreviewVisible(true);
    };

    const confirmDelete = (id) => {
        confirm({
            title: "Are you sure you want to delete this author?",
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

            console.log(`Deleting author with ID: ${id}`);

            const response = await axios.delete(`${api_url}/api/authors/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Delete response:", response);

            message.success("Author deleted successfully!");
            fetchAuthors();
        } catch (error) {
            console.error("Error deleting author:", error);
            message.error("Failed to delete author!");
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
            render: (photo) =>
                photo ? (
                    <Image
                        src={photo}
                        alt="Author"
                        width={50}
                        style={{ cursor: "pointer" }}
                        preview={false}
                        onClick={() => handlePreview(photo)}
                    />
                ) : (
                    "No photo available"
                ),
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt) => new Date(createdAt).toLocaleString(),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button icon={<InfoCircleOutlined />} onClick={() => navigate(`/authors/${record.id}`)} />
                    <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/authors/update/${record.id}`)} />
                    <Button type="danger" icon={<DeleteOutlined />} onClick={() => confirmDelete(record.id)} />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <Table
                columns={columns}
                dataSource={authors.map((author, index) => ({ ...author, key: author.id }))}
                loading={loading}
                pagination={{ pageSize: 6 }}
            />

            <Modal open={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)} centered>
                <Image src={previewImage} alt="Preview" style={{ width: "100%" }} preview={false} />
            </Modal>
        </div>
    );
};

export default AllAuthor;