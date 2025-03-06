import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Button, Spin, message } from "antd";
import axios from "axios";
import { api_url } from "../../utils/api";

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                message.error("No token found!");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${api_url}/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (error) {
                message.error("Error fetching user details");
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [userId]);

    if (loading) {
        return <Spin size="large" style={{ display: "block", margin: "20px auto" }} />;
    }

    if (!user) {
        return <p>User not found!</p>;
    }

    return (
        <Card title="User Details" style={{ maxWidth: 600, margin: "auto", marginTop: 20 }}>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
                <Descriptions.Item label="Phone No.">{user.phone}</Descriptions.Item>
                <Descriptions.Item label="E-Mail">{user.email}</Descriptions.Item>
                <Descriptions.Item label="Verified">{user.isVerified ? "Yes" : "No"}</Descriptions.Item>
            </Descriptions>
            <Button type="primary" onClick={() => navigate("/users")} style={{ marginTop: 16 }}>
                Back to Users
            </Button>
        </Card>
    );
};

export default UserDetails;
