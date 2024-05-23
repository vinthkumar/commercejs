import React, { useState, useEffect } from 'react';
import { commerce } from '../lib/commerce';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [cartVisible, setCartVisible] = useState(false); 
  const [cartCount, setCartCount] = useState(0); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await commerce.products.list();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

  const addToCart = async (productId, quantity) => {
    try {
      await commerce.cart.add(productId, quantity);
      setCartVisible(true); 
      setCartCount(prevCount => prevCount + quantity);
      alert('Product added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('There was an issue adding the product to the cart');
    }
  };

  const createMarkup = (html) => {
    return { __html: html };
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="container my-4 px-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Our products</h2>
        <Link to="/cart" className="btn btn-primary position-relative">
          <FaShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
      <div className="row mt-4">
        {products.map(product => {
          const imageUrl = product.image?.url || 'https://via.placeholder.com/300x300';
          const quantity = quantities[product.id] || 1;

          return (
            <div key={product.id} className="col-md-4">
              <div className="card mb-4">
                <div className="border-bottom border-dark">
                  <img
                    src={imageUrl}
                    className="card-img-top"
                    alt={product.name}
                    style={{ width: '406px', height: '300px', objectFit: 'cover' }}
                  />
                </div>
                <div className="card-body">
                  <h5 className="fs-6 text-success py-2">{product.categories.map(category => category.name).join(', ')}</h5>
                  <h4 className="card-title py-2">{product.name}</h4>
                  {/* <p className="card-text" dangerouslySetInnerHTML={createMarkup(product.description)}></p> */}
                  <p className="card-text fs-5"><strong>{product.price.formatted_with_symbol}</strong></p>
                  <div className="" role="group">
                    <button
                      className="btn btn-primary"
                      onClick={() => addToCart(product.id, quantity)}
                    >
                      Add to Cart
                    </button>
                    <Link to={`/product/${product.id}`} className="btn btn-danger mx-3">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* {cartVisible && (
        <div className="row">
          <div className="col-md-12 text-center">
            <Link to="/cart" className="btn btn-primary">View Cart</Link>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ProductsList;
