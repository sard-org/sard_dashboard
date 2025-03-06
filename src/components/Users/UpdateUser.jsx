import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Select, message, Card } from "antd";
import axios from "axios";
import { api_url } from "../../utils/api";

const { Option } = Select;

const UpdateUser = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [form] = Form.useForm();

    // Fetch user details
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    message.error("No token found!");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${api_url}/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);
                form.setFieldsValue({
                    ...response.data,
                    isVerified: response.data.isVerified ? "true" : "false", // تحويل البوليان لنص للقائمة المنسدلة
                });
            } catch (error) {
                message.error("Error fetching user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId, form]);

    // Update user
    const onFinish = async (values) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                message.error("No token found!");
                setLoading(false);
                return;
            }

            // تحويل قيمة isVerified إلى Boolean قبل الإرسال
            const updatedValues = {
                ...values,
                isVerified: values.isVerified === "true",
            };

            await axios.patch(`${api_url}/api/users/${userId}`, updatedValues, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            message.success("User updated successfully!");
            navigate("/users");
        } catch (error) {
            message.error("Error updating user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="Update User" style={{ maxWidth: 500, margin: "auto", marginTop: 20 }}>
            {user ? (
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter name" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Phone No."
                        name="phone"
                        rules={[{ required: true, message: "Please enter phone number" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="E-Mail"
                        name="email"
                        rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Verified Status"
                        name="isVerified"
                        rules={[{ required: true, message: "Please select verification status" }]}
                    >
                        <Select>
                            <Option value="true">True</Option>
                            <Option value="false">False</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            ) : (
                <p>Loading user details...</p>
            )}
        </Card>
    );
};

export default UpdateUser;
