import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { PlusCircle, X, Heart, Share2, Download, Pin, Info, Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Define types for our Mood Board data
interface MoodBoardPin {
  id: number;
  boardId: number;
  imageUrl: string;
  sourceUrl: string | null;
  title: string;
  description: string | null;
  location: string | null;
  tags: string[];
  color: string | null;
  pinned_at: string;
}

interface MoodBoard {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  pins?: MoodBoardPin[];
}

// Demo travel inspiration images - we'll keep these for the inspiration tab
const demoImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=500&h=800&fit=crop',
    title: 'Colorful buildings in Cinque Terre',
    location: 'Italy',
    tags: ['Europe', 'Coastal', 'Colorful']
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1506665531195-3566af98b43d?w=500&h=500&fit=crop',
    title: 'Bali rice terraces',
    location: 'Indonesia',
    tags: ['Asia', 'Nature', 'Tropical']
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1565310104425-8ef4dfc36f31?w=500&h=700&fit=crop',
    title: 'Sunset in Santorini',
    location: 'Greece',
    tags: ['Europe', 'Island', 'Sunset']
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&h=600&fit=crop', 
    title: 'Paris view with Eiffel Tower',
    location: 'France',
    tags: ['Europe', 'Urban', 'Iconic']
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1559628233-100c798642d4?w=500&h=650&fit=crop',
    title: 'Desert adventure in Morocco',
    location: 'Morocco',
    tags: ['Africa', 'Desert', 'Adventure']
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=500&h=750&fit=crop',
    title: 'Crystal clear waters in Maldives',
    location: 'Maldives',
    tags: ['Asia', 'Beach', 'Luxury']
  }
];

