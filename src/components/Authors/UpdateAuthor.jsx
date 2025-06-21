import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { api_url } from "../../utils/api";

const UpdateAuthor = () => {
    const { id: authorId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchAuthorDetails = async () => {
            if (!authorId) return;
            const token = localStorage.getItem("token");

            try {
                const response = await axios.get(`${api_url}/api/authors/${authorId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                form.setFieldsValue({ name: response.data.name });
            } catch (error) {
                message.error("Failed to fetch author details!");
            }
        };

        fetchAuthorDetails();
    }, [authorId, form]);

    const handleFileChange = ({ file }) => {
        setFile(file.originFileObj);
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const formData = new FormData();
            formData.append("name", values.name);
            if (file) {
                formData.append("photo", file);
            }

            await axios.patch(`${api_url}/api/authors/${authorId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            message.success("Author updated successfully!");
            navigate(`/authors/${authorId}`);
        } catch (error) {
            message.error("Failed to update author!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <Button onClick={() => navigate("/authors")} type="primary" style={{ marginBottom: "20px" }}>
                Back to Authors
            </Button>
            <Form layout="vertical" form={form} onFinish={handleSubmit} style={{ width: "100%" }}>
                <Form.Item
                    name="name"
                    label="Author Name"
                    rules={[{ required: true, message: "Please enter author name" }]}
                >
                    <Input placeholder="Enter author name" />
                </Form.Item>

                <Form.Item label="Upload Photo">
                    <Upload beforeUpload={() => false} onChange={handleFileChange} showUploadList={true}>
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Update Author
                    </Button>
                    <Button onClick={() => navigate("/authors")} style={{ marginLeft: "10px" }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdateAuthor;
