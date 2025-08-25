import React from 'react';
import { Link } from 'wouter';
import { useLocation } from 'wouter';
import { Product } from '@/lib/types';
import { Star, StarHalf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/providers/CartProvider';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isLoading } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocation(`/shop/${product.id}`);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-accent text-accent w-4 h-4" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-accent text-accent w-4 h-4" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-accent w-4 h-4" />);
    }
    
    return stars;
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <Link href={`/shop/${product.id}`}>
        <div className="relative h-48">
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute top-4 right-4 bg-homa-blue text-white font-medium px-3 py-1 rounded-full">
            {formatPrice(product.price)}
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-heading font-semibold text-lg mb-2">{product.title}</h3>
          <p className="text-neutral-600 text-sm mb-4">
            {product.description.length > 80 
              ? product.description.substring(0, 80) + '...' 
              : product.description}
          </p>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {renderStars(product.rating)}
              <span className="ml-1 text-xs text-neutral-600">({product.reviewCount})</span>
            </div>
            <Button
              size="sm"
              onClick={handlePreview}
              className="bg-homa-blue hover:bg-homa-blue/90 text-white font-medium py-1.5 px-4 rounded-lg text-sm transition-colors"
            >
              Preview
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}