export default function MoodBoardDemo() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [currentBoard, setCurrentBoard] = useState<number | null>(null);
  const [pinnedImages, setPinnedImages] = useState<number[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [activeTab, setActiveTab] = useState('inspiration');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  
  // Fetch user's mood boards
  const { 
    data: moodBoards = [], 
    isLoading: isLoadingBoards,
    error: boardsError
  } = useQuery<MoodBoard[]>({
    queryKey: [`/api/mood-boards/user/${user?.id}`],
    enabled: !!user,
  });
  
  // Fetch a specific board's pins
  const {
    data: currentBoardPins = [],
    isLoading: isLoadingPins,
    error: pinsError
  } = useQuery<MoodBoardPin[]>({
    queryKey: ['/api/mood-board-pins', currentBoard],
    enabled: !!currentBoard,
  });
  
  // Create a new mood board
  const createBoardMutation = useMutation({
    mutationFn: async (boardData: { userId: number; name: string; description: string | null; isPublic: boolean }) => {
      const res = await apiRequest('POST', '/api/mood-boards', boardData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/mood-boards/user/${user?.id}`] });
      setShowCreateDialog(false);
      setNewBoardTitle('');
      setNewBoardDescription('');
      toast({
        title: "Success",
        description: "Your mood board has been created",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create mood board: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Create a new pin
  const createPinMutation = useMutation({
    mutationFn: async (pinData: any) => {
      const res = await apiRequest('POST', '/api/mood-board-pins', pinData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mood-board-pins', currentBoard] });
      setPinnedImages([]);
      toast({
        title: "Success",
        description: "Image pinned to your board",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to pin image: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Delete a pin
  const deletePinMutation = useMutation({
    mutationFn: async (pinId: number) => {
      const res = await apiRequest('DELETE', `/api/mood-board-pins/${pinId}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mood-board-pins', currentBoard] });
      toast({
        title: "Success",
        description: "Pin removed from your board",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete pin: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle pinning an image
  const handlePinImage = (imageId: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create and manage mood boards",
        variant: "destructive",
      });
      return;
    }
    
    if (currentBoard !== null) {
      // Pin directly to current board
      const image = demoImages.find(img => img.id === imageId);
      if (!image) return;
      
      createPinMutation.mutate({
        boardId: currentBoard,
        imageUrl: image.src,
        title: image.title,
        location: image.location,
        tags: image.tags,
        sourceUrl: null,
        description: null,
        color: null
      });
      
      setActiveTab('myBoards');
    } else {
      // Store temporarily until a board is selected
      if (!pinnedImages.includes(imageId)) {
        setPinnedImages([...pinnedImages, imageId]);
        setShowCreateDialog(true);
      }
    }
  };

  // Create a new mood board
  const handleCreateBoard = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create and manage mood boards",
        variant: "destructive",
      });
      return;
    }
    
    if (newBoardTitle.trim()) {
      // Create the board first
      createBoardMutation.mutate({
        userId: user.id,
        name: newBoardTitle,
        description: newBoardDescription || null,
        isPublic: false
      }, {
        onSuccess: (newBoard: MoodBoard) => {
          // Then add any pins if we have any
          if (pinnedImages.length > 0) {
            // Batch create pins for this new board
            pinnedImages.forEach(imageId => {
              const image = demoImages.find(img => img.id === imageId);
              if (!image) return;
              
              createPinMutation.mutate({
                boardId: newBoard.id,
                imageUrl: image.src,
                title: image.title,
                location: image.location,
                tags: image.tags,
                sourceUrl: null,
                description: null,
                color: null
              });
            });
          }
          
          // Invalidate the query to refresh the board list
          queryClient.invalidateQueries({ queryKey: [`/api/mood-boards/user/${user?.id}`] });
          
          setCurrentBoard(newBoard.id);
          setActiveTab('myBoards');
        }
      });
    }
  };

  // Remove a pin from a board
  const handleRemovePin = (pinId: number) => {
    if (confirm("Are you sure you want to remove this pin from your board?")) {
      deletePinMutation.mutate(pinId);
    }
  };

  // View all images in a specific board
  const viewBoard = (boardId: number) => {
    setCurrentBoard(boardId);
    setActiveTab('myBoards');
  };

  // Get board details by ID
  const getBoardById = (boardId: number) => {
    return moodBoards.find(b => b.id === boardId);
  };
  
  // Handle opening image details
  const openImageDetails = (image: any) => {
    setSelectedImage(image);
  };
  
  // Loading states
  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">Travel Mood Board Creator</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto mb-6">
            Collect and organize travel inspiration in beautiful mood boards.
            Pin images from our collection or add your own to create your perfect travel planning canvas.
          </p>
          <div className="p-8 border border-border rounded-lg shadow-sm bg-card">
            <p className="text-lg mb-4">Please log in to create and manage mood boards</p>
            <Link href="/auth">
              <Button className="bg-primary hover:bg-primary/90">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (isLoadingBoards) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p>Loading your mood boards...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Travel Mood Board Creator | Homa Travel Co.</title>
      </Helmet>

      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">Travel Mood Board Creator</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Collect and organize travel inspiration in beautiful mood boards. 
            Pin images from our collection or add your own to create your perfect travel planning canvas.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="inspiration">Travel Inspiration</TabsTrigger>
              <TabsTrigger value="myBoards">My Mood Boards</TabsTrigger>
            </TabsList>
            
            <Button onClick={() => {
              setPinnedImages([]);
              setShowCreateDialog(true);
            }} className="bg-primary hover:bg-primary/90">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Board
            </Button>
          </div>

          {/* Travel Inspiration Tab */}
          <TabsContent value="inspiration" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
              {demoImages.map((image) => (
                <div key={image.id} className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  <img 
                    src={image.src} 
                    alt={image.title} 
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-medium text-lg">{image.title}</h3>
                      <p className="text-sm text-white/80">{image.location}</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-8 w-8 rounded-full bg-white text-primary shadow-md hover:bg-white/90"
                      onClick={() => handlePinImage(image.id)}
                    >
                      <Pin className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-8 w-8 rounded-full bg-white text-neutral-700 shadow-md hover:bg-white/90"
                      onClick={() => openImageDetails(image)}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* My Mood Boards Tab */}
          <TabsContent value="myBoards" className="mt-6 space-y-8">
            {currentBoard === null ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {moodBoards.length === 0 ? (
                  <div className="col-span-3 p-8 border border-border rounded-lg shadow-sm text-center">
                    <h3 className="text-lg font-medium mb-2">No mood boards yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first mood board to start collecting travel inspiration</p>
                    <Button 
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => setShowCreateDialog(true)}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create New Board
                    </Button>
                  </div>
                ) : (
                  moodBoards.map((board) => (
                    <Card key={board.id} className="overflow-hidden group cursor-pointer" onClick={() => viewBoard(board.id)}>
                      <div className="relative">
                        <img 
                          src={board.coverImageUrl || 'https://placehold.co/600x400/2d8a9a/white?text=No+Cover+Image'} 
                          alt={board.name}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="font-medium text-lg text-white">{board.name}</h3>
                          <p className="text-sm text-white/80">
                            Created {new Date(board.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {isLoadingPins ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setCurrentBoard(null)}
                        >
                          Back to all boards
                        </Button>
                        <h2 className="text-2xl font-bold">
                          {getBoardById(currentBoard)?.name || "Board"}
                        </h2>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export PDF
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentBoardPins.length === 0 ? (
                        <div className="col-span-3 p-8 border border-border rounded-lg shadow-sm text-center">
                          <h3 className="text-lg font-medium mb-2">No pins in this board yet</h3>
                          <p className="text-muted-foreground mb-4">Add images from the Travel Inspiration tab</p>
                          <Button 
                            className="bg-primary hover:bg-primary/90"
                            onClick={() => setActiveTab("inspiration")}
                          >
                            Browse Inspiration
                          </Button>
                        </div>
                      ) : (
                        currentBoardPins.map((pin) => (
                          <div key={pin.id} className="relative group rounded-lg overflow-hidden shadow-md">
                            <img 
                              src={pin.imageUrl} 
                              alt={pin.title} 
                              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                <h3 className="font-medium text-lg">{pin.title}</h3>
                                {pin.location && <p className="text-sm text-white/80">{pin.location}</p>}
                              </div>
                            </div>
                            <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Button 
                                size="icon" 
                                variant="destructive" 
                                className="h-8 w-8 rounded-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemovePin(pin.id);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="secondary" 
                                className="h-8 w-8 rounded-full"
                                onClick={() => openImageDetails({
                                  id: pin.id,
                                  title: pin.title,
                                  src: pin.imageUrl,
                                  location: pin.location || '',
                                  tags: pin.tags || []
                                })}
                              >
                                <Info className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Create New Board Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Mood Board</DialogTitle>
              <DialogDescription>
                Create a custom mood board to collect and organize your travel inspiration.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Board Name</Label>
                <Input 
                  id="name" 
                  value={newBoardTitle} 
                  onChange={(e) => setNewBoardTitle(e.target.value)} 
                  placeholder="e.g., Dream Destinations" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input 
                  id="description" 
                  value={newBoardDescription} 
                  onChange={(e) => setNewBoardDescription(e.target.value)} 
                  placeholder="Short description of your travel board" 
                />
              </div>
              
              {pinnedImages.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {pinnedImages.length} image{pinnedImages.length > 1 ? 's' : ''} will be added to this board
                  </p>
                  <div className="flex overflow-x-auto space-x-2 pb-2">
                    {pinnedImages.map(pinId => {
                      const image = demoImages.find(img => img.id === pinId);
                      return image ? (
                        <div key={image.id} className="relative flex-shrink-0 w-16 h-16 rounded overflow-hidden">
                          <img src={image.src} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCreateDialog(false);
                  setPinnedImages([]);
                }}
                disabled={createBoardMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateBoard} 
                className="bg-primary hover:bg-primary/90"
                disabled={!newBoardTitle.trim() || createBoardMutation.isPending}
              >
                {createBoardMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : "Create Board"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Image Details Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
          {selectedImage && (
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{selectedImage.title}</DialogTitle>
                <DialogDescription>
                  {selectedImage.location}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={selectedImage.src} 
                    alt={selectedImage.title} 
                    className="w-full h-auto" 
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedImage.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={() => handlePinImage(selectedImage.id)}>
                    <Pin className="h-4 w-4 mr-2" />
                    Pin to Board
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </>
  );
}