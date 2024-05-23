// src/components/AddProductForm.js
import React, { useState } from 'react';
import { commerce } from '../lib/commerce';

const AddProductForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newProduct = await commerce.products.create({
        name,
        description,
        price,
      });
      console.log('Product created:', newProduct);
      // Optionally, you can redirect the user to a confirmation page or perform other actions after product creation.
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <label>
        Price:
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      </label>
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProductForm;
