import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface FilterTagsProps {
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export default function FilterTags({ selectedTags, onTagSelect }: FilterTagsProps) {
  // Only tags that actually exist in our destinations
  const commonTags = [
    'Adventure', 'Beach', 'Cultural', 'Food', 'Historic', 'Nature', 'Nightlife', 'Photography', 
    'Relaxation', 'Romantic', 'Shopping', 'Urban'
  ];

  return (
    <div>
      <div className="flex items-center mb-2">
        <Filter className="h-4 w-4 mr-2 text-neutral-500" />
        <span className="text-sm font-medium">Filter by tags:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {commonTags.map(tag => (
          <Button
            key={tag}
            size="sm"
            onClick={() => onTagSelect(tag)}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            style={{
              backgroundColor: selectedTags.includes(tag) ? '#e5e5e5' : 'transparent',
              color: selectedTags.includes(tag) ? '#374151' : '#374151',
              borderColor: selectedTags.includes(tag) ? '#e5e5e5' : '#e5e5e5',
              borderRadius: '9999px',
              fontSize: '0.75rem',
            }}
            className={selectedTags.includes(tag) 
              ? "hover:bg-neutral-300 rounded-full text-xs" 
              : "hover:bg-neutral-200 rounded-full text-xs"
            }
          >
            {tag}
          </Button>
        ))}
      </div>
    </div>
  );
}