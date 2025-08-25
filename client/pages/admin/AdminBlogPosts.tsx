import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { adminRequest, blogPostsApi } from '@/lib/adminApi';
import { BlogPost, InsertBlogPost } from '@shared/schema';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  FileText, 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  Loader2, 
  Check, 
  X, 
  FilePlus2 
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';

// Default empty blog post 
const defaultBlogPost: InsertBlogPost = {
  title: '',
  content: '',
  imageUrl: '',
  authorId: 1, // Default to current admin user
  authorName: 'Admin',
  tags: [],
  featured: false,
  publishedAt: new Date(),
  authorImageUrl: null,
};

export default function AdminBlogPosts() {
  const { token } = useAdminAuth();
  const { toast } = useToast();

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  
  // For adding/editing blog posts
  const [currentPost, setCurrentPost] = useState<InsertBlogPost>(defaultBlogPost);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  // Load blog posts on mount
  useEffect(() => {
    loadBlogPosts();
  }, [token]);

  const loadBlogPosts = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await adminRequest<BlogPost[]>('GET', '/api/blog-posts', null);
      setBlogPosts(response || []);
    } catch (err: any) {
      console.error('Error loading blog posts:', err);
      setError('Failed to load blog posts');
      toast({
        title: 'Error',
        description: 'Failed to load blog posts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingId(post.id);
    
    // Convert the post to a form-compatible object
    setCurrentPost({
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl || '',
      authorId: post.authorId || 1,
      authorName: post.authorName || 'Admin',
      authorImageUrl: post.authorImageUrl,
      tags: post.tags || [],
      featured: post.featured || false,
      publishedAt: new Date(post.publishedAt),
    });
    
    setActiveTab('edit');
  };

  const handleNewPost = () => {
    setEditingId(null);
    setCurrentPost(defaultBlogPost);
    setActiveTab('edit');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setCurrentPost(prev => ({ ...prev, featured: checked }));
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    // Don't add duplicate tags
    if (currentPost.tags.includes(tagInput.trim())) {
      toast({
        title: 'Duplicate tag',
        description: 'This tag already exists',
        variant: 'destructive',
      });
      return;
    }
    
    setCurrentPost(prev => ({ 
      ...prev, 
      tags: [...prev.tags, tagInput.trim()] 
    }));
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setCurrentPost(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!currentPost.title || !currentPost.content || !currentPost.imageUrl) {
        throw new Error('Title, content, and image URL are required');
      }

      let savedPost: BlogPost;
      
      if (editingId) {
        // Update existing post
        savedPost = await blogPostsApi.update(token, editingId, currentPost);
        toast({
          title: 'Success',
          description: 'Blog post updated successfully',
        });
      } else {
        // Create new post
        savedPost = await blogPostsApi.create(token, currentPost);
        toast({
          title: 'Success',
          description: 'Blog post created successfully',
        });
      }

      // Refresh the blog post list and reset form
      await loadBlogPosts();
      setActiveTab('list');
      setCurrentPost(defaultBlogPost);
      setEditingId(null);
    } catch (err: any) {
      console.error('Error saving blog post:', err);
      setError(err.message || 'Failed to save blog post');
      toast({
        title: 'Error',
        description: err.message || 'Failed to save blog post',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!token || !window.confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await adminRequest('DELETE', `/api/admin/blog-posts/${id}`, null, token);
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
      });
      await loadBlogPosts();
    } catch (err: any) {
      console.error('Error deleting blog post:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete blog post',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Blog Posts | Homa Travel Co. Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Blog Posts Management</h1>
            <p className="text-neutral-500">Create and manage your blog content</p>
          </div>
          
          <Button onClick={handleNewPost} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" /> New Blog Post
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="list">All Blog Posts</TabsTrigger>
            <TabsTrigger value="edit">
              {editingId ? 'Edit Blog Post' : 'New Blog Post'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            {isLoading ? (
              <div className="flex justify-center my-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-8">
                <FilePlus2 className="mx-auto h-12 w-12 text-neutral-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">No blog posts yet</h3>
                <p className="text-neutral-500 mb-4">
                  Create your first blog post to get started
                </p>
                <Button onClick={handleNewPost}>
                  <Plus className="mr-2 h-4 w-4" /> Create Blog Post
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {blogPosts.map(post => (
                  <Card key={post.id} className="overflow-hidden">
                    {post.imageUrl && (
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                        {post.featured && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex-shrink-0">
                            Featured
                          </span>
                        )}
                      </div>
                      <CardDescription>
                        {new Date(post.publishedAt).toLocaleDateString()}
                        {post.authorName && ` • By ${post.authorName}`}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {post.tags.map(tag => (
                            <span 
                              key={tag} 
                              className="bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-neutral-600 line-clamp-2 text-sm">
                        {post.content.substring(0, 100) + '...'}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="pt-2">
                      <div className="flex space-x-2 w-full">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEditPost(post)}
                        >
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="edit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  {editingId ? 'Edit Blog Post' : 'Create New Blog Post'}
                </CardTitle>
                <CardDescription>
                  {editingId 
                    ? 'Update your existing blog post content' 
                    : 'Add a new blog post to your website'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={currentPost.title}
                        onChange={handleInputChange}
                        placeholder="Enter blog post title"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="content">Content *</Label>
                      <Textarea
                        id="content"
                        name="content"
                        value={currentPost.content}
                        onChange={handleInputChange}
                        placeholder="Enter blog post content"
                        className="min-h-[200px]"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="authorName">Author Name *</Label>
                        <Input
                          id="authorName"
                          name="authorName"
                          value={currentPost.authorName}
                          onChange={handleInputChange}
                          placeholder="Author name"
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="imageUrl">Featured Image URL *</Label>
                        <Input
                          id="imageUrl"
                          name="imageUrl"
                          value={currentPost.imageUrl}
                          onChange={handleInputChange}
                          placeholder="https://example.com/image.jpg"
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="authorImageUrl">Author Image URL</Label>
                        <Input
                          id="authorImageUrl"
                          name="authorImageUrl"
                          value={currentPost.authorImageUrl || ''}
                          onChange={handleInputChange}
                          placeholder="https://example.com/author.jpg"
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="publishedAt">Publish Date</Label>
                        <Input
                          id="publishedAt"
                          name="publishedAt"
                          type="date"
                          value={new Date(currentPost.publishedAt).toISOString().slice(0, 10)}
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            setCurrentPost(prev => ({ ...prev, publishedAt: date }));
                          }}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={currentPost.featured || false}
                        onCheckedChange={handleSwitchChange}
                        disabled={isSubmitting}
                      />
                      <Label htmlFor="featured">Featured Post</Label>
                    </div>
                    
                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          id="tagInput"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="Add a tag"
                          disabled={isSubmitting}
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          onClick={handleAddTag}
                          disabled={!tagInput.trim() || isSubmitting}
                        >
                          Add
                        </Button>
                      </div>
                      
                      {currentPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {currentPost.tags.map(tag => (
                            <div 
                              key={tag}
                              className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-sm flex items-center"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 text-neutral-500 hover:text-red-500"
                                disabled={isSubmitting}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setActiveTab('list');
                        setCurrentPost(defaultBlogPost);
                        setEditingId(null);
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" /> 
                          {editingId ? 'Update' : 'Create'} Blog Post
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}