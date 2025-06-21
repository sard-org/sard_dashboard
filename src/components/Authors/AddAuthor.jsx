import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Card, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { api_url } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const AddAuthor = () => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleUpload = ({ file }) => {
        setFile(file);
    };

    const handleSubmit = async (values) => {
        if (!file) {
            message.error("Please upload an image!");
            return;
        }

        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
            message.error("You must be logged in!");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("photo", file);

            await axios.post(`${api_url}/api/authors`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            message.success("Author added successfully!");
            form.resetFields();
            setFile(null);
            navigate("/authors");
        } catch (error) {
            message.error("Failed to add author!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ width: "100%", padding: 20 }}>
            <Space style={{ marginBottom: 16 }}>
                <Button type="default" onClick={() => navigate("/authors")}>
                    Back to Authors
                </Button>
            </Space>

            <Card title="Add Author" style={{ width: "100%", margin: "auto", marginTop: 20 }}>
                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                    <Form.Item
                        name="name"
                        label="Author Name"
                        rules={[{ required: true, message: "Please enter author name" }]}
                    >
                        <Input placeholder="Enter author name" />
                    </Form.Item>

                    <Form.Item label="Upload Image">
                        <Upload beforeUpload={() => false} onChange={handleUpload} showUploadList={true}>
                            <Button icon={<UploadOutlined />}>Choose Image</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Add Author
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default AddAuthor;