import React, { useState, useEffect } from 'react';
import { commerce } from '../lib/commerce';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Checkout = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [shippingData, setShippingData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        email: '',
        city: '',
        zip: '',
        country: 'US',
        state: '', // Empty state initially
    });
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvc: '',
        postalZipCode: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartAndToken = async () => {
            try {
                const cart = await commerce.cart.retrieve();
                setCart(cart);

                if (cart.total_items > 0) {
                    const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });
                    setCheckoutToken(token);
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
                setErrorMessage('Error fetching cart. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCartAndToken();
    }, []);

    const handleShippingInputChange = (e) => {
        const { name, value } = e.target;
        setShippingData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handlePaymentInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!shippingData.state) {
            setErrorMessage('Please select a state.');
            return;
        }
        try {
            if (!checkoutToken || !checkoutToken.id) {
                throw new Error('Checkout token is not properly initialized');
            }

            const orderData = {
                line_items: cart.line_items.reduce((acc, item) => {
                    acc[item.id] = { quantity: item.quantity };
                    return acc;
                }, {}),
                customer: {
                    firstname: shippingData.firstName,
                    lastname: shippingData.lastName,
                    county_state: shippingData.state,
                    email: shippingData.email
                },
                shipping: {
                    name: `${shippingData.firstName} ${shippingData.lastName}`,
                    street: shippingData.address,
                    town_city: shippingData.city,
                    county_state: shippingData.state,
                    postal_zip_code: shippingData.zip,
                    country: shippingData.country
                },
                fulfillment: {
                    shipping_method: 'ship_7RyWOwmK5nEa2V'
                },
                billing: {
                    name: `${shippingData.firstName} ${shippingData.lastName}`,
                    street: shippingData.address,
                    town_city: shippingData.city,
                    county_state: shippingData.state,
                    postal_zip_code: shippingData.zip,
                    country: shippingData.country
                },
                payment: {
                    gateway: 'test_gateway',
                    card: {
                        number: paymentData.cardNumber,
                        expiry_month: paymentData.expiryMonth,
                        expiry_year: paymentData.expiryYear,
                        cvc: paymentData.cvc,
                        postal_zip_code: paymentData.postalZipCode
                    }
                },
                // pay_what_you_want: 149.99 // Ensure this is a valid number
            };

            const incomingOrder = await commerce.checkout.capture(checkoutToken.id, orderData);
            setOrder(incomingOrder);
            navigate('/confirmation', { state: { order: incomingOrder } });
        } catch (error) {
            console.error('Checkout error:', error);
            setErrorMessage(error.data?.error?.message || 'An error occurred during checkout');
        }
    };

    if (loading) {
        return <p>Loading checkout...</p>;
    }

    if (!cart || cart.total_items === 0) {
        return <p>No items in cart. <a href="/">Start shopping</a></p>;
    }

    return (
        <div className="container">
            <h1>Checkout</h1>
            <form onSubmit={handleSubmit}>
                {/* Item Details */}
                <div className="row">
                    <h2>Item Details</h2>
                    {cart.line_items.map((item) => (
                        <div key={item.id} className="form-group col-md-12">
                            <label>{item.name}</label>
                            <input type="number" className="form-control" value={item.quantity} readOnly />
                            <p>Price: {item.price.formatted_with_symbol}</p>
                        </div>
                    ))}
                </div>

                {/* Customer Details */}
                <div className="row">
                    <h2>Customer Details</h2>
                    <div className="form-group col-md-6">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" className="form-control" id="email" name="email" value={shippingData.email} onChange={handleShippingInputChange} required />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="state">State</label>
                        <select name="state" className="form-control" value={shippingData.state} onChange={handleShippingInputChange} required>
                            <option disabled>County/State/Province</option>
                            <option value="CA">California</option>
                            <option value="TX">Texas</option>
                            <option value="NY">New York</option>
                            {/* Add other state options here */}
                        </select>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="row">
                    <h2>Shipping Address</h2>
                    <div className="form-group col-md-6">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" className="form-control" id="firstName" name="firstName" value={shippingData.firstName} onChange={handleShippingInputChange} required />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" className="form-control" id="lastName" name="lastName" value={shippingData.lastName} onChange={handleShippingInputChange} required />
                    </div>
                    <div className="form-group col-md-12">
                        <label htmlFor="address">Street Address</label>
                        <input type="text" className="form-control" id="address" name="address" value={shippingData.address} onChange={handleShippingInputChange} required />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="city">Town/City</label>
                        <input type="text" className="form-control" id="city" name="city" value={shippingData.city} onChange={handleShippingInputChange} required />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="zip">Post/Zip Code</label>
                        <input type="text" className="form-control" id="zip" name="zip" value={shippingData.zip} onChange={handleShippingInputChange} required />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="country">Country</label>
                        <select className="form-control" id="country" name="country" value={shippingData.country} onChange={handleShippingInputChange} required>
                            <option value="US">United States</option>
                            <option value="IN">India</option>
                        </select>
                    </div>
                </div>

                {/* Payment Details */}
                <div className="row">
                    <h2>Payment Details</h2>
                    <div className="form-group col-md-6">
                        <label htmlFor="cardNumber">Card Number</label>
                        <input type="text" className="form-control" id="cardNumber" name="cardNumber" value={paymentData.cardNumber} onChange={handlePaymentInputChange} required />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="expiryMonth">Expiry Month</label>
                        <input type="text" className="form-control" id="expiryMonth" name="expiryMonth" value={paymentData.expiryMonth} onChange={handlePaymentInputChange} required />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="expiryYear">Expiry Year</label>
                        <input type="text" className="form-control" id="expiryYear" name="expiryYear" value={paymentData.expiryYear} onChange={handlePaymentInputChange} required />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="cvc">CVC</label>
                        <input type="text" className="form-control" id="cvc" name="cvc" value={paymentData.cvc} onChange={handlePaymentInputChange} required />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="postalZipCode">Postal Zip Code</label>
                        <input type="text" className="form-control" id="postalZipCode" name="postalZipCode" value={paymentData.postalZipCode} onChange={handlePaymentInputChange} required />
                    </div>
                </div>

                {/* Error Message */}
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary btn-lg btn-block">Place Order</button>
            </form>
        </div>
    );
};

export default Checkout;
