import { useEffect, useState } from "react";
import { Table, Button, Input, Space, Modal, message } from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    InfoCircleFilled,
} from "@ant-design/icons";
import axios from "axios";
import { api_url } from "../../utils/api";
import { useNavigate } from "react-router";
import Title from "antd/es/typography/Title";

const AllUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [marginLeft, setMarginLeft] = useState(190);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found in localStorage!");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${api_url}/api/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching users:", error);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();

        const handleResize = () => {
            if (window.innerWidth < 768) {
                setMarginLeft(0); // Set margin-left to 0 when screen width is less than 768px
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

    const filteredUsers = users.filter((user) => {
        const text = searchText.trim().toLowerCase();
        if (!text) return true;
        return (
            user.name?.toLowerCase().includes(text)
        );
    });

    const confirmDelete = (id) => {
        Modal.confirm({
            title: "Are you sure you want to delete this user?",
            content: "This action cannot be undone.",
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: () => handleDelete(id),
        });
    };
    
    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) return console.error("No token found!");

        try {
            await axios.delete(`${api_url}/api/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(users.filter((user) => user.id !== id));
            message.success("تم حذف المستخدم بنجاح");
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Error deleting user";
            message.error(errorMsg);
            console.error("Error deleting User:", error);
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
            title: "Phone No.",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "E-Mail",
            dataIndex: "email",
            key: "email",
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: "Verified",
            dataIndex: "isVerified",
            key: "isVerified",
            render: (isVerified) => (isVerified ? "Yes" : "No"),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/users/${record.id}/update`)}
                    />
                    <Button
                        type="default"
                        icon={<InfoCircleFilled />}
                        onClick={() => navigate(`/users/${record.id}/view`)}
                    />
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => confirmDelete(record.id)}
                    />
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
                <Title level={2}>All Users</Title>
                <Space>
                    {/* <Button type="primary" icon={<PlusOutlined />}>
                        New Customer
                    </Button> */}
                    <Input
                        placeholder="Search..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 200 }}
                    />
                </Space>
            </Space>
            <Table
                columns={columns}
                dataSource={filteredUsers.map((user, index) => ({ ...user, key: index }))} // Add key for React list rendering
                loading={loading}
                pagination={{ pageSize: 7 }}
            />
        </div>
    );
};

export default AllUser;