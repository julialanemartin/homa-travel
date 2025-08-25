import React from 'react';
import { cn } from '@/lib/utils';
import logoImage from '@assets/Homa Logo.png';

interface HomaLogoProps {
  className?: string;
  textClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon-only' | 'text-only';
}

export function HomaLogo({ 
  className, 
  textClassName,
  size = 'md', 
  variant = 'full' 
}: HomaLogoProps) {
  // Size mappings for the logo
  const sizeMap = {
    sm: {
      container: 'w-12 h-12',
      text: 'text-sm',
      textWrapper: 'ml-2'
    },
    md: {
      container: 'w-16 h-16',
      text: 'text-lg',
      textWrapper: 'ml-3'
    },
    lg: {
      container: 'w-24 h-24',
      text: 'text-xl font-semibold',
      textWrapper: 'ml-4'
    }
  };

  return (
    <div className={cn("flex items-center", className)}>
      {(variant === 'full' || variant === 'icon-only') && (
        <div className={cn(
          "flex items-center justify-center", 
          sizeMap[size].container
        )}>
          <img 
            src={logoImage} 
            alt="Homa Travel Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      )}
      
      {/* Only show text when variant is 'text-only' since the logo already has text */}
      {variant === 'text-only' && (
        <div className={cn(sizeMap[size].textWrapper)}>
          <span className={cn(
            "font-medium tracking-tight bg-clip-text text-transparent bg-gradient-primary",
            sizeMap[size].text,
            textClassName
          )}>
            Homa Travel Co.
          </span>
        </div>
      )}
    </div>
  );
}