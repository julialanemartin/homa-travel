import { BlogPost, Product, Destination, Testimonial } from '@/lib/types';
import { InsertBlogPost, InsertProduct, InsertDestination, InsertTestimonial } from '@shared/schema';

// Helper function to handle API requests with token authentication
export async function adminRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any,
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const options: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined
  };

  const response = await fetch(endpoint, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  
  // For DELETE requests that return 204 No Content
  if (response.status === 204) {
    return {} as T;
  }
  
  return await response.json();
}

// Blog Posts API
export const blogPostsApi = {
  create: (token: string, blogPost: InsertBlogPost): Promise<BlogPost> => 
    adminRequest<BlogPost>('POST', '/api/admin/blog-posts', blogPost, token),
    
  update: (token: string, id: number, blogPost: InsertBlogPost): Promise<BlogPost> => 
    adminRequest<BlogPost>('PUT', `/api/admin/blog-posts/${id}`, blogPost, token),
    
  delete: (token: string, id: number): Promise<void> => 
    adminRequest<void>('DELETE', `/api/admin/blog-posts/${id}`, null, token)
};

// Products API
export const productsApi = {
  create: (token: string, product: InsertProduct): Promise<Product> => 
    adminRequest<Product>('POST', '/api/admin/products', product, token),
    
  update: (token: string, id: number, product: InsertProduct): Promise<Product> => 
    adminRequest<Product>('PUT', `/api/admin/products/${id}`, product, token),
    
  delete: (token: string, id: number): Promise<void> => 
    adminRequest<void>('DELETE', `/api/admin/products/${id}`, null, token)
};

// Destinations API
export const destinationsApi = {
  create: (token: string, destination: InsertDestination): Promise<Destination> => 
    adminRequest<Destination>('POST', '/api/admin/destinations', destination, token),
    
  update: (token: string, id: number, destination: InsertDestination): Promise<Destination> => 
    adminRequest<Destination>('PUT', `/api/admin/destinations/${id}`, destination, token),
    
  delete: (token: string, id: number): Promise<void> => 
    adminRequest<void>('DELETE', `/api/admin/destinations/${id}`, null, token)
};

// Testimonials API
export const testimonialsApi = {
  create: (token: string, testimonial: InsertTestimonial): Promise<Testimonial> => 
    adminRequest<Testimonial>('POST', '/api/admin/testimonials', testimonial, token),
    
  delete: (token: string, id: number): Promise<void> => 
    adminRequest<void>('DELETE', `/api/admin/testimonials/${id}`, null, token)
};