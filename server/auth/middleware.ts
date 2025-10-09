import { Request, Response, NextFunction } from 'express';

// Check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// Check if user has admin role
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user && (req.user as any).role === 'admin') {
    return next();
  }
  res.status(403).json({ error: 'Forbidden' });
};

// Rate limiting middleware for auth routes
export const rateLimit = (windowMs: number, maxRequests: number) => {
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    
    // Clean up expired entries
    if (requests.has(ip)) {
      const request = requests.get(ip)!;
      if (now > request.resetTime) {
        requests.delete(ip);
      }
    }
    
    // Check if IP exists in map
    if (!requests.has(ip)) {
      requests.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }
    
    // Increment request count
    const request = requests.get(ip)!;
    if (request.count >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests, please try again later',
      });
    }
    
    request.count++;
    return next();
  };
};