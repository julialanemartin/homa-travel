import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AffiliateLink } from './AffiliateLink';
import { ShoppingCart } from 'lucide-react';

export type ProductPlatform = 'amazon' | 'rei' | 'worldnomads' | 'custom';

interface AffiliateProductProps {
  title: string;
  imageUrl: string;
  description?: string;
  price: {
    amount: number;
    currency: string;
    originalAmount?: number;
    period?: string;
  };
  platform: ProductPlatform;
  url: string;
  callToAction?: string;
  className?: string;
  affiliateId?: string;
}

// Platform-specific affiliate tracking parameters
const platformTracking: Record<ProductPlatform, (id?: string) => Record<string, string>> = {
  amazon: (id) => ({ tag: id || 'homatravel-20' }),
  rei: (id) => ({ avad: id || 'your_rei_id' }),
  worldnomads: (id) => ({ partner: id || 'your_worldnomads_id' }),
  custom: (id) => ({ ref: id || 'homatravel' })
};

// Platform-specific labels
const platformLabels: Record<ProductPlatform, string> = {
  amazon: 'View on Amazon',
  rei: 'Shop at REI',
  worldnomads: 'Get a Quote',
  custom: 'Learn More'
};

export function AffiliateProduct({
  title,
  imageUrl,
  description,
  price,
  platform,
  url,
  callToAction,
  className = '',
  affiliateId
}: AffiliateProductProps) {
  // Get platform-specific tracking parameters
  const tracking = platformTracking[platform](affiliateId);
  
  // Format price with currency
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency
  }).format(price.amount);
  
  const formattedOriginalPrice = price.originalAmount 
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: price.currency
      }).format(price.originalAmount)
    : null;
  
  const discount = price.originalAmount
    ? Math.round((1 - (price.amount / price.originalAmount)) * 100)
    : null;
  
  return (
    <Card className={`overflow-hidden border border-homa-blue/20 bg-gradient-to-b from-white to-gray-100 ${className}`}>
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-contain p-4" 
        />
        {discount && discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            {discount}% OFF
          </div>
        )}
      </div>
      
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-base line-clamp-2 text-homa-blue">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        {description && <p className="text-sm text-gray-600 line-clamp-2 mb-2">{description}</p>}
        
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-lg text-homa-blue">{formattedPrice}</span>
          {formattedOriginalPrice && (
            <span className="text-sm text-gray-500 line-through">{formattedOriginalPrice}</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <AffiliateLink 
          href={url} 
          platform={platform}
          tracking={tracking}
          showIcon={false}
          className="w-full"
        >
          <Button className="w-full bg-homa-blue hover:bg-homa-blue/90 text-white" size="sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            {callToAction || platformLabels[platform]}
          </Button>
        </AffiliateLink>
      </CardFooter>
    </Card>
  );
}