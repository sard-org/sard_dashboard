import React, { useEffect, useState } from "react";
import { Card, Spin, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { api_url } from "../../utils/api";

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${api_url}/api/books/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBook(response.data);
            } catch (error) {
                message.error("Failed to fetch book details!");
            } finally {
                setLoading(false);
            }
        };
        fetchBookDetails();
    }, [id]);

    if (loading) {
        return <Spin size="large" style={{ display: "flex", justifyContent: "center", marginTop: 20 }} />;
    }

    if (!book) {
        return <p style={{ textAlign: "center", marginTop: 50 }}>Book not found</p>;
    }

    return (
        <div style={{ padding: 20 }}>
            <button
                onClick={() => navigate("/books")}
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
                Back to Books
            </button>

            <Card title={`Title: ${book.title}`} bordered={false} style={{ margin: "0 auto" }}>
                <img
                    src={book.cover}
                    alt="Book Cover"
                    style={{ height: 250, objectFit: "cover", borderRadius: 5, marginBottom: 20 }}
                />
                <p><strong>Description:</strong> {book.description}</p>
                <p><strong>Price:</strong> {book.is_free ? "Free" : `${book.price} SAR`}</p>
                <p><strong>Points:</strong> {book.price_points}</p>
                <p><strong>Rating:</strong> {book.rating}</p>
                <p><strong>Author:</strong> {book.Author ? book.Author.name : "Unknown"}</p>
            </Card>
        </div>
    );
};

export default BookDetails;