import React from 'react';
import { ExternalLink } from 'lucide-react';

interface AffiliateLinkProps {
  href: string;
  children: React.ReactNode;
  platform: string;
  showIcon?: boolean;
  className?: string;
  tracking?: Record<string, string>;
}

export function AffiliateLink({ 
  href, 
  children, 
  platform, 
  showIcon = true, 
  className = '',
  tracking = {}
}: AffiliateLinkProps) {
  // Append tracking parameters if provided
  let url = href;
  if (Object.keys(tracking).length > 0) {
    const urlObj = new URL(href);
    Object.entries(tracking).forEach(([key, value]) => {
      urlObj.searchParams.append(key, value);
    });
    url = urlObj.toString();
  }
  
  // Handle click events for analytics
  const handleClick = (e: React.MouseEvent) => {
    // Track affiliate link clicks
    if ((window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        'affiliate_platform': platform,
        'outbound_url': url
      });
    }
  };

  return (
    <a 
      href={url}
      onClick={handleClick}
      target="_blank" 
      rel="noopener noreferrer sponsored"
      className={`inline-flex items-center text-primary hover:underline ${className}`}
      data-affiliate={platform}
    >
      {children}
      {showIcon && <ExternalLink className="ml-1 h-3 w-3" />}
      <span className="sr-only">(affiliate link)</span>
    </a>
  );
}