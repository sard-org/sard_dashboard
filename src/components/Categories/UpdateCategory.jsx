import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, Spin, message, Upload } from "antd";
import axios from "axios";
import { api_url } from "../../utils/api";
import { UploadOutlined } from "@ant-design/icons";

const UpdateCategory = () => {
    const { id } = useParams();  // Get category ID from URL params
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [fileList, setFileList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategoryDetails();
    }, [id]);

    const fetchCategoryDetails = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found!");

            const response = await axios.get(`${api_url}/api/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategory(response.data);
        } catch (error) {
            console.error("Error fetching category details:", error);
            message.error("Failed to fetch category details!");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (values) => {
        setUpdating(true);
        const formData = new FormData();
        formData.append("name", values.name);
        if (fileList.length > 0) {
            formData.append("photo", fileList[0].originFileObj); // Appending the file from the file list
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                message.error("You must be logged in!");
                return;
            }

            const response = await axios.patch(
                `${api_url}/api/categories/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",  // Important to specify for file uploads
                    },
                }
            );

            message.success("Category updated successfully!");
            navigate("/categories");
        } catch (error) {
            console.error("Error updating category:", error);
            message.error("Failed to update category!");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <Spin size="large" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }} />;
    }

    return (
        <div style={{ padding: 20 }}>
            <Button 
                onClick={() => navigate("/categories")} 
                style={{
                    marginBottom: 20,
                    padding: "8px 16px",
                    fontSize: "16px",
                    cursor: "pointer",
                    border: "none",
                    backgroundColor: "#1890ff",
                    color: "#fff",
                    borderRadius: "4px"
                }}
            >
                Back to Categories
            </Button>

            {category ? (
                <Form
                    initialValues={{
                        name: category.name,
                    }}
                    onFinish={handleUpdate}
                    layout="vertical"
                >
                    <Form.Item
                        label="Category Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter the category name!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Category Photo" name="photo">
                        <Upload
                            fileList={fileList}
                            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                            beforeUpload={() => false} // Prevent automatic upload
                        >
                            <Button icon={<UploadOutlined />}>Upload Photo</Button>
                        </Upload>
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={updating}
                        style={{ width: "100%" }} // Full width button
                    >
                        Update Category
                    </Button>
                </Form>
            ) : (
                <p>Category not found!</p>
            )}
        </div>
    );
};

export default UpdateCategory;
