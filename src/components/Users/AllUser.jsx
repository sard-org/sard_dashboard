import React, { useEffect, useState } from "react";
import { Table, Button, Input, Space } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, InfoOutlined, InfoCircleFilled } from "@ant-design/icons";
import axios from "axios";
import { api_url } from "../../utils/api";
import { useNavigate } from "react-router";

const AllUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
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
                        "Authorization": `Bearer ${token}`,
                    }
                });
                console.log("API Response:", response.data);
                setUsers(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching users:", error);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) =>
        user.email.toLowerCase().includes(searchText.toLowerCase())
    );

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
        } catch (error) {
            console.error("Error deleting user:", error);
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
            sorter: (a, b) => a.phone.localeCompare(b.phone),
        },
        {
            title: "E-Mail",
            dataIndex: "email",
            key: "email",
            sorter: (a, b) => a.email.localeCompare(b.email),
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
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        }
    ];

    return (
        <div style={{ padding: 20 }}>
            <Space style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
                <Button type="primary" icon={<PlusOutlined />}>
                    New Customer
                </Button>
                <Input
                    placeholder="Search..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 200 }}
                />
            </Space>

            <Table
                columns={columns}
                dataSource={filteredUsers.map((user, index) => ({ ...user, key: index }))}
                loading={loading}
                pagination={{ pageSize: 7 }}
            />
        </div>
    );
};

export default AllUser;
