export interface Destination {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  country: string;
  continent: string;
  rating: number;
  tags: string[];
  features: {
    bestSeasons: string[];
    activities: string[];
    budget: string;
  };
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  authorId: number;
  authorName: string;
  authorImageUrl: string;
  publishedAt: string;
  tags: string[];
  featured: boolean;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  previewUrl: string;
  digitalFileUrl: string;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  addedAt: string;
  product?: Product;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  category: string;
}

export interface QuizOption {
  id: string;
  text: string;
  icon: string;
  description: string;
}

export interface QuizResponse {
  userId: number;
  responses: Record<string, string>;
}

export interface MatchedDestination {
  id: number;
  score: number;
  destination?: Destination;
}

export interface QuizResult {
  id: number;
  userId: number;
  responses: Record<string, string>;
  matchedDestinations: MatchedDestination[];
  createdAt: string;
}

export interface Testimonial {
  id: number;
  userId?: number;
  name: string;
  imageUrl: string;
  content: string;
  rating: number;
  destination?: string;
  productId?: number;
  createdAt: string;
}

export interface Subscriber {
  name: string;
  email: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  preferences?: Record<string, any>;
}
