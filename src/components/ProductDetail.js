// src/components/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { commerce } from '../lib/commerce';
import DOMPurify from 'dompurify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';


const createMarkup = (html) => {
    return { __html: DOMPurify.sanitize(html) };
};

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await commerce.products.retrieve(productId);
                setProduct(response);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) {
        return <p>Loading product...</p>;
    }

    if (!product) {
        return <p>Product not found.</p>;
    }

    const addToCart = (productId, quantity) => {
        commerce.cart.add(productId, quantity).then((response) => {
            console.log('Product added to cart:', response);
        }).catch((error) => {
            console.error('Error adding product to cart:', error);
        });
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <img
                        src={product.image?.url || 'https://via.placeholder.com/300x300'}
                        alt={product.name}
                        style={{ width: '100%', height: 'auto' }}
                    />
                </div>
                <div className="col-md-6 my-5 py-5">
                    <h1>{product.name}</h1>
                    <p dangerouslySetInnerHTML={createMarkup(product.description)}></p>
                    <p><strong>{product.price.formatted_with_symbol}</strong></p>
                    <div className="quantity-input mb-2">
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            style={{ margin: '0 10px', width: '60px' }}
                        />
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => addToCart(product.id, quantity)}
                    >
                        Add to Cart
                    </button>
                    <Link to="/cart" className="btn btn-secondary" style={{ marginLeft: '10px' }}>View Cart</Link>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;