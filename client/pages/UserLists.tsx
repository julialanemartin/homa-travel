import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Edit, Trash2, Plus, List, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

// For now, hardcode the userId as 2 (user1). In a real app, this would come from auth context
const DEFAULT_USER_ID = 2;

export default function UserLists() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // Fetch user's destination lists
  const { 
    data: userLists = [], 
    isLoading: listsLoading, 
    error: listsError 
  } = useQuery({
    queryKey: ['/api/user-destination-lists', DEFAULT_USER_ID],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/user-destination-lists/${DEFAULT_USER_ID}`);
      return await response.json();
    }
  });

  // Create new list mutation
  const createListMutation = useMutation({
    mutationFn: async (newList: { 
      name: string; 
      description: string; 
      userId: number;
      isPublic: boolean;
    }) => {
      const response = await apiRequest('POST', '/api/user-destination-lists', newList);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-destination-lists', DEFAULT_USER_ID] });
      toast({
        title: "Success!",
        description: "Your new list has been created.",
      });
      setIsCreateDialogOpen(false);
      setNewListName('');
      setNewListDescription('');
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating list",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete list mutation
  const deleteListMutation = useMutation({
    mutationFn: async (listId: number) => {
      await apiRequest('DELETE', `/api/user-destination-lists/${listId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-destination-lists', DEFAULT_USER_ID] });
      toast({
        title: "Success!",
        description: "The list has been deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting list",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a list name.",
        variant: "destructive",
      });
      return;
    }

    createListMutation.mutate({
      name: newListName,
      description: newListDescription,
      userId: DEFAULT_USER_ID,
      isPublic: isPublic
    });
  };

  const handleDeleteList = (listId: number) => {
    if (confirm("Are you sure you want to delete this list?")) {
      deleteListMutation.mutate(listId);
    }
  };

  if (listsLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">My Travel Lists</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (listsError) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">My Travel Lists</h1>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading your travel lists. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Travel Lists</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create New List
        </Button>
      </div>

      {userLists.length === 0 ? (
        <div className="bg-muted p-8 rounded-lg text-center">
          <List className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Travel Lists Yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first list to start saving destinations you want to visit.
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Create Your First List
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userLists.map((list: any) => (
            <Card key={list.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{list.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteList(list.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Link href={`/user-lists/edit/${list.id}`}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                  {list.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 text-sm mb-4">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {list._count?.items || 0} destinations
                  </span>
                  <Badge 
                    variant={list.isPublic ? "default" : "outline"}
                    className="ml-auto"
                  >
                    {list.isPublic ? "Public" : "Private"}
                  </Badge>
                </div>
                <Separator className="my-2" />
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => setLocation(`/user-lists/${list.id}`)}
                >
                  View Destinations
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create new list dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Travel List</DialogTitle>
            <DialogDescription>
              Create a new list to organize destinations you want to visit.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateList}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  List Name
                </label>
                <Input
                  id="name"
                  placeholder="e.g., Summer Vacation Ideas"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description (optional)
                </label>
                <Textarea
                  id="description"
                  placeholder="Add some details about this list..."
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  rows={3}
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
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createListMutation.isPending}
              >
                {createListMutation.isPending ? "Creating..." : "Create List"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}