import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { LocalDestination, insertLocalDestinationSchema } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, MapPin, Trash2, Edit, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";

// Extend with validation rules
const formSchema = insertLocalDestinationSchema.extend({
  tags: z.string().transform(val => val.split(',').map(tag => tag.trim())),
  amenities: z.string().transform(val => val.split(',').map(amenity => amenity.trim())),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminLocalDestinations() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentDestination, setCurrentDestination] = useState<LocalDestination | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Fetch all local destinations
  const { data: destinations, isLoading, refetch } = useQuery<LocalDestination[]>({
    queryKey: ['/api/local-destinations'],
    queryFn: async () => {
      const response = await fetch('/api/local-destinations');
      return response.json();
    },
  });

  // Create a new local destination
  const createMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest('POST', '/api/local-destinations', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Destination created",
        description: "The local destination has been added successfully.",
      });
      setIsAddModalOpen(false);
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create destination.",
        variant: "destructive",
      });
    },
  });

  // Update an existing local destination
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: FormValues }) => {
      const response = await apiRequest('PUT', `/api/local-destinations/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Destination updated",
        description: "The local destination has been updated successfully.",
      });
      setIsEditModalOpen(false);
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update destination.",
        variant: "destructive",
      });
    },
  });

  // Delete a local destination
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/local-destinations/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Destination deleted",
        description: "The local destination has been removed.",
      });
      setIsDeleteModalOpen(false);
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete destination.",
        variant: "destructive",
      });
    },
  });

  // Create form
  const createForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      latitude: 0,
      longitude: 0,
      imageUrl: "",
      websiteUrl: "",
      category: "",
      tags: "",
      rating: 0,
      ratingCount: 0,
      priceLevel: 1,
      hoursOfOperation: "",
      contactPhone: "",
      amenities: "",
    },
  });

  // Edit form
  const editForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      latitude: 0,
      longitude: 0,
      imageUrl: "",
      websiteUrl: "",
      category: "",
      tags: "",
      rating: 0,
      ratingCount: 0,
      priceLevel: 1,
      hoursOfOperation: "",
      contactPhone: "",
      amenities: "",
    },
  });

  // When a destination is selected for editing, populate the form
  useEffect(() => {
    if (currentDestination && isEditModalOpen) {
      editForm.reset({
        name: currentDestination.name,
        description: currentDestination.description,
        address: currentDestination.address,
        city: currentDestination.city,
        state: currentDestination.state,
        zipCode: currentDestination.zipCode,
        latitude: currentDestination.latitude,
        longitude: currentDestination.longitude,
        imageUrl: currentDestination.imageUrl,
        websiteUrl: currentDestination.websiteUrl || "",
        category: currentDestination.category,
        tags: currentDestination.tags.join(", "),
        rating: currentDestination.rating || 0,
        ratingCount: currentDestination.ratingCount || 0,
        priceLevel: currentDestination.priceLevel || 1,
        hoursOfOperation: currentDestination.hoursOfOperation || "",
        contactPhone: currentDestination.contactPhone || "",
        amenities: currentDestination.amenities ? currentDestination.amenities.join(", ") : "",
      });
    }
  }, [currentDestination, isEditModalOpen, editForm]);

  // Create destination handler
  const onCreateSubmit = (data: FormValues) => {
    createMutation.mutate(data);
  };

  // Update destination handler
  const onEditSubmit = (data: FormValues) => {
    if (currentDestination) {
      updateMutation.mutate({ id: currentDestination.id, data });
    }
  };

  // Delete destination handler
  const handleDelete = () => {
    if (currentDestination) {
      deleteMutation.mutate(currentDestination.id);
    }
  };

  // Filter destinations based on search query
  const filteredDestinations = destinations?.filter(destination => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      destination.name.toLowerCase().includes(query) ||
      destination.description.toLowerCase().includes(query) ||
      destination.city.toLowerCase().includes(query) ||
      destination.state.toLowerCase().includes(query) ||
      destination.zipCode.includes(query) ||
      destination.tags.some(tag => tag.toLowerCase().includes(query)) ||
      destination.category.toLowerCase().includes(query)
    );
  });

  const renderDestinationForm = (form: any, onSubmit: any, isSubmitting: boolean, actionLabel: string) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Central Park" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="park">Park</SelectItem>
                    <SelectItem value="museum">Museum</SelectItem>
                    <SelectItem value="beach">Beach</SelectItem>
                    <SelectItem value="landmark">Landmark</SelectItem>
                    <SelectItem value="historical">Historical Site</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="market">Market</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Describe this destination..." 
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com/image.jpg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="123 Main St" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="New York" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="NY" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="10001" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.0001"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    placeholder="40.7128"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.0001"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    placeholder="-74.0060"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Outdoor, Family-friendly, Historical (comma separated)" />
                </FormControl>
                <FormDescription>
                  Enter tags separated by commas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amenities"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Amenities</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Hiking Trails, Restrooms, Picnic Areas (comma separated)" />
                </FormControl>
                <FormDescription>
                  Enter amenities separated by commas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="+1 (212) 555-1234" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hoursOfOperation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hours of Operation</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="9:00 AM - 5:00 PM daily" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating (0-5)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    placeholder="4.5"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ratingCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating Count</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    placeholder="1024"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price Level (1-4)</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">$ (Free or Inexpensive)</SelectItem>
                    <SelectItem value="2">$$ (Moderate)</SelectItem>
                    <SelectItem value="3">$$$ (Expensive)</SelectItem>
                    <SelectItem value="4">$$$$ (Very Expensive)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            actionLabel
          )}
        </Button>
      </form>
    </Form>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Local Destinations Management</h1>
          <p className="text-muted-foreground">Manage US local destinations for user exploration</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search destinations..."
              className="pl-9 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Destination
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Local Destination</DialogTitle>
                <DialogDescription>
                  Create a new local destination for users to discover.
                </DialogDescription>
              </DialogHeader>
              {renderDestinationForm(createForm, onCreateSubmit, createMutation.isPending, "Create Destination")}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !destinations || destinations.length === 0 ? (
        <div className="text-center p-12 border rounded-md">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No destinations found</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            There are no local destinations in the system yet.
          </p>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Destination
          </Button>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDestinations?.map((destination) => (
                  <TableRow key={destination.id}>
                    <TableCell className="font-medium">{destination.name}</TableCell>
                    <TableCell>{destination.city}, {destination.state}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {destination.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {destination.rating ? (
                        <div className="flex items-center">
                          <span className="font-medium text-amber-500">{destination.rating.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground ml-1">
                            ({destination.ratingCount || 0})
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not rated</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentDestination(destination);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => {
                            setCurrentDestination(destination);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredDestinations?.length} of {destinations.length} destinations
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Edit Destination Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Local Destination</DialogTitle>
            <DialogDescription>
              Update the details for {currentDestination?.name}.
            </DialogDescription>
          </DialogHeader>
          {renderDestinationForm(editForm, onEditSubmit, updateMutation.isPending, "Update Destination")}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {currentDestination?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}