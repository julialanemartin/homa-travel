import React from 'react';
import { GoogleAd } from './GoogleAd.js';
import { cn } from '@/lib/utils.js';

// Different standard ad sizes
export type AdSize = 
  | 'banner' // 468x60
  | 'leaderboard' // 728x90
  | 'rectangle' // 300x250
  | 'large-rectangle' // 336x280
  | 'skyscraper' // 160x600
  | 'wide-skyscraper' // 300x600
  | 'mobile-banner'; // 320x50

interface AdSectionProps {
  size: AdSize;
  className?: string;
  // This will be a prop you'll need to replace with your actual AdSense ID
  clientId?: string;
  // This will be a prop you'll need to replace with your actual AdSense slot ID for each ad unit
  slotId?: string;
}

export function AdSection({ 
  size, 
  className, 
  clientId = 'ca-pub-XXXXXXXXXXXXXXXX', // Replace with your AdSense publisher ID
  slotId = '1234567890' // Replace with your ad unit ID
}: AdSectionProps) {
  
  // Map ad sizes to appropriate formats and class names
  const adSizeMap: Record<AdSize, { format: 'auto' | 'rectangle' | 'horizontal' | 'vertical', className: string }> = {
    'banner': { format: 'horizontal', className: 'h-[60px] w-[468px] mx-auto' },
    'leaderboard': { format: 'horizontal', className: 'h-[90px] w-[728px] mx-auto' },
    'rectangle': { format: 'rectangle', className: 'h-[250px] w-[300px] mx-auto' },
    'large-rectangle': { format: 'rectangle', className: 'h-[280px] w-[336px] mx-auto' },
    'skyscraper': { format: 'vertical', className: 'h-[600px] w-[160px] mx-auto' },
    'wide-skyscraper': { format: 'vertical', className: 'h-[600px] w-[300px] mx-auto' },
    'mobile-banner': { format: 'horizontal', className: 'h-[50px] w-[320px] mx-auto' },
  };

  const { format, className: sizeClassName } = adSizeMap[size];

  return (
    <div className={cn('bg-homa-blue text-white rounded-md p-2', sizeClassName, className)}>
      <GoogleAd 
        client={clientId}
        slot={slotId}
        format={format}
        responsive={true}
      />
      
      {/* During development, show a placeholder */}
      {process.env.NODE_ENV === 'development' && (
        <div className="w-full h-full flex items-center justify-center text-center text-white text-sm border border-dashed border-white/30">
          <div>
            <p className="font-medium">Advertisement</p>
            <p className="text-xs opacity-70">({size} ad slot)</p>
          </div>
        </div>
      )}
    </div>
  );
}