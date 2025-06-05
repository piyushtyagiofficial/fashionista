import React from 'react';
import Cart from '../components/buyer/Cart';

const CartPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <Cart />
    </div>
  );
};

export default CartPage;