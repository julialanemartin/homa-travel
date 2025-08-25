import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useParams, useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Edit, Trash2, ArrowLeft, MapPin, Star, Clock, Phone, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function UserListDetail() {
  const params = useParams<{ id: string }>();
  const listId = parseInt(params.id);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeItem, setActiveItem] = useState<any>(null);
  const [isEditNotesOpen, setIsEditNotesOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  // Fetch user's list
  const { 
    data: list, 
    isLoading: listLoading, 
    error: listError 
  } = useQuery({
    queryKey: ['/api/user-destination-lists/list', listId],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/user-destination-lists/list/${listId}`);
      return await response.json();
    }
  });

  // Fetch list items with destinations
  const { 
    data: listItems = [], 
    isLoading: itemsLoading, 
    error: itemsError 
  } = useQuery({
    queryKey: ['/api/user-list-items', listId],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/user-list-items/${listId}`);
      return await response.json();
    }
  });

  // Update item notes mutation
  const updateNotesMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number, notes: string }) => {
      const response = await apiRequest('PATCH', `/api/user-list-items/${id}/notes`, { notes });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-list-items', listId] });
      toast({
        title: "Success!",
        description: "Notes updated successfully.",
      });
      setIsEditNotesOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating notes",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Remove item from list mutation
  const removeItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      await apiRequest('DELETE', `/api/user-list-items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-list-items', listId] });
      toast({
        title: "Success!",
        description: "Destination removed from list.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error removing destination",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleEditNotes = (item: any) => {
    setActiveItem(item);
    setNoteText(item.notes || '');
    setIsEditNotesOpen(true);
  };

  const saveNotes = () => {
    if (!activeItem) return;
    updateNotesMutation.mutate({ id: activeItem.id, notes: noteText });
  };

  const handleRemoveItem = (itemId: number) => {
    if (confirm("Are you sure you want to remove this destination from your list?")) {
      removeItemMutation.mutate(itemId);
    }
  };

  const isLoading = listLoading || itemsLoading;
  const error = listError || itemsError;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" onClick={() => setLocation('/user-lists')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Lists
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
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" onClick={() => setLocation('/user-lists')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Lists
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{list.name}</h1>
          {list.description && (
            <p className="text-gray-600 mt-2">{list.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={list.isPublic ? "default" : "outline"}>
              {list.isPublic ? "Public" : "Private"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {listItems.length} destination{listItems.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/user-lists/edit/${list.id}`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" /> Edit List
            </Button>
          </Link>
          <Link href={`/local-destinations?add-to-list=${list.id}`}>
            <Button>
              Add Destinations
            </Button>
          </Link>
        </div>
      </div>

      {listItems.length === 0 ? (
        <div className="bg-muted p-8 rounded-lg text-center">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Destinations Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start adding destinations to your list.
          </p>
          <Link href={`/local-destinations?add-to-list=${list.id}`}>
            <Button>Browse Destinations</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listItems.map((item: any) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={item.destination.imageUrl} 
                  alt={item.destination.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <Badge className="mb-2">
                    {item.destination.category}
                  </Badge>
                  <h3 className="text-lg font-bold">{item.destination.name}</h3>
                  <div className="flex items-center text-sm mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {item.destination.city}, {item.destination.state}
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.destination.tags.map((tag: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">
                      {item.destination.rating} 
                      {item.destination.ratingCount && (
                        <span className="text-muted-foreground font-normal">
                          {' '}({item.destination.ratingCount})
                        </span>
                      )}
                    </span>
                  </div>
                  {item.destination.priceLevel && (
                    <div className="text-sm font-medium">
                      {'$'.repeat(item.destination.priceLevel)}
                    </div>
                  )}
                </div>

                {item.notes && (
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-medium flex items-center">
                        <Info className="h-3 w-3 mr-1" /> Your Notes
                      </h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2"
                        onClick={() => handleEditNotes(item)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.notes}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Link href={`/local-destinations/${item.destination.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
                <div className="flex gap-2">
                  {!item.notes && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditNotes(item)}
                    >
                      Add Notes
                    </Button>
                  )}
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Notes Dialog */}
      <Dialog open={isEditNotesOpen} onOpenChange={setIsEditNotesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {activeItem?.notes ? 'Edit Notes' : 'Add Notes'}
            </DialogTitle>
            <DialogDescription>
              {activeItem?.destination?.name && (
                <span>For: {activeItem.destination.name}</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Add your notes about this destination..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditNotesOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={saveNotes}
              disabled={updateNotesMutation.isPending}
            >
              {updateNotesMutation.isPending ? 'Saving...' : 'Save Notes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}