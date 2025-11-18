import React from 'react';
import { Link } from 'wouter';
import { useCart } from '@/providers/CartProvider.js';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button.js';
import { Separator } from '@/components/ui/separator.js';

export default function Cart() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart, isLoading } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ShoppingBag className="h-16 w-16 text-neutral-300 mb-4" />
        <h2 className="text-2xl font-heading font-bold mb-2">Your cart is empty</h2>
        <p className="text-neutral-600 mb-6">Looks like you haven't added any travel guides to your cart yet.</p>
        <Button asChild>
          <Link href="/shop">Browse Travel Guides</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Your Cart</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => clearCart()}
          disabled={isLoading}
          className="text-sm"
        >
          Clear Cart
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {cartItems.map((item) => (
          <div key={item.id} className="mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <div className="w-full md:w-2/12">
                <img 
                  src={item.product?.imageUrl} 
                  alt={item.product?.title} 
                  className="rounded-md h-24 w-full md:w-24 object-cover"
                />
              </div>
              <div className="w-full md:w-6/12 mt-4 md:mt-0 md:px-4">
                <Link href={`/shop/${item.product?.id}`}>
                  <h3 className="font-heading font-semibold text-lg hover:text-primary transition-colors">
                    {item.product?.title}
                  </h3>
                </Link>
                <p className="text-neutral-600 text-sm mt-1">
                  Digital Download
                </p>
              </div>
              <div className="w-full md:w-2/12 mt-4 md:mt-0 text-center">
                <div className="flex items-center justify-center">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1 || isLoading}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="mx-3 w-8 text-center">{item.quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={isLoading}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="w-full md:w-1/12 mt-4 md:mt-0 text-center">
                <span className="font-semibold">
                  {formatPrice(item.product?.price || 0)}
                </span>
              </div>
              <div className="w-full md:w-1/12 mt-4 md:mt-0 text-right">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeFromCart(item.id)}
                  disabled={isLoading}
                  className="text-neutral-500 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Separator className="mt-6" />
          </div>
        ))}
        
        <div className="mt-8">
          <div className="flex justify-between mb-2">
            <span className="text-neutral-600">Subtotal</span>
            <span className="font-semibold">{formatPrice(cartTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Taxes</span>
            <span className="font-semibold">{formatPrice(0)}</span>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-bold">{formatPrice(cartTotal)}</span>
          </div>
          
          <Button 
            className="w-full mt-6 py-6" 
            disabled={isLoading}
            asChild
          >
            <Link href="/checkout">
              Proceed to Checkout
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
