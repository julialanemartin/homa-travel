import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InsertQuizQuestion, QuizQuestion } from '@shared/schema';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Home,
  Plus,
  HelpCircle,
  Settings,
  Edit,
  Trash,
  Save,
  X
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define types for quiz option
interface QuizOption {
  id: string;
  text: string;
  icon: string;
  description: string;
}

// Define scoring rule type
interface ScoringRule {
  id: string;
  category: string;
  responseValue: string;
  destinationProperty: string;
  propertyValue: string;
  score: number;
  description: string;
}

export default function AdminQuiz() {
  const { user, token } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('questions');
  
  // State for the quiz questions editor
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<InsertQuizQuestion>>({
    question: '',
    options: [],
    category: ''
  });
  const [newOption, setNewOption] = useState<QuizOption>({
    id: '',
    text: '',
    icon: '',
    description: ''
  });

  // Fetch quiz questions
  const { data: quizQuestions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['/api/quiz-questions'],
    queryFn: async () => {
      const response = await fetch('/api/quiz-questions');
      if (!response.ok) throw new Error('Failed to fetch quiz questions');
      return response.json();
    }
  });

  // Add new quiz question mutation
  const addQuestionMutation = useMutation({
    mutationFn: async (question: InsertQuizQuestion) => {
      if (!token) throw new Error('Not authenticated');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      const response = await fetch('/api/admin/quiz-questions', {
        method: 'POST',
        headers,
        body: JSON.stringify(question)
      });
      if (!response.ok) throw new Error('Failed to add question');
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quiz-questions'] });
      setNewQuestion({
        question: '',
        options: [],
        category: ''
      });
      toast({
        title: 'Question Added',
        description: 'The quiz question has been added successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Update quiz question mutation
  const updateQuestionMutation = useMutation({
    mutationFn: async (question: QuizQuestion) => {
      if (!token) throw new Error('Not authenticated');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      const response = await fetch(`/api/admin/quiz-questions/${question.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(question)
      });
      if (!response.ok) throw new Error('Failed to update question');
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quiz-questions'] });
      setEditingQuestion(null);
      toast({
        title: 'Question Updated',
        description: 'The quiz question has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Delete quiz question mutation
  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!token) throw new Error('Not authenticated');
      const headers: HeadersInit = {
        'Authorization': `Bearer ${token}`
      };
      const response = await fetch(`/api/admin/quiz-questions/${id}`, {
        method: 'DELETE',
        headers
      });
      if (!response.ok) throw new Error('Failed to delete question');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quiz-questions'] });
      toast({
        title: 'Question Deleted',
        description: 'The quiz question has been deleted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Handle adding a new option to a question
  const handleAddOption = () => {
    if (!newOption.id || !newOption.text) {
      toast({
        title: 'Validation Error',
        description: 'Option ID and text are required.',
        variant: 'destructive',
      });
      return;
    }

    // Add the option to the new question
    setNewQuestion(prev => ({
      ...prev,
      options: [...(prev.options || []), newOption]
    }));

    // Reset the new option form
    setNewOption({
      id: '',
      text: '',
      icon: '',
      description: ''
    });
  };

  // Handle removing an option from a question
  const handleRemoveOption = (optionId: string) => {
    setNewQuestion(prev => ({
      ...prev,
      options: (prev.options || []).filter(opt => opt.id !== optionId)
    }));
  };

  // Handle adding a new question
  const handleAddQuestion = () => {
    if (!newQuestion.question || !newQuestion.category || !newQuestion.options || newQuestion.options.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields and add at least one option.',
        variant: 'destructive',
      });
      return;
    }

    addQuestionMutation.mutate(newQuestion as InsertQuizQuestion);
  };

  // Handle editing a question
  const handleEditQuestion = (question: QuizQuestion) => {
    setEditingQuestion(question);
  };

  // Handle updating an edited question
  const handleUpdateQuestion = () => {
    if (!editingQuestion) return;
    updateQuestionMutation.mutate(editingQuestion);
  };

  // Handle deleting a question
  const handleDeleteQuestion = (id: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteQuestionMutation.mutate(id);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingQuestion(null);
  };

  return (
    <>
      <Helmet>
        <title>Quiz Management | Homa Travel Co. Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        {/* Admin Header */}
        <header className="bg-primary text-white py-4 px-6 flex justify-between items-center shadow-md">
          <div className="flex items-center space-x-2">
            <Link href="/admin">
              <a className="text-xl font-bold hover:underline">Homa Travel Co. Admin</a>
            </Link>
            <span className="mx-2">›</span>
            <h1 className="text-xl">Quiz Management</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user?.username}</span>
          </div>
        </header>

        <div className="flex flex-grow">
          {/* Admin Sidebar */}
          <aside className="w-64 bg-neutral-50 border-r shadow-sm">
            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <Link href="/admin">
                    <a className="flex items-center p-3 rounded-md hover:bg-neutral-100 transition-colors text-neutral-700 hover:text-primary">
                      <Home className="h-5 w-5" />
                      <span className="ml-3">Dashboard</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/quiz">
                    <a className="flex items-center p-3 rounded-md bg-neutral-200 text-primary">
                      <HelpCircle className="h-5 w-5" />
                      <span className="ml-3">Quiz Management</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/site-settings">
                    <a className="flex items-center p-3 rounded-md hover:bg-neutral-100 transition-colors text-neutral-700 hover:text-primary">
                      <Settings className="h-5 w-5" />
                      <span className="ml-3">Site Settings</span>
                    </a>
                  </Link>
                </li>
                <li className="pt-4 mt-4 border-t">
                  <Link href="/">
                    <a className="flex items-center p-3 rounded-md hover:bg-neutral-100 transition-colors text-neutral-700 hover:text-primary">
                      <Home className="h-5 w-5" />
                      <span className="ml-3">View Website</span>
                    </a>
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Admin Content */}
          <main className="flex-grow p-6 bg-neutral-100">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Destination Matcher Quiz Management</h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="questions">Quiz Questions</TabsTrigger>
                <TabsTrigger value="scoring">Scoring Algorithm</TabsTrigger>
              </TabsList>

              {/* Quiz Questions Tab */}
              <TabsContent value="questions" className="space-y-4">
                {isLoadingQuestions ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Add New Question */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Add New Question</CardTitle>
                        <CardDescription>Create a new question for the destination matcher quiz</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="questionText">Question Text</Label>
                          <Input
                            id="questionText"
                            value={newQuestion.question}
                            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                            placeholder="Enter the question text"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            value={newQuestion.category}
                            onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                            placeholder="Enter the question category (e.g. travel_style, climate)"
                          />
                        </div>
                        <div className="border p-4 rounded-md space-y-4">
                          <h3 className="font-medium text-lg">Options</h3>
                          <div className="space-y-2">
                            {newQuestion.options && newQuestion.options.length > 0 ? (
                              <div className="grid gap-2">
                                {newQuestion.options.map((option) => (
                                  <div key={option.id} className="flex items-center justify-between p-3 border rounded-md">
                                    <div>
                                      <span className="font-medium">{option.text}</span>
                                      <p className="text-sm text-muted-foreground">{option.description}</p>
                                      <span className="text-xs text-muted-foreground">ID: {option.id}</span>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleRemoveOption(option.id)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-center py-2">No options yet. Add one below.</p>
                            )}
                          </div>
                          
                          {/* Add Option Form */}
                          <div className="border p-3 rounded-md space-y-3">
                            <h4 className="font-medium">Add Option</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor="optionId">Option ID</Label>
                                <Input
                                  id="optionId"
                                  value={newOption.id}
                                  onChange={(e) => setNewOption({ ...newOption, id: e.target.value })}
                                  placeholder="e.g. adventure, relaxation"
                                />
                              </div>
                              <div>
                                <Label htmlFor="optionText">Option Text</Label>
                                <Input
                                  id="optionText"
                                  value={newOption.text}
                                  onChange={(e) => setNewOption({ ...newOption, text: e.target.value })}
                                  placeholder="e.g. Adventure Seeker"
                                />
                              </div>
                              <div>
                                <Label htmlFor="optionIcon">Icon (optional)</Label>
                                <Input
                                  id="optionIcon"
                                  value={newOption.icon}
                                  onChange={(e) => setNewOption({ ...newOption, icon: e.target.value })}
                                  placeholder="e.g. mountain"
                                />
                              </div>
                              <div>
                                <Label htmlFor="optionDescription">Description (optional)</Label>
                                <Input
                                  id="optionDescription"
                                  value={newOption.description}
                                  onChange={(e) => setNewOption({ ...newOption, description: e.target.value })}
                                  placeholder="Brief description"
                                />
                              </div>
                            </div>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={handleAddOption} 
                              className="w-full"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Option
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          onClick={handleAddQuestion} 
                          disabled={addQuestionMutation.isPending}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Question
                        </Button>
                      </CardFooter>
                    </Card>

                    {/* Existing Questions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Existing Quiz Questions</CardTitle>
                        <CardDescription>
                          Manage the current quiz questions for the destination matcher
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {quizQuestions && quizQuestions.length > 0 ? (
                          <Accordion type="single" collapsible className="w-full">
                            {quizQuestions.map((question: QuizQuestion) => (
                              <AccordionItem key={question.id} value={`question-${question.id}`}>
                                <AccordionTrigger className="text-left">
                                  <div className="flex justify-between items-center w-full pr-4">
                                    <span>{question.question}</span>
                                    <span className="text-xs px-2 py-1 bg-muted rounded-md">
                                      {question.category}
                                    </span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  {editingQuestion && editingQuestion.id === question.id ? (
                                    <div className="space-y-4 mt-4">
                                      <div>
                                        <Label htmlFor={`edit-question-${question.id}`}>Question Text</Label>
                                        <Input
                                          id={`edit-question-${question.id}`}
                                          value={editingQuestion.question}
                                          onChange={(e) => setEditingQuestion({
                                            ...editingQuestion,
                                            question: e.target.value
                                          })}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor={`edit-category-${question.id}`}>Category</Label>
                                        <Input
                                          id={`edit-category-${question.id}`}
                                          value={editingQuestion.category}
                                          onChange={(e) => setEditingQuestion({
                                            ...editingQuestion,
                                            category: e.target.value
                                          })}
                                        />
                                      </div>
                                      <div className="border p-4 rounded-md">
                                        <h4 className="font-medium mb-2">Options</h4>
                                        <div className="space-y-2">
                                          {editingQuestion.options && editingQuestion.options.map((option: QuizOption, index: number) => (
                                            <div key={option.id} className="grid grid-cols-2 gap-2 mb-4">
                                              <div>
                                                <Label>ID</Label>
                                                <Input
                                                  value={option.id}
                                                  onChange={(e) => {
                                                    const newOptions = [...editingQuestion.options];
                                                    newOptions[index] = {
                                                      ...newOptions[index],
                                                      id: e.target.value
                                                    };
                                                    setEditingQuestion({
                                                      ...editingQuestion,
                                                      options: newOptions
                                                    });
                                                  }}
                                                />
                                              </div>
                                              <div>
                                                <Label>Text</Label>
                                                <Input
                                                  value={option.text}
                                                  onChange={(e) => {
                                                    const newOptions = [...editingQuestion.options];
                                                    newOptions[index] = {
                                                      ...newOptions[index],
                                                      text: e.target.value
                                                    };
                                                    setEditingQuestion({
                                                      ...editingQuestion,
                                                      options: newOptions
                                                    });
                                                  }}
                                                />
                                              </div>
                                              <div>
                                                <Label>Icon</Label>
                                                <Input
                                                  value={option.icon}
                                                  onChange={(e) => {
                                                    const newOptions = [...editingQuestion.options];
                                                    newOptions[index] = {
                                                      ...newOptions[index],
                                                      icon: e.target.value
                                                    };
                                                    setEditingQuestion({
                                                      ...editingQuestion,
                                                      options: newOptions
                                                    });
                                                  }}
                                                />
                                              </div>
                                              <div>
                                                <Label>Description</Label>
                                                <Input
                                                  value={option.description}
                                                  onChange={(e) => {
                                                    const newOptions = [...editingQuestion.options];
                                                    newOptions[index] = {
                                                      ...newOptions[index],
                                                      description: e.target.value
                                                    };
                                                    setEditingQuestion({
                                                      ...editingQuestion,
                                                      options: newOptions
                                                    });
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      <div className="flex space-x-2">
                                        <Button 
                                          onClick={handleUpdateQuestion}
                                          disabled={updateQuestionMutation.isPending}
                                        >
                                          <Save className="h-4 w-4 mr-2" />
                                          Save Changes
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          onClick={handleCancelEdit}
                                        >
                                          <X className="h-4 w-4 mr-2" />
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="pt-2">
                                        <h4 className="font-medium mb-2">Options:</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                          {question.options && question.options.map((option: QuizOption) => (
                                            <div key={option.id} className="p-3 border rounded-md">
                                              <div className="font-medium">{option.text}</div>
                                              <div className="text-sm text-muted-foreground">{option.description}</div>
                                              <div className="text-xs text-muted-foreground mt-1">
                                                ID: {option.id} | Icon: {option.icon || 'None'}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      <div className="flex space-x-2 mt-4">
                                        <Button 
                                          variant="outline" 
                                          onClick={() => handleEditQuestion(question)}
                                        >
                                          <Edit className="h-4 w-4 mr-2" />
                                          Edit
                                        </Button>
                                        <Button 
                                          variant="destructive"
                                          onClick={() => handleDeleteQuestion(question.id)}
                                          disabled={deleteQuestionMutation.isPending}
                                        >
                                          <Trash className="h-4 w-4 mr-2" />
                                          Delete
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">No quiz questions found</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              {/* Scoring Algorithm Tab */}
              <TabsContent value="scoring" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Scoring Algorithm Configuration</CardTitle>
                    <CardDescription>
                      Manage how user responses affect destination matching scores
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
                        <h3 className="text-amber-800 font-medium mb-2 flex items-center">
                          <HelpCircle className="h-5 w-5 mr-2" />
                          Scoring Algorithm Info
                        </h3>
                        <p className="text-amber-700 text-sm">
                          Currently, the scoring algorithm is implemented directly in the backend code.
                          In the future, you'll be able to edit the algorithm rules through this interface.
                          For now, this page shows the current scoring parameters for reference.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-3">Current Scoring Parameters</h3>
                        
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="travel-style">
                            <AccordionTrigger>Travel Style Scoring</AccordionTrigger>
                            <AccordionContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Travel Style</TableHead>
                                    <TableHead>Destination Feature</TableHead>
                                    <TableHead>Points</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>Adventure</TableCell>
                                    <TableCell>Tags: Adventure, Hiking, Nature, Mountains</TableCell>
                                    <TableCell>+25</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Cultural</TableCell>
                                    <TableCell>Tags: Cultural, Historic, Museums</TableCell>
                                    <TableCell>+25</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Relaxation</TableCell>
                                    <TableCell>Tags: Beach, Resort, Island, Relaxation</TableCell>
                                    <TableCell>+25</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Urban</TableCell>
                                    <TableCell>Tags: Urban, City, Shopping, Nightlife</TableCell>
                                    <TableCell>+25</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="budget">
                            <AccordionTrigger>Budget Scoring</AccordionTrigger>
                            <AccordionContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Budget Preference</TableHead>
                                    <TableHead>Destination Feature</TableHead>
                                    <TableHead>Points</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>Budget Conscious</TableCell>
                                    <TableCell>Budget: Low</TableCell>
                                    <TableCell>+30</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Budget Conscious + Asia</TableCell>
                                    <TableCell>Budget: Low + Continent: Asia</TableCell>
                                    <TableCell>+15</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Budget Conscious + SE Asia Countries</TableCell>
                                    <TableCell>Budget: Low + Country: Indonesia/Thailand/Vietnam</TableCell>
                                    <TableCell>+10</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Budget Conscious + Budget Cities</TableCell>
                                    <TableCell>Budget: Low + City: Bangkok/Chiang Mai/Bali/Hoi An/Hanoi</TableCell>
                                    <TableCell>+5</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Budget Conscious</TableCell>
                                    <TableCell>Budget: Medium</TableCell>
                                    <TableCell>+10</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Budget Conscious</TableCell>
                                    <TableCell>Budget: High</TableCell>
                                    <TableCell>-15</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Moderate Spender</TableCell>
                                    <TableCell>Budget: Medium</TableCell>
                                    <TableCell>+20</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Luxury Focused</TableCell>
                                    <TableCell>Budget: High</TableCell>
                                    <TableCell>+25</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Mixed Budget</TableCell>
                                    <TableCell>Any Budget</TableCell>
                                    <TableCell>+10</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="climate">
                            <AccordionTrigger>Climate Scoring</AccordionTrigger>
                            <AccordionContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Climate Preference</TableHead>
                                    <TableHead>Destination Feature</TableHead>
                                    <TableHead>Points</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>Tropical/Warm</TableCell>
                                    <TableCell>Best Seasons: Summer/All Year + Tags: Beach/Tropical/Island</TableCell>
                                    <TableCell>+20</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Tropical/Warm</TableCell>
                                    <TableCell>Country: Spain (except Madrid)</TableCell>
                                    <TableCell>+5</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Tropical/Warm</TableCell>
                                    <TableCell>Country: Costa Rica/Ecuador/Peru/Brazil</TableCell>
                                    <TableCell>+10</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Tropical/Warm</TableCell>
                                    <TableCell>Country: Costa Rica/Ecuador (especially)</TableCell>
                                    <TableCell>+5</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Temperate/Mild</TableCell>
                                    <TableCell>Best Seasons: Spring/Fall/Autumn</TableCell>
                                    <TableCell>+20</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Temperate/Mild</TableCell>
                                    <TableCell>Country: Italy/Turkey/Spain/Greece</TableCell>
                                    <TableCell>+10</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Cold/Alpine</TableCell>
                                    <TableCell>Best Seasons: Winter or Tags: Snow/Mountains/Skiing/Winter</TableCell>
                                    <TableCell>+20</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Varied/All Seasons</TableCell>
                                    <TableCell>Any Climate</TableCell>
                                    <TableCell>+10</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="activities">
                            <AccordionTrigger>Activities Scoring</AccordionTrigger>
                            <AccordionContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Activity Preference</TableHead>
                                    <TableHead>Destination Feature</TableHead>
                                    <TableHead>Points</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>Outdoor Activities</TableCell>
                                    <TableCell>Activities: Hiking/Adventure/Beach/Sports/Nature</TableCell>
                                    <TableCell>+20</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Cultural Experiences</TableCell>
                                    <TableCell>Activities: Museums/Temples/Historic Sites/Traditional Experiences</TableCell>
                                    <TableCell>+20</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Food & Drink</TableCell>
                                    <TableCell>Activities: Food/Dining/Cuisine/Culinary</TableCell>
                                    <TableCell>+20</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Rest & Relaxation</TableCell>
                                    <TableCell>Activities: Beach/Spa/Resort/Leisure</TableCell>
                                    <TableCell>+20</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="evenings">
                            <AccordionTrigger>Evening Preferences Scoring</AccordionTrigger>
                            <AccordionContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Evening Preference</TableHead>
                                    <TableHead>Destination Feature</TableHead>
                                    <TableHead>Points</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>Vibrant Nightlife</TableCell>
                                    <TableCell>Tags: Nightlife/Entertainment/Urban</TableCell>
                                    <TableCell>+15</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Dining Experiences</TableCell>
                                    <TableCell>Tags: Dining/Culinary/Food</TableCell>
                                    <TableCell>+15</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Quiet Relaxation</TableCell>
                                    <TableCell>Tags: Nature/Peaceful/Scenic</TableCell>
                                    <TableCell>+15</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="interests">
                            <AccordionTrigger>Interests/Hobbies Scoring</AccordionTrigger>
                            <AccordionContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Interest Matching</TableHead>
                                    <TableHead>Calculation</TableHead>
                                    <TableHead>Points</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>Each matching interest</TableCell>
                                    <TableCell>User interest matches destination tag or activity</TableCell>
                                    <TableCell>+5 (per match, max 25)</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Exact interest match</TableCell>
                                    <TableCell>User interest exactly matches destination tag or activity</TableCell>
                                    <TableCell>+2 (per exact match)</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="general">
                            <AccordionTrigger>General Scoring</AccordionTrigger>
                            <AccordionContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Feature</TableHead>
                                    <TableHead>Calculation</TableHead>
                                    <TableHead>Points</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>Destination Rating</TableCell>
                                    <TableCell>(destination.rating / 5) * 10</TableCell>
                                    <TableCell>0-10 based on rating</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>Maximum Score</TableCell>
                                    <TableCell>Capped at 100</TableCell>
                                    <TableCell>100 max</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Future feature: Edit scoring algorithm */}
                <Card>
                  <CardHeader>
                    <CardTitle>Coming Soon: Editable Scoring Rules</CardTitle>
                    <CardDescription>
                      In a future update, you'll be able to edit the scoring algorithm directly through this interface
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Feature in Development</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mt-2">
                        Soon you'll be able to create, edit, and manage scoring rules to fine-tune
                        how user preferences affect destination matching without changing code.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </>
  );
}