import React, { useEffect, useState } from "react";
import { Card, Spin, message } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { api_url } from "../../utils/api";

const BookDetails = () => {
    const { id } = useParams(); // Get book ID from URL
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch book details
    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${api_url}/api/books/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBook(response.data);
            } catch (error) {
                message.error("فشل في جلب تفاصيل الكتاب!");
            } finally {
                setLoading(false);
            }
        };
        fetchBookDetails();
    }, [id]);

    if (loading) return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;

    if (!book) return <p style={{ textAlign: "center", marginTop: 50 }}>لم يتم العثور على الكتاب</p>;

    return (
        <Card title={book.title} style={{ maxWidth: 600, margin: "20px auto" }}>
            <img
                src={book.cover}
                alt="Book Cover"
                style={{ width: "100%", height: 250, objectFit: "cover", borderRadius: 5 }}
            />
            <p><strong>الوصف:</strong> {book.description}</p>
            <p><strong>السعر:</strong> {book.is_free ? "مجاني" : `${book.price} ريال`}</p>
            <p><strong>النقاط:</strong> {book.price_points}</p>
            <p><strong>المؤلف:</strong> {book.Author ? book.Author.name : "غير معروف"}</p>
        </Card>
    );
};

export default BookDetails;
