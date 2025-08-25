import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function UserListEdit() {
  const params = useParams<{ id: string }>();
  const listId = parseInt(params.id);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // Fetch list details
  const { 
    data: list, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['/api/user-destination-lists/list', listId],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/user-destination-lists/list/${listId}`);
      return await response.json();
    }
  });

  // Update list mutation
  const updateListMutation = useMutation({
    mutationFn: async (updatedList: { 
      name: string; 
      description: string; 
      isPublic: boolean;
    }) => {
      const response = await apiRequest('PUT', `/api/user-destination-lists/${listId}`, updatedList);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-destination-lists/list', listId] });
      queryClient.invalidateQueries({ queryKey: ['/api/user-destination-lists'] });
      toast({
        title: "Success!",
        description: "Your list has been updated.",
      });
      setLocation(`/user-lists/${listId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating list",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Initialize form with list data when loaded
  useEffect(() => {
    if (list) {
      setName(list.name);
      setDescription(list.description || '');
      setIsPublic(list.isPublic);
    }
  }, [list]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a list name.",
        variant: "destructive",
      });
      return;
    }

    updateListMutation.mutate({
      name,
      description,
      isPublic
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" onClick={() => setLocation(`/user-lists/${listId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to List
          </Button>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error || !list) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" onClick={() => setLocation('/user-lists')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Lists
          </Button>
        </div>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading list details. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" onClick={() => setLocation(`/user-lists/${listId}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to List
        </Button>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit List</h1>
        
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  List Name
                </label>
                <Input
                  id="name"
                  placeholder="e.g., Summer Vacation Ideas"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description (optional)
                </label>
                <Textarea
                  id="description"
                  placeholder="Add some details about this list..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  className="h-4 w-4"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                <label htmlFor="isPublic" className="text-sm">
                  Make this list public
                </label>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation(`/user-lists/${listId}`)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={updateListMutation.isPending}
                >
                  {updateListMutation.isPending ? (
                    <span className="flex items-center">
                      <div className="animate-spin w-4 h-4 border-2 border-background border-t-transparent rounded-full mr-2"></div>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}