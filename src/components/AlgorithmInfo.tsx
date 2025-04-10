
import React from 'react';
import { SortingAlgorithm } from '@/utils/sortingAlgorithms';

interface AlgorithmInfoProps {
  algorithm: SortingAlgorithm;
}

const algorithmInfo = {
  bubble: {
    name: 'Bubble Sort',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    description: 'Bubble Sort works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order. The pass through the list is repeated until no swaps are needed, which means the list is sorted.',
    useCases: 'Educational purposes and simple datasets. Not efficient for large datasets.'
  },
  insertion: {
    name: 'Insertion Sort',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    description: 'Insertion Sort builds the sorted array one item at a time. It takes an element from the unsorted part and inserts it into its correct position in the sorted part of the array.',
    useCases: 'Small datasets or nearly sorted arrays. Used as part of more complex algorithms.'
  },
  selection: {
    name: 'Selection Sort',
    timeComplexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    description: 'Selection Sort works by dividing the input into a sorted and an unsorted region. It repeatedly selects the smallest element from the unsorted region and moves it to the end of the sorted region.',
    useCases: 'Simple implementations and educational purposes. Performs well on small lists.'
  },
  merge: {
    name: 'Merge Sort',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(n)',
    description: 'Merge Sort uses the divide and conquer approach. It divides the array into two halves, sorts them recursively, and then merges the sorted halves to produce a sorted array.',
    useCases: 'General-purpose sorting. Efficient for large datasets and is often used for external sorting.'
  },
  quick: {
    name: 'Quick Sort',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(log n)',
    description: 'Quick Sort also uses divide and conquer. It selects a "pivot" element and partitions the array around the pivot. Elements smaller than the pivot go to one side, and elements greater go to the other side.',
    useCases: 'General-purpose sorting. Very efficient for in-memory sorting and is widely used in practice.'
  }
};

const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({ algorithm }) => {
  const info = algorithmInfo[algorithm];
  
  const colors = {
    bubble: 'text-algos-bubble',
    insertion: 'text-algos-insertion',
    selection: 'text-algos-selection',
    merge: 'text-algos-merge',
    quick: 'text-algos-quick'
  };
  
  return (
    <div className="flex flex-col gap-3">
      <h3 className={`text-lg font-semibold ${colors[algorithm]}`}>{info.name}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="bg-background/40 p-3 rounded-md">
          <h4 className="font-medium mb-1">Time Complexity</h4>
          <ul className="space-y-1">
            <li><span className="text-green-500 font-medium">Best:</span> {info.timeComplexity.best}</li>
            <li><span className="text-yellow-500 font-medium">Average:</span> {info.timeComplexity.average}</li>
            <li><span className="text-red-500 font-medium">Worst:</span> {info.timeComplexity.worst}</li>
          </ul>
        </div>
        
        <div className="bg-background/40 p-3 rounded-md md:col-span-2">
          <h4 className="font-medium mb-1">Description</h4>
          <p className="text-muted-foreground">{info.description}</p>
        </div>
        
        <div className="bg-background/40 p-3 rounded-md">
          <h4 className="font-medium mb-1">Space Complexity</h4>
          <p className="text-muted-foreground">{info.spaceComplexity}</p>
        </div>
        
        <div className="bg-background/40 p-3 rounded-md md:col-span-2">
          <h4 className="font-medium mb-1">Use Cases</h4>
          <p className="text-muted-foreground">{info.useCases}</p>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmInfo;
