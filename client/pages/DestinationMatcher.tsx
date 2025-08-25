import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { QuizQuestion, QuizOption, QuizResult, Destination } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Helmet } from 'react-helmet';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, ArrowLeft, Check, Loader2, MapPin, Star } from 'lucide-react';

type QuizStep = 'intro' | 'question' | 'results';

export default function DestinationMatcher() {
  const [location, setLocation] = useLocation();
  const [step, setStep] = useState<QuizStep>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [additionalInterests, setAdditionalInterests] = useState<string>('');
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Get initial travel style from URL if provided
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const styleParam = params.get('style');
    
    if (styleParam) {
      setAnswers(prev => ({ ...prev, travel_style: styleParam }));
    }
  }, [location]);

  // Fetch quiz questions
  const { data: questions, isLoading: questionsLoading } = useQuery<QuizQuestion[]>({
    queryKey: ['/api/quiz-questions'],
  });

  // Current question
  const currentQuestion = questions?.[currentQuestionIndex];

  // Calculate progress
  const progress = questions ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  // Handle option selection
  const selectOption = (optionId: string) => {
    if (!currentQuestion) return;
    
    // Store the option ID for this question category
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.category]: optionId
    }));
  };

  // Navigate to next question
  const nextQuestion = () => {
    if (!questions) return;
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      submitQuiz();
    }
  };

  // Navigate to previous question
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    } else {
      setStep('intro');
    }
  };

  // Start quiz
  const startQuiz = () => {
    setStep('question');
    setCurrentQuestionIndex(0);
  };

  // Submit quiz answers
  const submitQuiz = async () => {
    if (!questions || Object.keys(answers).length < questions.length) {
      toast({
        title: "Please complete all questions",
        description: "Make sure to answer all questions before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create a complete copy of the answers
      let finalAnswers = {...answers};
      
      // Get the selected interest option if it exists
      const interestQuestion = questions.find(q => q.category === 'interests');
      if (interestQuestion) {
        const selectedInterestId = answers.interests;
        if (selectedInterestId) {
          const selectedOption = interestQuestion.options.find(opt => opt.id === selectedInterestId);
          if (selectedOption) {
            // Replace the ID with the actual text for better matching
            finalAnswers.interestText = selectedOption.text;
          }
        }
      }
      
      // Handle additional interests from free text input
      if (additionalInterests.trim()) {
        finalAnswers.additionalInterests = additionalInterests.trim();
      }
      
      const response = await apiRequest('POST', '/api/quiz-responses', {
        userId: 1, // For demo purposes, in a real app this would be the authenticated user's ID
        responses: finalAnswers,
        createdAt: new Date() // Send as actual Date object, not string
      });
      
      if (response.ok) {
        const result = await response.json();
        setQuizResults(result);
        setStep('results');
      } else {
        throw new Error('Failed to submit quiz');
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "We couldn't process your quiz results. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset quiz
  const resetQuiz = () => {
    setAnswers({});
    setAdditionalInterests('');
    setQuizResults(null);
    setCurrentQuestionIndex(0);
    setStep('intro');
  };

  // Render icon based on option with color class parameter
  const renderIcon = (option: QuizOption, colorClass: string = "text-primary") => {
    // Use the provided color class or default to primary color
    // This is a simplified version - in a real app, you'd have a mapping of icons
    const iconMap: Record<string, (className: string) => JSX.Element> = {
      'mountain': (className) => <Mountain className={className} />,
      'umbrella-beach': (className) => <UmbrellaBeach className={className} />,
      'utensils': (className) => <Utensils className={className} />,
      'landmark': (className) => <Landmark className={className} />,
      'sun': (className) => <Sun className={className} />,
      'cloud-sun': (className) => <CloudSun className={className} />,
      'snowflake': (className) => <Snowflake className={className} />,
      'calendar': (className) => <Calendar className={className} />,
      'wallet': (className) => <Wallet className={className} />,
      'credit-card': (className) => <CreditCard className={className} />,
      'gem': (className) => <Gem className={className} />,
      'balance-scale': (className) => <Scale className={className} />,
      'hiking': (className) => <Hike className={className} />,
      'theater-masks': (className) => <Theater className={className} />,
      'spa': (className) => <Spa className={className} />,
      'cocktail': (className) => <Wine className={className} />,
      'concierge-bell': (className) => <Bell className={className} />,
      'book': (className) => <Book className={className} />,
      'users': (className) => <Users className={className} />,
      // Additional icons for the new interests/hobbies question
      'camera': (className) => <Camera className={className} />,
      'drumstick-bite': (className) => <DrumstickBite className={className} />,
      'archway': (className) => <Archway className={className} />,
      'leaf': (className) => <Leaf className={className} />,
      'palette': (className) => <Palette className={className} />,
      'running': (className) => <Running className={className} />,
      'city': (className) => <City className={className} />
    };
    
    return iconMap[option.icon] ? iconMap[option.icon](colorClass) : <Star className={colorClass} />;
  };

  // Simplified icon components for the mock options
  function Mountain(props: any) { return <Star {...props} />; }
  function UmbrellaBeach(props: any) { return <Star {...props} />; }
  function Utensils(props: any) { return <Star {...props} />; }
  function Landmark(props: any) { return <Star {...props} />; }
  function Sun(props: any) { return <Star {...props} />; }
  function CloudSun(props: any) { return <Star {...props} />; }
  function Snowflake(props: any) { return <Star {...props} />; }
  function Calendar(props: any) { return <Star {...props} />; }
  function Wallet(props: any) { return <Star {...props} />; }
  function CreditCard(props: any) { return <Star {...props} />; }
  function Gem(props: any) { return <Star {...props} />; }
  function Scale(props: any) { return <Star {...props} />; }
  function Hike(props: any) { return <Star {...props} />; }
  function Theater(props: any) { return <Star {...props} />; }
  function Spa(props: any) { return <Star {...props} />; }
  function Wine(props: any) { return <Star {...props} />; }
  function Bell(props: any) { return <Star {...props} />; }
  function Book(props: any) { return <Star {...props} />; }
  function Users(props: any) { return <Star {...props} />; }
  // New icon components for interests
  function Camera(props: any) { return <Star {...props} />; }
  function Archway(props: any) { return <Star {...props} />; }
  function Leaf(props: any) { return <Star {...props} />; }
  function Palette(props: any) { return <Star {...props} />; }
  function Running(props: any) { return <Star {...props} />; }
  function DrumstickBite(props: any) { return <Star {...props} />; }
  function City(props: any) { return <Star {...props} />; }

  return (
    <>
      <Helmet>
        <title>Find Your Perfect Destination | Homa Travel Co.</title>
        <meta name="description" content="Answer a few questions about your travel preferences and we'll match you with destinations you'll love with Homa Travel Co." />
      </Helmet>
      
      <div className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          {step === 'intro' && (
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">Find Your Perfect Destination</h1>
              <p className="text-lg text-neutral-600 mb-8">
                Answer a few questions about your travel preferences and we'll match you with destinations you'll love.
              </p>
              
              <Card className="bg-gradient-primary text-white border-none shadow-md mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="relative h-40 w-40 mb-6">
                      <div className="absolute inset-0 rounded-full bg-white/50 flex items-center justify-center">
                        <MapPin className="h-20 w-20 text-primary" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-heading font-semibold mb-2">Destination Matcher Quiz</h2>
                    <p className="text-neutral-600 mb-6 text-center">
                      This short quiz will help us understand your travel preferences and match you with your ideal destinations.
                    </p>
                    <Button onClick={startQuiz} size="lg" className="px-8">
                      Start Quiz <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <p className="text-sm text-neutral-500 mt-4">
                This takes about 2 minutes to complete. Your results will be personalized based on your preferences.
              </p>
            </div>
          )}
          
          {step === 'question' && questions && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <div className="bg-gradient-primary text-white rounded-2xl p-6 md:p-10 shadow-lg">
                <Card>
                  <CardContent className="pt-6">
                    {questionsLoading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                          {[1, 2, 3, 4].map(i => (
                            <Skeleton key={i} className="h-24" />
                          ))}
                        </div>
                      </div>
                    ) : currentQuestion ? (
                      <>
                        <div className="mb-8">
                          <span className="inline-block bg-gradient-primary text-white font-medium px-3 py-1 rounded-full text-sm mb-4">
                            Question {currentQuestionIndex + 1} of {questions.length}
                          </span>
                          <h3 className="font-heading font-semibold text-2xl mb-3">{currentQuestion.question}</h3>
                          <p className="text-neutral-600">Select the option that best describes your preference.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {currentQuestion.options.map((option) => (
                              <div 
                                key={option.id} 
                                onClick={() => selectOption(option.id)} 
                                className={`bg-white rounded-lg p-4 cursor-pointer border-2 transition-all flex 
                                  ${answers[currentQuestion.category] === option.id 
                                    ? 'border-primary' 
                                    : 'border-transparent hover:border-primary/50'
                                  }`}
                              >
                                <div className="flex items-start">
                                  <div className="bg-gradient-primary rounded-full p-2 mr-3">
                                    {renderIcon(option, "text-white")}
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-1">{option.text}</h4>
                                    <p className="text-sm text-neutral-600">{option.description}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        
                        {/* Additional interests input field only for interests question */}
                        {currentQuestion.category === 'interests' && (
                          <div className="mt-4 mb-6">
                            <Label htmlFor="additional-interests" className="block text-sm font-medium mb-2">
                              Any other specific hobbies or interests? (optional)
                            </Label>
                            <Input
                              id="additional-interests"
                              placeholder="e.g., hiking, photography, food tours, local markets"
                              value={additionalInterests}
                              onChange={(e) => {
                                setAdditionalInterests(e.target.value);
                                // The additional interests will be processed when the quiz is submitted
                              }}
                              className="w-full"
                            />
                            <p className="text-xs text-neutral-500 mt-1">
                              Adding your specific interests helps us find the perfect destinations for you
                            </p>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          <Button 
                            variant="outline" 
                            onClick={prevQuestion}
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                          </Button>
                          
                          <Button 
                            onClick={nextQuestion}
                            disabled={!answers[currentQuestion.category]}
                          >
                            {currentQuestionIndex === questions.length - 1 ? (
                              <>
                                Finish <Check className="ml-2 h-4 w-4" />
                              </>
                            ) : (
                              <>
                                Continue <ArrowRight className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-8">
                        <p>Error loading questions. Please try again later.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {step === 'results' && quizResults && (
            <div className="max-w-5xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-center mb-6">Your Perfect Destinations</h1>
              <p className="text-lg text-neutral-600 text-center mb-8">
                Based on your preferences, we've found these destinations that match what you're looking for.
              </p>
              
              {quizResults.matchedDestinations && quizResults.matchedDestinations.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {quizResults.matchedDestinations.map((match, index) => {
                      const destination = match.destination;
                      if (!destination) return null;
                      
                      return (
                        <Card key={match.id} className={`overflow-hidden ${index === 0 ? 'border-2 border-primary' : ''}`}>
                          {index === 0 && (
                            <div className="bg-primary text-white text-center py-2 text-sm font-medium">
                              Top Match - {Math.round(match.score)}% Match
                            </div>
                          )}
                          <div className="relative h-48">
                            <img 
                              src={destination.imageUrl} 
                              alt={destination.name} 
                              className="w-full h-full object-cover"
                            />
                            {index !== 0 && (
                              <div className="absolute top-3 right-3 bg-white/90 text-primary font-medium text-xs px-2 py-1 rounded-full">
                                {Math.round(match.score)}% Match
                              </div>
                            )}
                          </div>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-heading font-semibold text-lg">{destination.name}, {destination.country}</h3>
                              <div className="flex items-center">
                                <Star className="fill-amber-500 text-amber-500 w-4 h-4" />
                                <span className="ml-1 text-sm">{destination.rating.toFixed(1)}</span>
                              </div>
                            </div>
                            <p className="text-neutral-600 text-sm mb-4">
                              {destination.description.length > 100 
                                ? destination.description.substring(0, 100) + '...' 
                                : destination.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {destination.tags.map((tag, i) => (
                                <span 
                                  key={i} 
                                  className={`${i === 0 ? 'bg-primary/10 text-primary' : 'bg-primary/5 text-primary/80'} text-xs px-2 py-1 rounded-full`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <Button 
                              variant="outline" 
                              className="w-full" 
                              onClick={() => setLocation(`/destinations/${destination.id}`)}
                            >
                              Explore Destination
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <Button onClick={resetQuiz} variant="outline" className="mb-4">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Take Quiz Again
                    </Button>
                    <p className="text-sm text-neutral-500">
                      You can retake this quiz anytime to find different destinations based on new preferences.
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                  <h3 className="text-xl font-medium mb-2">No matching destinations found</h3>
                  <p className="text-neutral-600 mb-4">
                    We couldn't find any destinations that match your preferences. Try adjusting your criteria.
                  </p>
                  <Button onClick={resetQuiz} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Take Quiz Again
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {isSubmitting && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <h3 className="text-lg font-medium">Finding your perfect destinations...</h3>
                <p className="text-neutral-600 text-sm">This will just take a moment</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
