import React, { useEffect, useState } from "react";
import { Card, Spin, Button, Image, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { api_url } from "../../utils/api";

const AuthorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuthorDetails = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await axios.get(`${api_url}/api/authors/${id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                setAuthor(response.data);
            } catch (error) {
                message.error("Error fetching author details");
            } finally {
                setLoading(false);
            }
        };

        fetchAuthorDetails();
    }, [id]);

    if (loading) return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
    if (!author) return <p style={{ textAlign: "center" }}>No author found</p>;

    return (
        <div style={{ padding: 20 }}>
            <Button onClick={() => navigate("/authors")} type="primary" style={{ marginBottom: "20px" }}>
                Back to Authors
            </Button>
            <Card title={`Author: ${author.name}`} style={{ width: "100%" }}>
                {author.photo && <Image src={author.photo} width={100} />}
                <p><strong>Name:</strong> {author.name}</p>
                <p><strong>Created At:</strong> {new Date(author.createdAt).toLocaleString()}</p>
                <Button onClick={() => navigate(`/authors/update/${id}`)} style={{ marginTop: "10px" }}>
                    Edit Author
                </Button>
            </Card>
        </div>
    );
};

export default AuthorDetails;
