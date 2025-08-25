import React from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Product as ProductType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/providers/CartProvider';
import { Helmet } from 'react-helmet';
import { Star, StarHalf, ArrowLeft, ShoppingBag, Eye, Download, Check } from 'lucide-react';

export default function Product() {
  // Get product ID from URL
  const [match, params] = useRoute('/shop/:id');
  const id = match ? Number(params.id) : null;

  // Fetch product
  const { data: product, isLoading, error } = useQuery<ProductType>({
    queryKey: [`/api/products/${id}`],
    enabled: !!id,
  });

  // Cart functionality
  const { addToCart, cartItems, isLoading: cartLoading } = useCart();
  
  // Check if product is already in cart
  const isInCart = React.useMemo(() => {
    if (!product || !cartItems.length) return false;
    return cartItems.some(item => item.productId === product.id);
  }, [product, cartItems]);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Render stars for rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-accent text-accent" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-accent text-accent" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-accent" />);
    }
    
    return stars;
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product || isInCart) return;
    await addToCart(product);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-10 bg-gray-200 rounded mt-6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center p-8 bg-red-50 rounded-lg text-red-500">
          <h2 className="text-2xl font-semibold mb-4">Error Loading Product</h2>
          <p className="mb-6">We couldn't load this product. It may have been removed or there might be a temporary issue.</p>
          <Button asChild>
            <Link href="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.title} | Homa Travel Co. Shop</title>
        <meta name="description" content={product.description} />
      </Helmet>
      
      <div className="bg-neutral-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Back to shop link */}
            <Link href="/shop">
              <Button variant="ghost" className="mb-6 pl-0 hover:pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
              </Button>
            </Link>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Product Image */}
                <div className="relative h-96 overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Product Details */}
                <div className="p-8">
                  <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">{product.title}</h1>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-neutral-600">({product.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="text-2xl font-bold text-secondary mb-6">
                    {formatPrice(product.price)}
                  </div>
                  
                  <p className="text-neutral-600 mb-8">{product.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-accent mr-2" />
                      <span>Digital product - Instant download after purchase</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-accent mr-2" />
                      <span>Comprehensive guide with insider tips</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-accent mr-2" />
                      <span>PDF format compatible with all devices</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button
                      onClick={handleAddToCart}
                      disabled={isInCart || cartLoading}
                      className="flex-grow"
                    >
                      {isInCart ? (
                        <>
                          <Check className="mr-2 h-4 w-4" /> Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                        </>
                      )}
                    </Button>
                    
                    <Button variant="outline" onClick={() => window.open(product.previewUrl, '_blank')}>
                      <Eye className="mr-2 h-4 w-4" /> Preview
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Details */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-heading font-semibold mb-4">What's Inside</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Download className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <span className="font-medium">Digital Download</span>
                      <p className="text-sm text-neutral-600">PDF format, optimized for all devices</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Download className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <span className="font-medium">Detailed Itineraries</span>
                      <p className="text-sm text-neutral-600">Day-by-day plans for different trip lengths</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Download className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <span className="font-medium">Local Recommendations</span>
                      <p className="text-sm text-neutral-600">Hidden gems and authentic experiences</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Download className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <span className="font-medium">Practical Tips</span>
                      <p className="text-sm text-neutral-600">Transportation, accommodation, and safety advice</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-heading font-semibold mb-4">Customer Reviews</h2>
                <div className="flex items-center mb-4">
                  <div className="mr-2">
                    <span className="text-3xl font-bold">{product.rating.toFixed(1)}</span>
                  </div>
                  <div>
                    <div className="flex">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-neutral-600">Based on {product.reviewCount} reviews</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="text-neutral-600 text-sm italic">
                    "This guide was worth every penny! So many hidden gems that weren't in any other guide I found." - Recent Customer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
