import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AffiliateLink } from './AffiliateLink';

export type BookingPlatform = 'booking' | 'expedia' | 'airbnb' | 'tripadvisor' | 'kayak';

interface BookingWidgetProps {
  title: string;
  description?: string;
  imageUrl: string;
  price?: {
    amount: number;
    currency: string;
    period?: 'night' | 'day' | 'week' | 'month' | 'person';
  };
  rating?: {
    score: number;
    count: number;
  };
  platform: BookingPlatform;
  url: string;
  className?: string;
  affiliateId?: string;
}

// Helper function to format currency
const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Helper function to format rating as stars
const RatingStars = ({ score, count }: { score: number; count: number }) => {
  const fullStars = Math.floor(score);
  const hasHalfStar = score % 1 >= 0.5;
  
  return (
    <div className="flex items-center">
      <div className="flex text-yellow-400">
        {Array(5).fill(0).map((_, i) => {
          if (i < fullStars) {
            return <span key={i}>★</span>;
          } else if (i === fullStars && hasHalfStar) {
            return <span key={i}>⯪</span>;
          } else {
            return <span key={i} className="opacity-40">★</span>;
          }
        })}
      </div>
      <span className="text-sm text-gray-600 ml-2">({count})</span>
    </div>
  );
};

// Platform-specific affiliate tracking parameters
const platformTracking: Record<BookingPlatform, (id?: string) => Record<string, string>> = {
  booking: (id) => ({ aid: id || '123456789' }),
  expedia: (id) => ({ expid: id || '987654321' }),
  airbnb: (id) => ({ referral: id || 'your_airbnb_ref' }),
  tripadvisor: (id) => ({ partner: id || 'your_tripadvisor_ref' }),
  kayak: (id) => ({ origin: 'homatravel', kayak_id: id || 'your_kayak_ref' })
};

// Platform-specific labels
const platformLabels: Record<BookingPlatform, string> = {
  booking: 'Book on Booking.com',
  expedia: 'Check on Expedia',
  airbnb: 'View on Airbnb',
  tripadvisor: 'See on TripAdvisor',
  kayak: 'Compare on KAYAK'
};

export function BookingWidget({ 
  title, 
  description, 
  imageUrl, 
  price, 
  rating, 
  platform, 
  url, 
  className = '',
  affiliateId
}: BookingWidgetProps) {
  // Get platform-specific tracking parameters
  const tracking = platformTracking[platform](affiliateId);
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="aspect-[16/10] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover" 
        />
      </div>
      
      <CardHeader className="p-4">
        <CardTitle className="text-xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        {rating && <RatingStars score={rating.score} count={rating.count} />}
        
        {price && (
          <div className="mt-2 font-semibold text-lg">
            {formatCurrency(price.amount, price.currency)}
            {price.period && <span className="text-sm font-normal text-gray-500 ml-1">/{price.period}</span>}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <AffiliateLink 
          href={url} 
          platform={platform}
          tracking={tracking}
          showIcon={false}
          className="w-full"
        >
          <Button className="w-full" size="sm">{platformLabels[platform]}</Button>
        </AffiliateLink>
      </CardFooter>
    </Card>
  );
}