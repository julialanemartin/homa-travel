import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Newsletter from '@/components/home/Newsletter';
import { Users, Globe, Heart, Compass, MapPin, Mail, Phone, MapPinned } from 'lucide-react';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Homa Travel Co. | Your Travel Companion</title>
        <meta name="description" content="Learn about Homa Travel Co., our mission, team, and how we help travelers find their perfect destinations." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="bg-[#2d8a9a] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">About Homa Travel Co.</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Connecting travelers with their perfect destinations through personalized matching, expert guides, and authentic stories.
          </p>
        </div>
      </section>
      
      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-heading font-bold mb-6">Our Mission</h2>
              <p className="text-neutral-600 mb-4">
                At Homa Travel Co., we believe that travel has the power to transform lives, broaden perspectives, and create meaningful connections. Our mission is to make personalized travel discovery accessible to everyone.
              </p>
              <p className="text-neutral-600 mb-6">
                We're passionate about helping travelers find destinations that truly resonate with their unique preferences, interests, and travel styles. By combining technology with human expertise, we create tools and resources that make travel planning more intuitive and personalized.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <Link href="/destination-matcher">Try Our Destination Matcher</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/blog">Explore Our Blog</Link>
                </Button>
              </div>
            </div>
            <div className="order-1 md:order-2 rounded-xl overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1454942901704-3c44c11b2ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Travel exploration" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-4">Authentic Exploration</h3>
              <p className="text-neutral-600">
                We promote meaningful travel that respects local cultures and environments, fostering genuine connections with places and people.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-secondary h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-4">Community Focus</h3>
              <p className="text-neutral-600">
                We build tools and resources that bring travelers together, allowing them to share experiences and support each other's journeys.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-accent h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-4">Personalized Experience</h3>
              <p className="text-neutral-600">
                We believe no two travelers are the same, and we're committed to helping each person find their perfect travel match.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-4">Meet Our Team</h2>
          <p className="text-neutral-600 text-center max-w-3xl mx-auto mb-12">
            Our diverse team of travel enthusiasts, tech experts, and content creators work together to bring you the best travel resources.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                  alt="Sarah Thompson" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-1">Sarah Thompson</h3>
              <p className="text-primary mb-2">Founder & CEO</p>
              <p className="text-neutral-600 text-sm">
                Travel enthusiast with a passion for connecting people with unforgettable destinations.
              </p>
            </div>
            
            {/* Team Member 2 */}
            <div className="text-center">
              <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                  alt="Alex Johnson" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-1">Alex Johnson</h3>
              <p className="text-primary mb-2">Head of Content</p>
              <p className="text-neutral-600 text-sm">
                Writer and photographer with a background in travel journalism and cultural research.
              </p>
            </div>
            
            {/* Team Member 3 */}
            <div className="text-center">
              <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                  alt="Maria Garcia" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-1">Maria Garcia</h3>
              <p className="text-primary mb-2">Destination Expert</p>
              <p className="text-neutral-600 text-sm">
                Culinary specialist and cultural guide with experience in over 40 countries.
              </p>
            </div>
            
            {/* Team Member 4 */}
            <div className="text-center">
              <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                  alt="David Kim" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-1">David Kim</h3>
              <p className="text-primary mb-2">Tech Lead</p>
              <p className="text-neutral-600 text-sm">
                Developer focused on creating intuitive tools that make travel planning seamless.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Our Resources */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-10">Our Travel Resources</h2>
          
          <Tabs defaultValue="matcher" className="max-w-4xl mx-auto">
            <TabsList className="w-full justify-center mb-8">
              <TabsTrigger value="matcher">Destination Matcher</TabsTrigger>
              <TabsTrigger value="guides">Travel Guides</TabsTrigger>
              <TabsTrigger value="blog">Travel Blog</TabsTrigger>
            </TabsList>
            
            <TabsContent value="matcher" className="mt-0">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/3 flex justify-center">
                    <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center">
                      <Compass className="text-primary h-12 w-12" />
                    </div>
                  </div>
                  <div className="w-full md:w-2/3">
                    <h3 className="text-xl font-heading font-semibold mb-4">Destination Matcher Quiz</h3>
                    <p className="text-neutral-600 mb-6">
                      Our signature quiz uses a sophisticated algorithm to match your travel preferences, interests, and style with destinations around the world. By analyzing your responses to key questions, we can recommend places that align with your unique travel personality.
                    </p>
                    <Button asChild>
                      <Link href="/destination-matcher">Try the Quiz</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="guides" className="mt-0">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/3 flex justify-center">
                    <div className="bg-secondary/10 w-24 h-24 rounded-full flex items-center justify-center">
                      <MapPin className="text-secondary h-12 w-12" />
                    </div>
                  </div>
                  <div className="w-full md:w-2/3">
                    <h3 className="text-xl font-heading font-semibold mb-4">Comprehensive Travel Guides</h3>
                    <p className="text-neutral-600 mb-6">
                      Our digital travel guides are meticulously researched by experts who have extensive experience in each destination. Packed with insider tips, hidden gems, and practical advice, these guides help you plan the perfect trip with confidence.
                    </p>
                    <Button asChild>
                      <Link href="/shop">Browse Guides</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="blog" className="mt-0">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/3 flex justify-center">
                    <div className="bg-accent/10 w-24 h-24 rounded-full flex items-center justify-center">
                      <Globe className="text-accent h-12 w-12" />
                    </div>
                  </div>
                  <div className="w-full md:w-2/3">
                    <h3 className="text-xl font-heading font-semibold mb-4">Travel Inspiration Blog</h3>
                    <p className="text-neutral-600 mb-6">
                      Our blog features stories, tips, and insights from experienced travelers and local experts. From destination guides and travel hacks to cultural deep dives and food recommendations, our articles aim to inspire and inform your next adventure.
                    </p>
                    <Button asChild>
                      <Link href="/blog">Read Articles</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center mb-4">Get in Touch</h2>
            <p className="text-neutral-600 text-center mb-12">
              Have questions or feedback? We'd love to hear from you!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-neutral-100 rounded-xl p-8">
                <h3 className="text-xl font-heading font-semibold mb-6">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-primary mr-3" />
                    <span>hello@homatravel.co</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-primary mr-3" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPinned className="h-5 w-5 text-primary mr-3" />
                    <span>123 Travel Lane, Adventure City, EX 12345</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-medium mb-3">Follow Us</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-neutral-200 hover:bg-primary hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                      <span className="sr-only">Facebook</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                    </a>
                    <a href="#" className="bg-neutral-200 hover:bg-primary hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                      <span className="sr-only">Instagram</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                    </a>
                    <a href="#" className="bg-neutral-200 hover:bg-primary hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-100 rounded-xl p-8">
                <h3 className="text-xl font-heading font-semibold mb-6">Send Us a Message</h3>
                
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                    <textarea 
                      id="message" 
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary" 
                    ></textarea>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <Newsletter />
    </>
  );
}
