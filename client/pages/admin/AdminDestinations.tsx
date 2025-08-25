import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Destination, InsertDestination } from '@shared/schema';
import { destinationsApi } from '@/lib/adminApi';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import DestinationForm from '@/components/admin/destinations/DestinationForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Loader2, 
  MapPin, 
  Globe, 
  Tag, 
  ArrowLeft 
} from 'lucide-react';
import { Link } from 'wouter';

export default function AdminDestinations() {
  const { token } = useAdminAuth();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  // Fetch destinations
  const { data: destinations, isLoading } = useQuery<Destination[]>({
    queryKey: ['/api/destinations'],
    queryFn: () => fetch('/api/destinations').then(res => res.json())
  });

  // Create destination mutation
  const createMutation = useMutation({
    mutationFn: (destination: InsertDestination) => {
      return destinationsApi.create(token!, destination);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/destinations'] });
      setIsAddDialogOpen(false);
      toast({
        title: "Destination created",
        description: "The destination has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating destination",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update destination mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, destination }: { id: number, destination: InsertDestination }) => {
      return destinationsApi.update(token!, id, destination);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/destinations'] });
      setIsEditDialogOpen(false);
      setSelectedDestination(null);
      toast({
        title: "Destination updated",
        description: "The destination has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating destination",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleCreate = (destination: InsertDestination) => {
    createMutation.mutate(destination);
  };

  const handleUpdate = (destination: InsertDestination) => {
    if (selectedDestination) {
      updateMutation.mutate({ id: selectedDestination.id, destination });
    }
  };

  const handleEditClick = (destination: Destination) => {
    // Transform the destination to ensure correct typing
    const transformedDestination = {
      ...destination,
      features: destination.features ? {
        bestSeasons: Array.isArray((destination.features as any).bestSeasons) 
          ? (destination.features as any).bestSeasons 
          : [],
        activities: Array.isArray((destination.features as any).activities) 
          ? (destination.features as any).activities 
          : [],
        budget: (destination.features as any).budget || ''
      } : {
        bestSeasons: [],
        activities: [],
        budget: ''
      }
    };
    
    setSelectedDestination(transformedDestination);
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Manage Destinations | Admin</title>
      </Helmet>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Destinations Management</h1>
            <p className="text-muted-foreground">
              Manage your travel destinations and their details
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Destination
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Add New Destination</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new travel destination
                  </DialogDescription>
                </DialogHeader>
                <DestinationForm
                  onSubmit={handleCreate}
                  isSubmitting={createMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Destinations</CardTitle>
            <CardDescription>
              {destinations?.length ?? 0} destinations found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : destinations && destinations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Continent</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {destinations.map((destination) => (
                    <TableRow key={destination.id}>
                      <TableCell className="font-medium">{destination.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                          {destination.country}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Globe className="mr-1 h-4 w-4 text-muted-foreground" />
                          {destination.continent}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Tag className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span className="truncate max-w-[200px]">
                            {destination.tags.join(', ')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{destination.rating}/5</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(destination)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No destinations found</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add your first destination
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Destination</DialogTitle>
              <DialogDescription>
                Update the details for {selectedDestination?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedDestination && (
              <DestinationForm
                initialData={selectedDestination}
                onSubmit={handleUpdate}
                isSubmitting={updateMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}