import React from 'react';
import { Helmet } from 'react-helmet';
import CartComponent from '@/components/shop/Cart';

export default function Cart() {
  return (
    <>
      <Helmet>
        <title>Your Cart | Homa Travel Co.</title>
        <meta name="description" content="View and manage your shopping cart items from Homa Travel Co." />
      </Helmet>
      
      <div className="bg-neutral-100 min-h-[calc(100vh-64px-400px)]">
        <CartComponent />
      </div>
    </>
  );
}
