// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductsList from './components/ProductsList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Confirmation from './components/Confirmation';
import AddProductForm from './components/AddProductForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductsList />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/addproduct" element={<AddProductForm />} />
      </Routes>
    </Router>
  );
};

export default App;
