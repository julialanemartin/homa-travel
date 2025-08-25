import React, { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Newsletter() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await apiRequest('POST', '/api/newsletter', { 
        name, 
        email,
        createdAt: new Date().toISOString()
      });
      
      if (response.ok) {
        toast({
          title: "Success!",
          description: "Thanks for subscribing to our newsletter!",
        });
        setName('');
        setEmail('');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to subscribe');
      }
    } catch (error: any) {
      toast({
        title: "Subscription failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16" style={{ backgroundColor: 'hsl(var(--homa-blue))' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Join Our Travel Community</h2>
          <p className="mb-8 text-white/90">
            Subscribe to receive destination inspiration, travel tips, and exclusive offers.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
              <Input 
                type="text" 
                placeholder="Your Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-grow px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Input 
                type="email" 
                placeholder="Your Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-white text-homa-blue hover:bg-white/90 font-bold py-3 px-6 rounded-lg transition-colors whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
            <p className="mt-4 text-xs text-white/70">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
