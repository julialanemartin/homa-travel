import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button.js';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.js';
import { Label } from '@/components/ui/label.js';
import { ArrowRight, Mountain, Umbrella, Utensils, Landmark } from 'lucide-react';

type TravelStyle = 'adventure' | 'relaxation' | 'culinary' | 'cultural';

interface StyleOption {
  id: TravelStyle;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function DestinationMatcher() {
  const [selectedStyle, setSelectedStyle] = useState<TravelStyle | null>(null);
  const [, setLocation] = useLocation();

  const travelStyles: StyleOption[] = [
    {
      id: 'adventure',
      title: 'Adventure Seeker',
      description: 'You live for thrills and new experiences',
      icon: <Mountain className="text-white" />
    },
    {
      id: 'relaxation',
      title: 'Relaxation Enthusiast',
      description: 'You prefer peaceful getaways and relaxation',
      icon: <Umbrella className="text-white" />
    },
    {
      id: 'culinary',
      title: 'Culinary Explorer',
      description: 'Your travels are guided by food experiences',
      icon: <Utensils className="text-white" />
    },
    {
      id: 'cultural',
      title: 'Cultural Immersion',
      description: 'You seek history, art, and local traditions',
      icon: <Landmark className="text-white" />
    }
  ];

  const handleContinue = () => {
    if (selectedStyle) {
      setLocation(`/destination-matcher?style=${selectedStyle}`);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Find Your Perfect Match</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Answer a few questions about your travel preferences and we'll match you with destinations you'll love.
          </p>
        </div>
        
        <div className="bg-gradient-primary text-gray-800 rounded-2xl p-6 md:p-10 shadow-lg max-w-4xl mx-auto">
          {/* Questionnaire Preview */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="mb-8">
              <span className="inline-block bg-gradient-primary text-white font-medium px-3 py-1 rounded-full text-sm mb-4">
                Question 1 of 5
              </span>
              <h3 className="font-heading font-semibold text-2xl mb-3 text-neutral-700">What type of traveler are you?</h3>
              <p className="text-neutral-600">Select the option that best describes your travel style.</p>
            </div>
            
            <RadioGroup value={selectedStyle || ""} onValueChange={(value) => setSelectedStyle(value as TravelStyle)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {travelStyles.map((style) => (
                  <div key={style.id} className="rounded-lg">
                    <RadioGroupItem 
                      value={style.id} 
                      id={style.id} 
                      className="peer sr-only" 
                    />
                    <Label 
                      htmlFor={style.id}
                      className="relative bg-neutral-100 rounded-lg p-4 cursor-pointer border-2 border-transparent hover:border-primary transition-all flex peer-checked:border-primary"
                    >
                      <div className="flex items-start">
                        <div className="bg-gradient-primary rounded-full p-2 mr-3">
                          {style.icon}
                        </div>
                        <div>
                          <h4 className="font-medium mb-1 text-gray-800">{style.title}</h4>
                          <p className="text-sm text-gray-800">{style.description}</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleContinue}
                disabled={!selectedStyle}
                className="bg-gradient-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-lg transition-colors"
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
