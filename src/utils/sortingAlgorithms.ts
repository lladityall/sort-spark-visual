
export type SortingAlgorithm = 'bubble' | 'insertion' | 'selection' | 'merge' | 'quick';

export interface SortStep {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  pivot?: number;
}

// Helper function to create a step
const createStep = (
  array: number[],
  comparing: number[] = [],
  swapping: number[] = [],
  sorted: number[] = [],
  pivot?: number
): SortStep => {
  return {
    array: [...array],
    comparing: [...comparing],
    swapping: [...swapping],
    sorted: [...sorted],
    pivot
  };
};

// Bubble Sort
export const bubbleSort = (array: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...array];
  const n = arr.length;
  const sorted: number[] = [];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Mark elements being compared
      steps.push(createStep(arr, [j, j + 1], [], sorted));

      if (arr[j] > arr[j + 1]) {
        // Mark elements being swapped
        steps.push(createStep(arr, [], [j, j + 1], sorted));

        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        
        // Show array after swap
        steps.push(createStep(arr, [], [], sorted));
      }
    }
    // Mark element as sorted
    sorted.unshift(n - i - 1);
    steps.push(createStep(arr, [], [], sorted));
  }

  return steps;
};

// Insertion Sort
export const insertionSort = (array: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...array];
  const n = arr.length;
  const sorted: number[] = [0];

  steps.push(createStep(arr, [], [], sorted));

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    // Compare with each element on the left until finding correct position
    steps.push(createStep(arr, [i, j], [], sorted));

    while (j >= 0 && arr[j] > key) {
      // Mark elements being compared
      steps.push(createStep(arr, [i, j], [], sorted));
      
      // Mark elements being swapped
      steps.push(createStep(arr, [], [j, j + 1], sorted));
      
      // Move element
      arr[j + 1] = arr[j];
      j--;
      
      // Show array after move
      if (j >= 0) {
        steps.push(createStep(arr, [i, j], [], sorted));
      }
    }
    
    arr[j + 1] = key;
    
    // Mark element as sorted
    sorted.push(i);
    steps.push(createStep(arr, [], [], sorted));
  }

  return steps;
};

// Selection Sort
export const selectionSort = (array: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...array];
  const n = arr.length;
  const sorted: number[] = [];
  
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    
    for (let j = i + 1; j < n; j++) {
      // Mark elements being compared
      steps.push(createStep(arr, [minIdx, j], [], sorted));
      
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        // Show new minimum found
        steps.push(createStep(arr, [minIdx], [], sorted));
      }
    }
    
    if (minIdx !== i) {
      // Mark elements being swapped
      steps.push(createStep(arr, [], [i, minIdx], sorted));
      
      // Swap elements
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      
      // Show array after swap
      steps.push(createStep(arr, [], [], sorted));
    }
    
    // Mark element as sorted
    sorted.push(i);
    steps.push(createStep(arr, [], [], sorted));
  }
  
  // Mark last element as sorted
  sorted.push(n - 1);
  steps.push(createStep(arr, [], [], sorted));
  
  return steps;
};

// Merge Sort
export const mergeSort = (array: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...array];
  const sorted: number[] = [];
  
  const merge = (arr: number[], left: number, mid: number, right: number) => {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    
    const L = arr.slice(left, mid + 1);
    const R = arr.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2) {
      // Mark elements being compared
      steps.push(createStep(arr, [left + i, mid + 1 + j], [], sorted));
      
      if (L[i] <= R[j]) {
        // Mark element being placed
        steps.push(createStep(arr, [], [k], sorted));
        
        arr[k] = L[i];
        i++;
      } else {
        // Mark element being placed
        steps.push(createStep(arr, [], [k], sorted));
        
        arr[k] = R[j];
        j++;
      }
      k++;
      
      // Show array after placement
      steps.push(createStep(arr, [], [], sorted));
    }
    
    while (i < n1) {
      // Mark element being placed
      steps.push(createStep(arr, [], [k], sorted));
      
      arr[k] = L[i];
      i++;
      k++;
      
      // Show array after placement
      steps.push(createStep(arr, [], [], sorted));
    }
    
    while (j < n2) {
      // Mark element being placed
      steps.push(createStep(arr, [], [k], sorted));
      
      arr[k] = R[j];
      j++;
      k++;
      
      // Show array after placement
      steps.push(createStep(arr, [], [], sorted));
    }
    
    // Mark subarray as sorted
    for (let i = left; i <= right; i++) {
      if (!sorted.includes(i)) {
        sorted.push(i);
      }
    }
    steps.push(createStep(arr, [], [], sorted));
  };
  
  const mergeSortHelper = (arr: number[], left: number, right: number) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      
      mergeSortHelper(arr, left, mid);
      mergeSortHelper(arr, mid + 1, right);
      
      merge(arr, left, mid, right);
    } else if (left === right && !sorted.includes(left)) {
      // Single element is sorted
      sorted.push(left);
      steps.push(createStep(arr, [], [], sorted));
    }
  };
  
  mergeSortHelper(arr, 0, arr.length - 1);
  
  return steps;
};

// Quick Sort
export const quickSort = (array: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...array];
  const sorted: number[] = [];
  
  const partition = (arr: number[], low: number, high: number): number => {
    // Choose pivot as rightmost element
    const pivot = arr[high];
    steps.push(createStep(arr, [], [], sorted, high));
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      // Mark elements being compared with pivot
      steps.push(createStep(arr, [j, high], [], sorted, high));
      
      if (arr[j] < pivot) {
        i++;
        
        if (i !== j) {
          // Mark elements being swapped
          steps.push(createStep(arr, [], [i, j], sorted, high));
          
          // Swap elements
          [arr[i], arr[j]] = [arr[j], arr[i]];
          
          // Show array after swap
          steps.push(createStep(arr, [], [], sorted, high));
        }
      }
    }
    
    // Swap pivot to its final position
    if (i + 1 !== high) {
      // Mark elements being swapped
      steps.push(createStep(arr, [], [i + 1, high], sorted, high));
      
      // Swap elements
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      
      // Show array after swap
      steps.push(createStep(arr, [], [], sorted));
    }
    
    // Mark pivot as sorted
    sorted.push(i + 1);
    steps.push(createStep(arr, [], [], sorted));
    
    return i + 1;
  };
  
  const quickSortHelper = (arr: number[], low: number, high: number) => {
    if (low < high) {
      const pi = partition(arr, low, high);
      
      quickSortHelper(arr, low, pi - 1);
      quickSortHelper(arr, pi + 1, high);
    } else if (low === high && !sorted.includes(low)) {
      // Single element is sorted
      sorted.push(low);
      steps.push(createStep(arr, [], [], sorted));
    }
  };
  
  quickSortHelper(arr, 0, arr.length - 1);
  
  return steps;
};

// Get sorting algorithm function by name
export const getSortingAlgorithm = (algorithm: SortingAlgorithm) => {
  switch (algorithm) {
    case 'bubble':
      return bubbleSort;
    case 'insertion':
      return insertionSort;
    case 'selection':
      return selectionSort;
    case 'merge':
      return mergeSort;
    case 'quick':
      return quickSort;
    default:
      return bubbleSort;
  }
};

// Generate random array
export const generateRandomArray = (size: number, min: number, max: number): number[] => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};
