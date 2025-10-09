import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { db } from '../db/index.js';
import { users, passwordResetTokens } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { isAuthenticated, rateLimit } from './middleware.js'; 

const router = express.Router();

// Apply rate limiting to auth routes
const authRateLimit = rateLimit(15 * 60 * 1000, 10); // 10 requests per 15 minutes

// Signup route
router.post('/signup', authRateLimit, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = await db.insert(users).values({
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
    }).returning({ id: users.id, email: users.email, role: users.role });
    
    // Log in the user
    req.login(newUser[0], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to login after signup' });
      }
      return res.status(201).json(newUser[0]);
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Login route
router.post('/login', authRateLimit, (req, res, next) => {
  passport.authenticate('local', (err: any, user: any, info: any) => {
    if (err) {
      return res.status(500).json({ error: 'Authentication error' });
    }
    
    if (!user) {
      return res.status(401).json({ error: info?.message || 'Invalid credentials' });
    }
    
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to login' });
      }
      return res.json(user);
    });
  })(req, res, next);
});

// Logout route
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.json({ success: true });
  });
});

// Get current user
router.get('/me', isAuthenticated, (req, res) => {
  res.json(req.user);
});

// Request password reset
router.post('/forgot-password', authRateLimit, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Find user by email
    const userResults = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    
    if (userResults.length === 0) {
      // Don't reveal that the email doesn't exist
      return res.json({ message: 'If your email is registered, you will receive a password reset link' });
    }
    
    const user = userResults[0];
    
    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(token, 10);
    
    // Set expiry to 1 hour from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    
    // Delete any existing tokens for this user
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, user.id));
    
    // Create new token
    await db.insert(passwordResetTokens).values({
      userId: user.id,
      token: hashedToken,
      expiresAt,
      used: false,
    });
    
    // In a real application, send an email with the reset link
    // For now, just log it to the console
    console.log(`Password reset link: /reset-password?token=${token}&email=${encodeURIComponent(email)}`);
    
    res.json({ message: 'If your email is registered, you will receive a password reset link' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// Reset password
router.post('/reset-password', authRateLimit, async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    
    if (!email || !token || !newPassword) {
      return res.status(400).json({ error: 'Email, token, and new password are required' });
    }
    
    // Find user by email
    const userResults = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    
    if (userResults.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    
    const user = userResults[0];
    
    // Find valid token
    const tokenResults = await db.select().from(passwordResetTokens).where(
      and(
        eq(passwordResetTokens.userId, user.id),
        eq(passwordResetTokens.used, false)
      )
    );
    
    if (tokenResults.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    
    const resetToken = tokenResults[0];
    
    // Check if token is expired
    if (new Date() > resetToken.expiresAt) {
      return res.status(400).json({ error: 'Token has expired' });
    }
    
    // Verify token
    const isTokenValid = await bcrypt.compare(token, resetToken.token);
    
    if (!isTokenValid) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user password
    await db.update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, user.id));
    
    // Mark token as used
    await db.update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.id, resetToken.id));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

export default router;