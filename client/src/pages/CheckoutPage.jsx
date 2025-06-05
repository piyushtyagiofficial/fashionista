import React from 'react';
import Checkout from '../components/buyer/Checkout';

const CheckoutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <Checkout />
    </div>
  );
};

export default CheckoutPage;