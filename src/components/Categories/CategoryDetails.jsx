import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Spin, message } from "antd";
import axios from "axios";
import { api_url } from "../../utils/api";

const CategoryDetails = () => {
    const { id } = useParams();  // Get category ID from URL params
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
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

    if (loading) {
        return <Spin size="large" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }} />;
    }

    return (
        <div style={{ padding: 20 }}>
            {category ? (
                <Card title={`Category: ${category.name}`} bordered={false}>
                    <p><strong>Category Name:</strong> {category.name}</p>
                    <p><strong>Created At:</strong> {new Date(category.createdAt).toLocaleString()}</p>
                    <p><strong>Photo:</strong></p>
                    {category.photo && (
                        <img 
                            src={category.photo} 
                            alt={category.name} 
                            style={{ width: 200, height: 200, objectFit: "cover" }} 
                        />
                    )}
                    <br />
                    <button onClick={() => navigate("/categories")}>Back to Categories</button>
                </Card>
            ) : (
                <p>Category not found!</p>
            )}
        </div>
    );
};

export default CategoryDetails;
