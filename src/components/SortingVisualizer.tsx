
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Play, 
  Pause, 
  SkipForward, 
  RefreshCw, 
  RotateCcw,
  BarChart,
  Info
} from 'lucide-react';
import { 
  SortingAlgorithm, 
  SortStep, 
  getSortingAlgorithm, 
  generateRandomArray
} from '@/utils/sortingAlgorithms';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AlgorithmInfo from './AlgorithmInfo';

const MIN_VALUE = 5;
const MAX_VALUE = 100;
const DEFAULT_ARRAY_SIZE = 30;
const DEFAULT_ANIMATION_SPEED = 100; // ms

const SortingVisualizer: React.FC = () => {
  // States
  const [array, setArray] = useState<number[]>([]);
  const [sortingSteps, setSortingSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortingAlgorithm>('bubble');
  const [arraySize, setArraySize] = useState<number>(DEFAULT_ARRAY_SIZE);
  const [animationSpeed, setAnimationSpeed] = useState<number>(DEFAULT_ANIMATION_SPEED);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  
  // Refs
  const animationRef = useRef<number | null>(null);
  
  // Initialize array
  useEffect(() => {
    resetArray();
  }, [arraySize]);
  
  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Generate a new random array
  const resetArray = () => {
    if (isSorting) stopSorting();
    const newArray = generateRandomArray(arraySize, MIN_VALUE, MAX_VALUE);
    setArray(newArray);
    setSortingSteps([]);
    setCurrentStep(0);
    setIsDone(false);
  };
  
  // Generate steps for the selected algorithm
  const generateSortingSteps = () => {
    const algorithm = getSortingAlgorithm(selectedAlgorithm);
    const steps = algorithm(array);
    setSortingSteps(steps);
    return steps;
  };
  
  // Start sorting animation
  const startSorting = () => {
    if (isDone) resetArray();
    
    let steps = sortingSteps;
    if (steps.length === 0) {
      steps = generateSortingSteps();
    }
    
    setIsSorting(true);
    
    const animate = () => {
      setCurrentStep((prevStep) => {
        const nextStep = prevStep + 1;
        
        if (nextStep >= steps.length) {
          setIsSorting(false);
          setIsDone(true);
          return prevStep;
        }
        
        return nextStep;
      });
      
      // Schedule next frame
      const timeoutId = setTimeout(() => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        animationRef.current = requestAnimationFrame(animate);
      }, animationSpeed);
      
      return () => clearTimeout(timeoutId);
    };
    
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // Stop sorting animation
  const stopSorting = () => {
    setIsSorting(false);
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };
  
  // Step forward in the animation
  const stepForward = () => {
    if (isSorting) stopSorting();
    
    let steps = sortingSteps;
    if (steps.length === 0) {
      steps = generateSortingSteps();
    }
    
    setCurrentStep((prevStep) => {
      const nextStep = prevStep + 1;
      if (nextStep >= steps.length) {
        setIsDone(true);
        return prevStep;
      }
      return nextStep;
    });
  };
  
  // Reset to the beginning of the animation
  const resetToBeginning = () => {
    if (isSorting) stopSorting();
    setCurrentStep(0);
    setIsDone(false);
  };
  
  // Handle algorithm change
  const handleAlgorithmChange = (value: string) => {
    if (isSorting) stopSorting();
    setSelectedAlgorithm(value as SortingAlgorithm);
    setSortingSteps([]);
    setCurrentStep(0);
    setIsDone(false);
  };
  
  // Handle array size change
  const handleArraySizeChange = (value: number[]) => {
    if (isSorting) stopSorting();
    setArraySize(value[0]);
  };
  
  // Handle animation speed change
  const handleSpeedChange = (value: number[]) => {
    setAnimationSpeed(510 - value[0]); // Invert so slider feels natural (right = faster)
  };
  
  // Get current step data
  const getCurrentStepData = (): SortStep => {
    if (sortingSteps.length === 0 || currentStep === 0) {
      return {
        array: array,
        comparing: [],
        swapping: [],
        sorted: [],
      };
    }
    
    return sortingSteps[currentStep];
  };
  
  const currentStepData = getCurrentStepData();
  
  // Calculate maximum value for vertical scaling
  const maxValue = array.length > 0 ? Math.max(...array) : MAX_VALUE;
  
  // Get color for array bars
  const getBarColor = (index: number) => {
    if (currentStepData.swapping.includes(index)) {
      return 'bg-red-500';
    } else if (currentStepData.comparing.includes(index)) {
      return 'bg-yellow-400';
    } else if (currentStepData.sorted.includes(index)) {
      return 'bg-green-500';
    } else if (currentStepData.pivot === index) {
      return 'bg-purple-dark';
    } else {
      return 'bg-purple-500';
    }
  };
  
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pt-8 px-4 sm:px-6 animate-slide-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-purple-500 to-purple-dark bg-clip-text text-transparent">
          Sorting Visualizer
        </h1>
        <p className="text-center text-muted-foreground">
          Interactive tool to visualize sorting algorithms
        </p>
      </div>
      
      <Card className="border border-border/50 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            {/* Algorithm Controls */}
            <div className="flex flex-wrap gap-4 justify-between items-center">
              <div className="flex items-center gap-2">
                <Select
                  value={selectedAlgorithm}
                  onValueChange={handleAlgorithmChange}
                  disabled={isSorting}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bubble">Bubble Sort</SelectItem>
                    <SelectItem value="insertion">Insertion Sort</SelectItem>
                    <SelectItem value="selection">Selection Sort</SelectItem>
                    <SelectItem value="merge">Merge Sort</SelectItem>
                    <SelectItem value="quick">Quick Sort</SelectItem>
                  </SelectContent>
                </Select>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowInfo(!showInfo)}
                        className="h-10 w-10"
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Algorithm Information</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={resetArray}
                        variant="outline"
                        size="icon"
                        disabled={isSorting}
                        className="h-10 w-10"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Generate New Array</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={resetToBeginning}
                        variant="outline"
                        size="icon"
                        disabled={isSorting || currentStep === 0}
                        className="h-10 w-10"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset to Beginning</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={stepForward}
                        variant="outline"
                        size="icon"
                        disabled={isSorting || isDone}
                        className="h-10 w-10"
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Step Forward</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <Button
                  onClick={isSorting ? stopSorting : startSorting}
                  disabled={isDone}
                  variant="default"
                  className={`h-10 px-4 ${
                    selectedAlgorithm === 'bubble' ? 'bg-algos-bubble hover:bg-algos-bubble/90' :
                    selectedAlgorithm === 'insertion' ? 'bg-algos-insertion hover:bg-algos-insertion/90' :
                    selectedAlgorithm === 'selection' ? 'bg-algos-selection hover:bg-algos-selection/90' :
                    selectedAlgorithm === 'merge' ? 'bg-algos-merge hover:bg-algos-merge/90' :
                    'bg-algos-quick hover:bg-algos-quick/90'
                  }`}
                >
                  {isSorting ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isSorting ? 'Pause' : isDone ? 'Sorted' : 'Start'}
                </Button>
              </div>
            </div>
            
            {/* Algorithm Info */}
            {showInfo && (
              <div className="bg-secondary/50 rounded-md p-4 animate-slide-down">
                <AlgorithmInfo algorithm={selectedAlgorithm} />
              </div>
            )}
            
            {/* Visualization Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Array Size</span>
                  <span>{arraySize} elements</span>
                </div>
                <Slider
                  value={[arraySize]}
                  min={5}
                  max={100}
                  step={1}
                  onValueChange={handleArraySizeChange}
                  disabled={isSorting}
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Animation Speed</span>
                  <span>{Math.round(((510 - animationSpeed) / 5) * 10) / 10}x</span>
                </div>
                <Slider
                  value={[510 - animationSpeed]}
                  min={10}
                  max={500}
                  step={10}
                  onValueChange={handleSpeedChange}
                />
              </div>
            </div>
            
            {/* Array Visualization */}
            <div className="flex items-end justify-center h-64 mt-2 bg-muted/30 rounded-md p-4 overflow-hidden">
              {currentStepData.array.map((value, index) => (
                <div
                  key={index}
                  className={`array-bar ${getBarColor(index)} mx-[1px]`}
                  style={{
                    height: `${(value / maxValue) * 100}%`,
                    width: `${100 / arraySize - 0.5}%`,
                    minWidth: '2px',
                    maxWidth: '30px',
                    transition: 'height 0.2s ease, background-color 0.2s ease'
                  }}
                ></div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 bg-purple-500 rounded"></div>
                <span>Unsorted</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 bg-yellow-400 rounded"></div>
                <span>Comparing</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 bg-red-500 rounded"></div>
                <span>Swapping</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 bg-green-500 rounded"></div>
                <span>Sorted</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 bg-purple-dark rounded"></div>
                <span>Pivot (QuickSort)</span>
              </div>
            </div>
            
            {/* Progress Information */}
            <div className="text-center text-sm text-muted-foreground">
              Step: {currentStep} {sortingSteps.length > 0 ? `/ ${sortingSteps.length - 1}` : ''}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SortingVisualizer;
