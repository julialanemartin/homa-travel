import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { insertDestinationSchema } from '@shared/schema';
import { Loader2 } from 'lucide-react';

// Extending the schema for client-side validation
const destinationFormSchema = insertDestinationSchema.extend({
  name: z.string().min(3, "Destination name must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  country: z.string().min(2, "Country name is required"),
  continent: z.string().min(2, "Continent name is required"),
  imageUrl: z.string().url("Please enter a valid image URL"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  features: z.object({
    bestSeasons: z.array(z.string()).optional(),
    activities: z.array(z.string()).optional(),
    budget: z.string().optional()
  }).optional()
});

type DestinationFormValues = z.infer<typeof destinationFormSchema>;

interface DestinationFormProps {
  initialData?: DestinationFormValues;
  onSubmit: (data: DestinationFormValues) => void;
  isSubmitting: boolean;
}

export default function DestinationForm({ initialData, onSubmit, isSubmitting }: DestinationFormProps) {
  // Convert tags from array to comma-separated string for the form
  const defaultValues = initialData ? {
    ...initialData,
    tags: initialData.tags ? initialData.tags.join(', ') : '',
    features: initialData.features ? {
      ...initialData.features,
      bestSeasons: initialData.features.bestSeasons ? initialData.features.bestSeasons.join(', ') : '',
      activities: initialData.features.activities ? initialData.features.activities.join(', ') : ''
    } : {
      bestSeasons: '',
      activities: '',
      budget: ''
    }
  } : {
    name: '',
    description: '',
    country: '',
    continent: '',
    imageUrl: '',
    tags: '',
    features: {
      bestSeasons: '',
      activities: '',
      budget: ''
    }
  };

  // Form setup with validation
  const form = useForm<any>({
    defaultValues,
    resolver: zodResolver(
      // Transform the schema to handle string inputs for arrays
      destinationFormSchema.transform((data: any) => ({
        ...data,
        tags: typeof data.tags === 'string' ? data.tags.split(',').map((tag: string) => tag.trim()) : data.tags,
        features: {
          ...data.features,
          bestSeasons: typeof data.features?.bestSeasons === 'string' 
            ? data.features.bestSeasons.split(',').map((season: string) => season.trim())
            : data.features?.bestSeasons || [],
          activities: typeof data.features?.activities === 'string'
            ? data.features.activities.split(',').map((activity: string) => activity.trim())
            : data.features?.activities || []
        }
      }))
    )
  });

  const handleSubmit = (values: any) => {
    // Process the form data
    const formattedData = {
      ...values,
      // Convert comma-separated strings to arrays
      tags: typeof values.tags === 'string' ? values.tags.split(',').map((tag: string) => tag.trim()) : values.tags,
      features: {
        ...values.features,
        bestSeasons: typeof values.features.bestSeasons === 'string' 
          ? values.features.bestSeasons.split(',').map((season: string) => season.trim())
          : values.features.bestSeasons,
        activities: typeof values.features.activities === 'string'
          ? values.features.activities.split(',').map((activity: string) => activity.trim())
          : values.features.activities
      }
    };

    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination Name*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Paris, Tokyo, New York" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL*</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. France, Japan, USA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="continent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Continent*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Europe, Asia, North America" {...field} />
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
                <FormLabel>Tags*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. beach, mountains, city, historical (comma-separated)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description*</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Detailed description of the destination" 
                    className="min-h-32"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2 border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Features (Optional)</h3>
          </div>

          <FormField
            control={form.control}
            name="features.bestSeasons"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Best Seasons</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Spring, Summer, Fall (comma-separated)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="features.activities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activities</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Hiking, Swimming, Sightseeing (comma-separated)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="features.budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Range</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Budget, Mid-range, Luxury" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Destination'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}