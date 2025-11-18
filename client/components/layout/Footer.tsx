import React from 'react';
import { Link } from 'wouter';
import { Compass, Facebook, Twitter, Instagram, Linkedin, Globe, BookOpen, ShoppingBag, MapPin, Info, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button.js';
import { HomaLogo } from '@/components/logo/HomaLogo.js';

export default function Footer() {
  return (
    <footer className="bg-[#2d8a9a] text-white border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto max-w-6xl">
        {/* Newsletter Signup */}
        <div className="mb-16 p-8 rounded-lg text-white bg-white/10 backdrop-blur-sm shadow-lg border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-xl font-medium">Join Our Newsletter</h3>
              <p className="text-sm text-white/70">
                Get the latest travel tips, destination insights, and exclusive offers.
              </p>
            </div>
            <div>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-2 text-sm rounded-l-md border-transparent bg-white/20 backdrop-blur-sm text-white placeholder-white/50 flex-grow focus:outline-none"
                />
                <Button 
                  type="submit" 
                  className="rounded-l-none bg-white text-homa-blue hover:bg-white/90 px-4"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <Link href="/">
              <div className="mb-4 cursor-pointer">
                <HomaLogo size="md" />
              </div>
            </Link>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              Connecting travelers with their perfect destinations through personalized matching and expert guides.
            </p>
            
            {/* Contact Information */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-white/90">
                <Mail className="h-4 w-4 mr-2 text-white" />
                <span>contact@homatravel.co</span>
              </div>
              <div className="flex items-center text-sm text-white/90">
                <Phone className="h-4 w-4 mr-2 text-white" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
            
            {/* Social Media Links */}
            <div className="flex space-x-2">
              <a href="https://facebook.com" className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors" target="_blank" rel="noopener noreferrer">
                <Facebook size={14} />
              </a>
              <a href="https://twitter.com" className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors" target="_blank" rel="noopener noreferrer">
                <Twitter size={14} />
              </a>
              <a href="https://instagram.com" className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors" target="_blank" rel="noopener noreferrer">
                <Instagram size={14} />
              </a>
              <a href="https://linkedin.com" className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors" target="_blank" rel="noopener noreferrer">
                <Linkedin size={14} />
              </a>
            </div>
          </div>
          
          {/* Destinations */}
          <div>
            <h4 className="text-sm font-medium text-white mb-4 flex items-center">
              <Globe className="h-4 w-4 mr-2 text-white/80" />
              Destinations
            </h4>
            <ul className="space-y-2 pl-6 border-l border-white/20">
              <li><Link href="/destinations?continent=Europe" className="text-sm text-white/80 hover:text-white transition-colors">Europe</Link></li>
              <li><Link href="/destinations?continent=Asia" className="text-sm text-white/80 hover:text-white transition-colors">Asia</Link></li>
              <li><Link href="/destinations?continent=Africa" className="text-sm text-white/80 hover:text-white transition-colors">Africa</Link></li>
              <li><Link href="/destinations?continent=North America" className="text-sm text-white/80 hover:text-white transition-colors">North America</Link></li>
              <li><Link href="/destinations?continent=South America" className="text-sm text-white/80 hover:text-white transition-colors">South America</Link></li>
              <li><Link href="/destinations?continent=Oceania" className="text-sm text-white/80 hover:text-white transition-colors">Oceania</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="text-sm font-medium text-white mb-4 flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-white/80" />
              Resources
            </h4>
            <ul className="space-y-2 pl-6 border-l border-white/20">
              <li><Link href="/shop" className="text-sm text-white/80 hover:text-white transition-colors">Travel Guides</Link></li>
              <li><Link href="/blog" className="text-sm text-white/80 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/destination-matcher" className="text-sm text-white/80 hover:text-white transition-colors">Destination Matcher</Link></li>
              <li><Link href="/shop" className="text-sm text-white/80 hover:text-white transition-colors">Digital Products</Link></li>
              <li><Link href="/blog?tag=Tips" className="text-sm text-white/80 hover:text-white transition-colors">Travel Tips</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="text-sm font-medium text-white mb-4 flex items-center">
              <Info className="h-4 w-4 mr-2 text-white/80" />
              Company
            </h4>
            <ul className="space-y-2 pl-6 border-l border-white/20">
              <li><Link href="/about" className="text-sm text-white/80 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-white/80 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="text-sm text-white/80 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/privacy" className="text-sm text-white/80 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-white/80 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright and Legal Links */}
        <div className="border-t border-white/20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/70 text-xs mb-4 md:mb-0">© 2024 Homa Travel Co. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-xs text-white/70 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-xs text-white/70 hover:text-white transition-colors">Terms</Link>
              <Link href="/cookies" className="text-xs text-white/70 hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
