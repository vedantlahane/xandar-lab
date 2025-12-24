export type Platform = 'LeetCode' | 'GeeksForGeeks' | 'InterviewBit' | 'LintCode' | 'CodeForces' | 'SPOJ' | 'CSES' | 'HackerEarth' | 'Other';

export interface DSAProblem {
  id: string;
  title: string;
  url: string;
  platform: Platform;
  tags?: string[];
  description: string; // Brief conceptual summary of the problem
  isCompleted?: boolean;
}

export interface DSATopic {
  topicName: string;
  problems: DSAProblem[];
}

export const SHEET: DSATopic[] = [
  {
    topicName: "Time Complexity",
    problems: [
      { 
        id: "tc-1", 
        title: "Time Complexity Analysis Practice", 
        url: "https://www.geeksforgeeks.org/practice-questions-time-complexity-analysis/", 
        platform: "GeeksForGeeks",
        tags: ["Theory", "Analysis"],
        description: "Analyze various code snippets to determine their Big-O, Big-Theta, and Big-Omega complexity."
      },
      { 
        id: "tc-2", 
        title: "Time Complexity Problems", 
        url: "https://www.interviewbit.com/courses/programming/time-complexity#problems", 
        platform: "InterviewBit",
        tags: ["Theory", "Math"],
        description: "Solve conceptual problems involving loop iterations, recursive calls, and logarithmic growth."
      },
    ]
  },
  {
    topicName: "Array and 2D Array",
    problems: [
      { 
        id: "arr-1", 
        title: "Kadane's Algorithm", 
        url: "https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1", 
        platform: "GeeksForGeeks",
        tags: ["Dynamic Programming", "Easy"],
        description: "Find the contiguous subarray with the maximum sum in a 1D array."
      },
      { 
        id: "arr-2", 
        title: "Pascal's Triangle", 
        url: "https://leetcode.com/problems/pascals-triangle/description/", 
        platform: "LeetCode",
        tags: ["Matrix", "Easy"],
        description: "Generate the rows of Pascal's triangle where each number is the sum of the two above it."
      },
      { 
        id: "arr-3", 
        title: "Majority Element", 
        url: "https://leetcode.com/problems/majority-element/description/", 
        platform: "LeetCode", 
        tags: ["Voting-Algo", "Boyer-Moore", "Medium"],
        description: "Find the element that appears more than floor(n/2) times using constant space."
      },
      { 
        id: "arr-4", 
        title: "Zigzag Conversion", 
        url: "https://leetcode.com/problems/zigzag-conversion/description/", 
        platform: "LeetCode", 
        tags: ["String-Simulation", "Medium"],
        description: "Write a string in a zigzag pattern on a given number of rows and read it line by line."
      },
      { 
        id: "arr-5", 
        title: "Max Consecutive Ones", 
        url: "https://leetcode.com/problems/max-consecutive-ones/", 
        platform: "LeetCode",
        tags: ["Easy", "Array"],
        description: "Find the maximum number of consecutive 1s in a binary array."
      },
      { 
        id: "arr-6", 
        title: "Repetitions", 
        url: "https://cses.fi/problemset/task/1069", 
        platform: "CSES",
        tags: ["String", "Greedy"],
        description: "Find the longest substring containing only one type of character in a DNA sequence."
      },
      { 
        id: "arr-7", 
        title: "Friends Of Appropriate Ages", 
        url: "https://leetcode.com/problems/friends-of-appropriate-ages/", 
        platform: "LeetCode", 
        tags: ["Frequency Array", "Binary Search", "Medium"],
        description: "Calculate the total number of friend requests made based on age constraints."
      },
      { 
        id: "arr-8", 
        title: "Valid Palindrome II", 
        url: "https://leetcode.com/problems/valid-palindrome-ii/description/", 
        platform: "LeetCode",
        tags: ["Two Pointers", "Easy"],
        description: "Check if a string can become a palindrome after deleting at most one character."
      },
      { 
        id: "arr-9", 
        title: "Range Sum Query Immutable", 
        url: "https://leetcode.com/problems/range-sum-query-immutable/", 
        platform: "LeetCode",
        tags: ["Prefix Sum", "Easy"],
        description: "Precompute sums to answer range sum queries in O(1) time."
      },
      { 
        id: "arr-10", 
        title: "Two Sum", 
        url: "https://leetcode.com/problems/two-sum/", 
        platform: "LeetCode",
        tags: ["Hash Map", "Easy"],
        description: "Find indices of two numbers that add up to a specific target."
      },
      { 
        id: "arr-11", 
        title: "Two Sum II (Sorted)", 
        url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", 
        platform: "LeetCode",
        tags: ["Two Pointers", "Binary Search", "Easy"],
        description: "Find indices of two numbers in a sorted array that sum to a target."
      },
      { 
        id: "arr-12", 
        title: "3Sum", 
        url: "https://leetcode.com/problems/3sum/description/", 
        platform: "LeetCode",
        tags: ["Two Pointers", "Sorting", "Medium"],
        description: "Find all unique triplets in the array that sum up to zero."
      },
      { 
        id: "arr-13", 
        title: "4Sum", 
        url: "https://leetcode.com/problems/4sum/description/", 
        platform: "LeetCode",
        tags: ["Two Pointers", "Sorting", "Medium"],
        description: "Find all unique quadruplets in the array that sum up to a given target."
      },
      { 
        id: "arr-14", 
        title: "LintCode 3691", 
        url: "https://www.lintcode.com/problem/3691/", 
        platform: "LintCode",
        tags: ["Advanced", "Array"],
        description: "Solve the specific multi-constraint array problem from the LintCode platform."
      },
      { 
        id: "arr-15", 
        title: "Sort Colors", 
        url: "https://leetcode.com/problems/sort-colors/", 
        platform: "LeetCode",
        tags: ["Dutch National Flag", "Two Pointers", "Medium"],
        description: "Sort an array with 0s, 1s, and 2s in-place (Three-way partitioning)."
      },
      { 
        id: "arr-16", 
        title: "First Element Occurring K Times", 
        url: "https://www.geeksforgeeks.org/first-element-occurring-k-times-array/", 
        platform: "GeeksForGeeks",
        tags: ["Hash Map", "Easy"],
        description: "Identify the first element that reaches a frequency of K while traversing."
      },
      { 
        id: "arr-17", 
        title: "Max Distance Between Same Elements", 
        url: "https://practice.geeksforgeeks.org/problems/max-distance-between-same-elements/1", 
        platform: "GeeksForGeeks",
        tags: ["Hash Map", "Easy"],
        description: "Find the maximum distance between two occurrences of the same element."
      },
      { 
        id: "arr-18", 
        title: "Maximum Difference Between Two Elements", 
        url: "https://www.geeksforgeeks.org/maximum-difference-between-two-elements/", 
        platform: "GeeksForGeeks",
        tags: ["Greedy", "Easy"],
        description: "Find max (arr[j] - arr[i]) such that j > i."
      },
      { 
        id: "arr-19", 
        title: "In First But Second", 
        url: "https://practice.geeksforgeeks.org/problems/in-first-but-second5423/1", 
        platform: "GeeksForGeeks",
        tags: ["Hash Set", "Easy"],
        description: "Find elements present in the first array but not in the second."
      },
      { 
        id: "arr-20", 
        title: "Maximum Product Subarray", 
        url: "https://leetcode.com/problems/maximum-product-subarray/", 
        platform: "LeetCode",
        tags: ["Dynamic Programming", "Medium"],
        description: "Find the contiguous subarray with the largest product, handling negative numbers and zeros."
      },
      { 
        id: "arr-21", 
        title: "Move Zeroes", 
        url: "https://leetcode.com/problems/move-zeroes/", 
        platform: "LeetCode",
        tags: ["Two Pointers", "Easy"],
        description: "Shift all 0s to the end of the array while maintaining the relative order of non-zero elements."
      },
      { 
        id: "arr-22", 
        title: "Best Time to Buy and Sell Stock", 
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", 
        platform: "LeetCode",
        tags: ["Greedy", "Easy"],
        description: "Maximize profit by choosing a single day to buy and a different day to sell."
      },
      { 
        id: "arr-23", 
        title: "Find Pivot Index", 
        url: "https://leetcode.com/problems/find-pivot-index/description/", 
        platform: "LeetCode",
        tags: ["Prefix Sum", "Easy"],
        description: "Find the index where the sum of elements to the left equals the sum of elements to the right."
      },
      { 
        id: "arr-24", 
        title: "Running Sum of 1d Array", 
        url: "https://leetcode.com/problems/running-sum-of-1d-array/", 
        platform: "LeetCode",
        tags: ["Prefix Sum", "Easy"],
        description: "Return an array where each element at index i is the sum of array[0...i]."
      },
      { 
        id: "arr-25", 
        title: "Longest Distinct Characters In String", 
        url: "https://www.geeksforgeeks.org/problems/longest-distinct-characters-in-string5848/1", 
        platform: "GeeksForGeeks",
        tags: ["Sliding Window", "Medium"],
        description: "Find the length of the longest substring with all unique characters."
      },
      { 
        id: "arr-26", 
        title: "Union Of Two Sorted Arrays", 
        url: "https://www.geeksforgeeks.org/problems/union-of-two-sorted-arrays-1587115621/1", 
        platform: "GeeksForGeeks", 
        tags: ["Two Pointers", "Merge", "Medium"],
        description: "Merge two sorted arrays into one unique union array using the two-pointer approach."
      },
      { 
        id: "arr-27", 
        title: "Rotate Array", 
        url: "https://leetcode.com/problems/rotate-array/description/", 
        platform: "LeetCode", 
        tags: ["Two Pointers", "In-place", "Medium"],
        description: "Rotate the array to the right by k steps using the triple-reverse trick."
      },
      { 
        id: "arr-28", 
        title: "Rearrange Array Elements By Sign", 
        url: "https://leetcode.com/problems/rearrange-array-elements-by-sign/description/", 
        platform: "LeetCode",
        tags: ["Two Pointers", "Medium"],
        description: "Rearrange the array into alternating positive and negative values while preserving relative order."
      },
      { 
        id: "arr-29", 
        title: "Next Permutation", 
        url: "https://leetcode.com/problems/next-permutation/description/", 
        platform: "LeetCode", 
        tags: ["Lexicographical", "Imp", "Medium"],
        description: "Find the next lexicographically greater permutation of numbers."
      },
      { 
        id: "arr-30", 
        title: "Leaders In An Array", 
        url: "https://www.geeksforgeeks.org/problems/leaders-in-an-array-1587115620/1", 
        platform: "GeeksForGeeks",
        tags: ["Array", "Easy"],
        description: "Find all elements that are greater than all elements to their right."
      },
      { 
        id: "arr-31", 
        title: "Set Matrix Zeroes", 
        url: "https://leetcode.com/problems/set-matrix-zeroes/description/", 
        platform: "LeetCode",
        tags: ["Matrix", "In-place", "Medium"],
        description: "If an element in an mxn matrix is 0, set its entire row and column to 0."
      },
      { 
        id: "arr-32", 
        title: "Rotate Image", 
        url: "https://leetcode.com/problems/rotate-image/description/", 
        platform: "LeetCode",
        tags: ["Matrix", "Math", "Medium"],
        description: "Rotate a square matrix 90 degrees clockwise in-place using Transpose + Reverse."
      },
      { 
        id: "arr-33", 
        title: "Missing Number", 
        url: "https://leetcode.com/problems/missing-number/description/", 
        platform: "LeetCode",
        tags: ["Bit Manipulation", "Math", "Easy"],
        description: "Find the one missing number in the range [0, n] using XOR or Sum formula."
      },
      { 
        id: "arr-34", 
        title: "Subarrays Size K Avg >= Threshold", 
        url: "https://leetcode.com/problems/number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold/description/", 
        platform: "LeetCode",
        tags: ["Sliding Window", "Medium"],
        description: "Count subarrays of length k whose sum exceeds (threshold * k)."
      },
      { 
        id: "arr-35", 
        title: "Maximal Rectangle", 
        url: "https://leetcode.com/problems/maximal-rectangle/description/", 
        platform: "LeetCode",
        tags: ["Monotonic Stack", "Matrix", "Hard"],
        description: "Find the largest rectangle containing only 1s in a binary matrix."
      },
      { 
        id: "arr-36", 
        title: "Greatest Sum Divisible By Three", 
        url: "https://leetcode.com/problems/greatest-sum-divisible-by-three/description/", 
        platform: "LeetCode",
        tags: ["Greedy", "DP", "Medium"],
        description: "Find the maximum sum of elements such that the sum is divisible by 3."
      },
      { 
        id: "arr-37", 
        title: "First Missing Positive", 
        url: "https://leetcode.com/problems/first-missing-positive/description/", 
        platform: "LeetCode",
        tags: ["Cyclic Sort", "Hard"],
        description: "Find the smallest positive integer missing from an unsorted array in O(n) time and O(1) space."
      },
      { 
        id: "arr-38", 
        title: "Find All Duplicates", 
        url: "https://leetcode.com/problems/find-all-duplicates-in-an-array/description/", 
        platform: "LeetCode",
        tags: ["In-place", "Medium"],
        description: "Find all elements appearing twice using the array indices as hash markers."
      },
      { 
        id: "arr-39", 
        title: "Find All Numbers Disappeared", 
        url: "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/description/", 
        platform: "LeetCode",
        tags: ["In-place", "Easy"],
        description: "Find all integers in [1, n] that do not appear in the array."
      },
      { 
        id: "arr-40", 
        title: "Container With Most Water", 
        url: "https://leetcode.com/problems/container-with-most-water/description/", 
        platform: "LeetCode",
        tags: ["Two Pointers", "Medium"],
        description: "Find two lines that together with the x-axis form a container containing the most water."
      },
      { 
        id: "arr-41", 
        title: "Product of Array Except Self", 
        url: "https://leetcode.com/problems/product-of-array-except-self/description/", 
        platform: "LeetCode",
        tags: ["Prefix Product", "Medium"],
        description: "Construct an array where each element is the product of all others without using division."
      },
      { 
        id: "arr-42", 
        title: "Queries On A Matrix", 
        url: "https://www.geeksforgeeks.org/problems/queries-on-a-matrix0443/1", 
        platform: "GeeksForGeeks",
        tags: ["Difference Array", "2D-Prefix Sum", "Hard"],
        description: "Apply multiple sub-matrix increment queries efficiently."
      },
      { 
        id: "arr-43", 
        title: "Trapping Rain Water", 
        url: "https://leetcode.com/problems/trapping-rain-water/", 
        platform: "LeetCode",
        tags: ["Two Pointers", "Monotonic Stack", "Hard"],
        description: "Calculate how much water can be trapped between bars after raining."
      },
      { 
        id: "arr-44", 
        title: "Maximum Sum Circular Subarray", 
        url: "https://leetcode.com/problems/maximum-sum-circular-subarray/description/", 
        platform: "LeetCode",
        tags: ["Kadane", "Medium"],
        description: "Find the maximum sum of a non-empty subarray in a circular array."
      }
    ]
  },
  {
    topicName: "Recursion And Backtracking",
    problems: [
      { 
        id: "rec-1", 
        title: "Power of Four", 
        url: "https://leetcode.com/problems/power-of-four/description/", 
        platform: "LeetCode",
        tags: ["Recursion", "Math", "Easy"],
        description: "Check if an integer is a power of four without using loops."
      },
      { 
        id: "rec-2", 
        title: "Power of Two", 
        url: "https://leetcode.com/problems/power-of-two/description/", 
        platform: "LeetCode",
        tags: ["Recursion", "Bit Manipulation", "Easy"],
        description: "Determine if a number is a power of two."
      },
      { 
        id: "rec-3", 
        title: "Pow(x, n)", 
        url: "https://leetcode.com/problems/powx-n/description/", 
        platform: "LeetCode",
        tags: ["Binary Exponentiation", "Medium"],
        description: "Implement pow(x, n) efficiently using the divide and conquer approach."
      },
      { 
        id: "rec-4", 
        title: "Valid Palindrome", 
        url: "https://leetcode.com/problems/valid-palindrome/description/", 
        platform: "LeetCode",
        tags: ["Recursion", "Two Pointers", "Easy"],
        description: "Verify if a string is a palindrome, considering only alphanumeric characters."
      },
      { 
        id: "rec-5", 
        title: "Combination Sum", 
        url: "https://leetcode.com/problems/combination-sum/", 
        platform: "LeetCode",
        tags: ["Backtracking", "Medium"],
        description: "Find all unique combinations of candidates that sum up to a target (elements can be reused)."
      },
      { 
        id: "rec-6", 
        title: "Generate Parentheses", 
        url: "https://leetcode.com/problems/generate-parentheses/", 
        platform: "LeetCode",
        tags: ["Backtracking", "Medium"],
        description: "Generate all combinations of n pairs of well-formed parentheses."
      },
      { 
        id: "rec-7", 
        title: "Subset Sums", 
        url: "https://practice.geeksforgeeks.org/problems/subset-sums2234/1", 
        platform: "GeeksForGeeks",
        tags: ["Recursion", "Medium"],
        description: "Calculate the sum of all possible subsets of a given set."
      },
      { 
        id: "rec-8", 
        title: "Combination Sum II", 
        url: "https://leetcode.com/problems/combination-sum-ii/description/", 
        platform: "LeetCode",
        tags: ["Backtracking", "Medium"],
        description: "Find combinations summing to target where each number is used only once."
      },
      { 
        id: "rec-9", 
        title: "Combination Sum III", 
        url: "https://leetcode.com/problems/combination-sum-iii/description/", 
        platform: "LeetCode",
        tags: ["Backtracking", "Medium"],
        description: "Find combinations of k numbers from 1-9 that sum to n."
      },
      { 
        id: "rec-10", 
        title: "Tower Of Hanoi", 
        url: "https://www.geeksforgeeks.org/problems/tower-of-hanoi-1587115621/1", 
        platform: "GeeksForGeeks",
        tags: ["Recursion", "Classic", "Medium"],
        description: "Solve the classic mathematical puzzle of moving disks between three rods."
      },
      { 
        id: "rec-11", 
        title: "Permutations", 
        url: "https://leetcode.com/problems/permutations/", 
        platform: "LeetCode", 
        tags: ["Backtracking", "Medium"],
        description: "Return all possible permutations of an array of distinct integers."
      },
      { 
        id: "rec-12", 
        title: "Subsets", 
        url: "https://leetcode.com/problems/subsets/", 
        platform: "LeetCode",
        tags: ["Backtracking", "Power Set", "Medium"],
        description: "Generate the power set (all possible subsets) of a given array."
      },
      { 
        id: "rec-13", 
        title: "Letter Combinations of a Phone Number", 
        url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/", 
        platform: "LeetCode",
        tags: ["Backtracking", "Medium"],
        description: "Return all possible letter combinations that the digits of a phone number could represent."
      },
      { 
        id: "rec-14", 
        title: "Sum of All Subset XOR Totals", 
        url: "https://leetcode.com/problems/sum-of-all-subset-xor-totals/", 
        platform: "LeetCode",
        tags: ["Backtracking", "Bit Manipulation", "Easy"],
        description: "Find the sum of XOR totals for every possible subset."
      },
      { 
        id: "rec-15", 
        title: "Combination Sum IV", 
        url: "https://leetcode.com/problems/combination-sum-iv/description/", 
        platform: "LeetCode", 
        tags: ["DP", "Recursion", "Medium"],
        description: "Find the number of ways to sum up to target using given integers (order matters)."
      },
      { 
        id: "rec-16", 
        title: "Sudoku Solver", 
        url: "https://leetcode.com/problems/sudoku-solver/", 
        platform: "LeetCode", 
        tags: ["Backtracking", "Matrix", "Hard"],
        description: "Solve a Sudoku puzzle by filling empty cells."
      },
      { 
        id: "rec-17", 
        title: "Find the Winner of the Circular Game", 
        url: "https://leetcode.com/problems/find-the-winner-of-the-circular-game/description/", 
        platform: "LeetCode",
        tags: ["Recursion", "Josephus Problem", "Medium"],
        description: "Identify the last person remaining in a circle after eliminating every k-th person."
      },
      { 
        id: "rec-18", 
        title: "N-Queens", 
        url: "https://leetcode.com/problems/n-queens/description/", 
        platform: "LeetCode",
        tags: ["Backtracking", "Hard"],
        description: "Place n queens on an nxn chessboard such that no two queens attack each other."
      },
      { 
        id: "rec-19", 
        title: "Palindrome Partitioning", 
        url: "https://leetcode.com/problems/palindrome-partitioning/description/", 
        platform: "LeetCode",
        tags: ["Backtracking", "Dynamic Programming", "Medium"],
        description: "Partition a string such that every substring of the partition is a palindrome."
      },
      { 
        id: "rec-20", 
        title: "Rat in a Maze", 
        url: "https://www.geeksforgeeks.org/problems/rat-in-a-maze-problem/1", 
        platform: "GeeksForGeeks",
        tags: ["Backtracking", "Medium"],
        description: "Find all possible paths for a rat to reach the destination in a grid."
      },
      { 
        id: "rec-21", 
        title: "Word Search", 
        url: "https://leetcode.com/problems/word-search/description/", 
        platform: "LeetCode",
        tags: ["Backtracking", "DFS", "Medium"],
        description: "Check if a word exists in a grid of characters by following adjacent cells."
      },
      { 
        id: "rec-22", 
        title: "Subsets II", 
        url: "https://leetcode.com/problems/subsets-ii/description/", 
        platform: "LeetCode",
        tags: ["Backtracking", "Medium"],
        description: "Generate all subsets from a list that may contain duplicates, ensuring the result set is unique."
      },
      { 
        id: "rec-23", 
        title: "N-Queens II", 
        url: "https://leetcode.com/problems/n-queens-ii/description/", 
        platform: "LeetCode",
        tags: ["Backtracking", "Hard"],
        description: "Return the total number of distinct solutions to the N-Queens puzzle."
      },
      { 
        id: "rec-24", 
        title: "Count Good Numbers", 
        url: "https://leetcode.com/problems/count-good-numbers/", 
        platform: "LeetCode",
        tags: ["Recursion", "Modular Exponentiation", "Medium"],
        description: "Count digit strings where even indices have even digits and odd indices have prime digits."
      },
      { 
        id: "rec-25", 
        title: "Sort a Stack", 
        url: "https://www.geeksforgeeks.org/problems/sort-a-stack/1", 
        platform: "GeeksForGeeks",
        tags: ["Recursion", "Stack", "Medium"],
        description: "Sort a stack using recursion only (no loops)."
      },
      { 
        id: "rec-26", 
        title: "String to Integer (atoi)", 
        url: "https://leetcode.com/problems/string-to-integer-atoi/description/", 
        platform: "LeetCode", 
        tags: ["Simulation", "Medium"],
        description: "Convert a string to a 32-bit signed integer, handling whitespace and overflow."
      },
      { 
        id: "rec-27", 
        title: "All Unique Permutations", 
        url: "https://www.interviewbit.com/problems/all-unique-permutations/", 
        platform: "InterviewBit",
        tags: ["Backtracking", "Medium"],
        description: "Find all unique permutations of a list that contains duplicate elements."
      },
      { 
        id: "rec-28", 
        title: "Kth Permutation Sequence", 
        url: "https://www.interviewbit.com/problems/kth-permutation-sequence/", 
        platform: "InterviewBit",
        tags: ["Math", "Recursion", "Hard"],
        description: "Directly compute the k-th lexicographical permutation of n elements."
      },
      { 
        id: "rec-29", 
        title: "Restore IP Addresses", 
        url: "https://leetcode.com/problems/restore-ip-addresses/description/", 
        platform: "LeetCode",
        tags: ["Backtracking", "Medium"],
        description: "Generate all possible valid IP addresses that can be formed by inserting dots into a string."
      },
      { 
        id: "rec-30", 
        title: "Word Break II", 
        url: "https://leetcode.com/problems/word-break-ii/description/", 
        platform: "LeetCode",
        tags: ["Backtracking", "DP", "Hard"],
        description: "Find all possible ways to segment a string into words from a given dictionary."
      },
      { 
        id: "rec-31", 
        title: "Count Numbers With Unique Digits", 
        url: "https://leetcode.com/problems/count-numbers-with-unique-digits/", 
        platform: "LeetCode",
        tags: ["Recursion", "Math", "Medium"],
        description: "Count non-negative integers x in range 0 <= x < 10^n that have all unique digits."
      }
    ]
  },
  {
    topicName: "Sorting",
    problems: [
      { 
        id: "sort-1", 
        title: "Squares of a Sorted Array", 
        url: "https://leetcode.com/problems/squares-of-a-sorted-array/description/", 
        platform: "LeetCode",
        tags: ["Two Pointers", "Sorting", "Easy"],
        description: "Given a sorted array of negative/positive numbers, return a sorted array of their squares."
      },
      { 
        id: "sort-2", 
        title: "Merge Sorted Array", 
        url: "https://leetcode.com/problems/merge-sorted-array/", 
        platform: "LeetCode",
        tags: ["Two Pointers", "Easy"],
        description: "Merge two sorted arrays into one in-place by working from the end."
      },
      { 
        id: "sort-3", 
        title: "Merge Intervals", 
        url: "https://leetcode.com/problems/merge-intervals/description/", 
        platform: "LeetCode",
        tags: ["Sorting", "Intervals", "Medium"],
        description: "Combine all overlapping intervals into a single interval covering the same range."
      },
      { 
        id: "sort-4", 
        title: "Sort Characters By Frequency", 
        url: "https://leetcode.com/problems/sort-characters-by-frequency/description/", 
        platform: "LeetCode",
        tags: ["Hash Map", "Sorting", "Medium"],
        description: "Rearrange characters in a string based on descending frequency."
      },
      { 
        id: "sort-5", 
        title: "Largest Number", 
        url: "https://leetcode.com/problems/largest-number/description/", 
        platform: "LeetCode",
        tags: ["Sorting", "Custom Comparator", "Medium"],
        description: "Arrange an array of numbers to form the largest possible number string."
      },
      { 
        id: "sort-6", 
        title: "How Many Numbers Are Smaller", 
        url: "https://leetcode.com/problems/how-many-numbers-are-smaller-than-the-current-number/", 
        platform: "LeetCode",
        tags: ["Counting Sort", "Hash Map", "Easy"],
        description: "For each element, find how many other elements in the array are smaller."
      },
      { 
        id: "sort-7", 
        title: "Sort an Array", 
        url: "https://leetcode.com/problems/sort-an-array/description/", 
        platform: "LeetCode",
        tags: ["Merge Sort", "Quick Sort", "Medium"],
        description: "Implement an efficient sorting algorithm like Merge Sort or Heap Sort."
      },
      { 
        id: "sort-8", 
        title: "Inversion of Array", 
        url: "https://www.geeksforgeeks.org/problems/inversion-of-array-1587115620/1", 
        platform: "GeeksForGeeks",
        tags: ["Merge Sort", "Hard"],
        description: "Count how many pairs (i, j) exist such that i < j and arr[i] > arr[j]."
      },
      { 
        id: "sort-9", 
        title: "Kth Largest Element", 
        url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", 
        platform: "LeetCode",
        tags: ["Quick Select", "Heap", "Medium"],
        description: "Find the k-th largest element using Quick Select or a Max-Heap."
      },
      { 
        id: "sort-10", 
        title: "Rotate Array by N Elements", 
        url: "https://practice.geeksforgeeks.org/problems/rotate-array-by-n-elements-1587115621/1", 
        platform: "GeeksForGeeks",
        tags: ["Array", "Easy"],
        description: "Shift array elements to the left by n positions."
      },
      { 
        id: "sort-11", 
        title: "Reverse Pairs", 
        url: "https://leetcode.com/problems/reverse-pairs/description/", 
        platform: "LeetCode",
        tags: ["Merge Sort", "Segment Tree", "Hard"],
        description: "Count pairs (i, j) such that i < j and arr[i] > 2 * arr[j]."
      },
      { 
        id: "sort-12", 
        title: "Largest Number Variation", 
        url: "https://codeforces.com/problemset/problem/632/C", 
        platform: "CodeForces",
        tags: ["Custom Comparator", "String"],
        description: "Sort a set of strings so that their concatenation results in the lexicographically smallest string."
      }
    ]
  },
  {
    topicName: "Linked List",
    problems: [
      { 
        id: "ll-1", 
        title: "Linked List Insertion", 
        url: "https://practice.geeksforgeeks.org/problems/linked-list-insertion-1587115620/1", 
        platform: "GeeksForGeeks",
        tags: ["Singly Linked List", "Easy"],
        description: "Perform insertion at the beginning and the end of a linked list."
      },
      { 
        id: "ll-2", 
        title: "Count Nodes of Linked List", 
        url: "https://www.geeksforgeeks.org/problems/count-nodes-of-linked-list/1", 
        platform: "GeeksForGeeks",
        tags: ["Easy", "Traversal"],
        description: "Count the total number of elements in a singly linked list."
      },
      { 
        id: "ll-3", 
        title: "Middle of the Linked List", 
        url: "https://leetcode.com/problems/middle-of-the-linked-list/", 
        platform: "LeetCode",
        tags: ["Fast & Slow Pointer", "Easy"],
        description: "Find the central node using two pointers (one moving twice as fast)."
      },
      { 
        id: "ll-4", 
        title: "Reverse Linked List", 
        url: "https://leetcode.com/problems/reverse-linked-list/", 
        platform: "LeetCode",
        tags: ["Iterative", "Recursive", "Easy"],
        description: "Flip the direction of the next pointers to reverse the list."
      },
      { 
        id: "ll-5", 
        title: "Remove Nth Node From End", 
        url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", 
        platform: "LeetCode",
        tags: ["Two Pointers", "Medium"],
        description: "Find the node at a specific distance from the end and delete it in one pass."
      },
      { 
        id: "ll-6", 
        title: "Delete Node in a Linked List", 
        url: "https://leetcode.com/problems/delete-node-in-a-linked-list/", 
        platform: "LeetCode",
        tags: ["Trick", "Easy"],
        description: "Delete a node without access to the head (copy data from the next node)."
      },
      { 
        id: "ll-7", 
        title: "Linked List Cycle", 
        url: "https://leetcode.com/problems/linked-list-cycle/", 
        platform: "LeetCode",
        tags: ["Floyd's Cycle Finding", "Easy"],
        description: "Detect if a linked list contains a loop."
      },
      { 
        id: "ll-8", 
        title: "Linked List Cycle II", 
        url: "https://leetcode.com/problems/linked-list-cycle-ii/", 
        platform: "LeetCode",
        tags: ["Two Pointers", "Medium"],
        description: "Find the exact node where the cycle begins in a linked list."
      },
      { 
        id: "ll-9", 
        title: "Add Two Numbers", 
        url: "https://practice.geeksforgeeks.org/problems/add-two-numbers-represented-by-linked-lists/1", 
        platform: "GeeksForGeeks",
        tags: ["Math", "Medium"],
        description: "Sum two numbers represented as reversed linked lists."
      },
      { 
        id: "ll-10", 
        title: "Merge Two Sorted Lists", 
        url: "https://leetcode.com/problems/merge-two-sorted-lists/", 
        platform: "LeetCode",
        tags: ["Recursion", "Two Pointers", "Easy"],
        description: "Splice together nodes of two sorted lists to form a single sorted list."
      },
      { 
        id: "ll-11", 
        title: "Palindrome Linked List", 
        url: "https://leetcode.com/problems/palindrome-linked-list/", 
        platform: "LeetCode",
        tags: ["Fast & Slow Pointer", "Reverse", "Easy"],
        description: "Determine if a list reads the same forward and backward using O(1) extra space."
      },
      { 
        id: "ll-12", 
        title: "Reorder List", 
        url: "https://leetcode.com/problems/reorder-list/", 
        platform: "LeetCode",
        tags: ["Two Pointers", "Stack", "Medium"],
        description: "Reorder list L0 → Ln → L1 → Ln-1..."
      },
      { 
        id: "ll-13", 
        title: "Add Two Numbers II", 
        url: "https://leetcode.com/problems/add-two-numbers-ii/", 
        platform: "LeetCode",
        tags: ["Stack", "Math", "Medium"],
        description: "Sum numbers represented as linked lists where the most significant digit comes first."
      },
      { 
        id: "ll-14", 
        title: "Intersection of Two Linked Lists", 
        url: "https://leetcode.com/problems/intersection-of-two-linked-lists", 
        platform: "LeetCode",
        tags: ["Two Pointers", "Easy"],
        description: "Find the node where two singly linked lists merge."
      },
      { 
        id: "ll-15", 
        title: "Remove Duplicates from Sorted List", 
        url: "https://www.geeksforgeeks.org/remove-duplicates-from-a-sorted-linked-list/", 
        platform: "GeeksForGeeks",
        tags: ["Two Pointers", "Easy"],
        description: "Iterate through the sorted list and skip nodes with identical values."
      },
      { 
        id: "ll-16", 
        title: "Swap Nodes in Pairs", 
        url: "https://leetcode.com/problems/swap-nodes-in-pairs/", 
        platform: "LeetCode",
        tags: ["Recursion", "Iterative", "Medium"],
        description: "Swap every two adjacent nodes in the linked list."
      },
      { 
        id: "ll-17", 
        title: "Odd Even Linked List", 
        url: "https://leetcode.com/problems/odd-even-linked-list/", 
        platform: "LeetCode",
        tags: ["Two Pointers", "Medium"],
        description: "Group all odd-indexed nodes together followed by even-indexed nodes."
      },
      { 
        id: "ll-18", 
        title: "Sort List", 
        url: "https://leetcode.com/problems/sort-list/", 
        platform: "LeetCode", 
        tags: ["Merge Sort", "Divide & Conquer", "Medium"],
        description: "Sort the linked list in O(n log n) time using Merge Sort."
      },
      { 
        id: "ll-19", 
        title: "Flattening a Linked List", 
        url: "https://practice.geeksforgeeks.org/problems/flattening-a-linked-list/1", 
        platform: "GeeksForGeeks",
        tags: ["Merge", "Recursion", "Medium"],
        description: "Flatten a multi-level linked list where nodes also have a child/bottom pointer."
      },
      { 
        id: "ll-20", 
        title: "Reverse Nodes in k-Group", 
        url: "https://leetcode.com/problems/reverse-nodes-in-k-group/", 
        platform: "LeetCode",
        tags: ["Recursion", "Hard"],
        description: "Reverse nodes of a linked list k at a time."
      },
      { 
        id: "ll-21", 
        title: "Linked List Matrix", 
        url: "https://www.geeksforgeeks.org/problems/linked-list-matrix/1", 
        platform: "GeeksForGeeks", 
        tags: ["Implementation", "Medium"],
        description: "Construct a 2D linked list representation of a matrix."
      },
      { 
        id: "ll-22", 
        title: "Merge k Sorted Lists", 
        url: "https://leetcode.com/problems/merge-k-sorted-lists/description/", 
        platform: "LeetCode", 
        tags: ["Heap", "Divide & Conquer", "Hard"],
        description: "Efficiently merge multiple sorted linked lists into one."
      },
      { 
        id: "ll-23", 
        title: "Deletion and Reverse in Linked List", 
        url: "https://www.geeksforgeeks.org/problems/deletion-and-reverse-in-linked-list/1", 
        platform: "GeeksForGeeks", 
        tags: ["Circular LL", "Medium"],
        description: "Delete a node and reverse a circular linked list."
      },
      { 
        id: "ll-24", 
        title: "Reverse a Doubly Linked List", 
        url: "https://www.geeksforgeeks.org/problems/reverse-a-doubly-linked-list/1", 
        platform: "GeeksForGeeks",
        tags: ["Doubly LL", "Easy"],
        description: "Swap the next and previous pointers of all nodes in a DLL."
      },
      { 
        id: "ll-25", 
        title: "Find Length of Loop", 
        url: "https://www.geeksforgeeks.org/problems/find-length-of-loop/1", 
        platform: "GeeksForGeeks",
        tags: ["Floyd's Cycle", "Easy"],
        description: "Detect a loop and count how many nodes are within that loop."
      },
      { 
        id: "ll-26", 
        title: "Delete All Occurrences of Key in DLL", 
        url: "https://www.geeksforgeeks.org/problems/delete-all-occurrences-of-a-given-key-in-a-doubly-linked-list/1", 
        platform: "GeeksForGeeks",
        tags: ["Doubly LL", "Medium"],
        description: "Traverse a DLL and remove all nodes with a specific value."
      },
      { 
        id: "ll-27", 
        title: "Rotate List", 
        url: "https://leetcode.com/problems/rotate-list/description/", 
        platform: "LeetCode",
        tags: ["Two Pointers", "Medium"],
        description: "Rotate the linked list to the right by k places."
      },
      { 
        id: "ll-28", 
        title: "Find Pairs With Given Sum in DLL", 
        url: "https://www.geeksforgeeks.org/problems/find-pairs-with-given-sum-in-doubly-linked-list/1", 
        platform: "GeeksForGeeks",
        tags: ["Two Pointers", "Easy"],
        description: "Use a two-pointer approach (head and tail) to find sum pairs in a sorted DLL."
      },
      { 
        id: "ll-29", 
        title: "LRU Cache", 
        url: "https://leetcode.com/problems/lru-cache/", 
        platform: "LeetCode",
        tags: ["Hash Map", "Doubly LL", "Design", "Medium"],
        description: "Implement a Least Recently Used (LRU) cache with O(1) operations."
      },
      { 
        id: "ll-30", 
        title: "Copy List with Random Pointer", 
        url: "https://leetcode.com/problems/copy-list-with-random-pointer/", 
        platform: "LeetCode",
        tags: ["Hash Map", "Deep Copy", "Medium"],
        description: "Clone a linked list where nodes contain an additional random pointer."
      }
    ]
  },
  {
    topicName: "Stacks",
    problems: [
      { 
        id: "st-1", 
        title: "Remove All Adjacent Duplicates II", 
        url: "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/", 
        platform: "LeetCode",
        tags: ["Stack", "Simulation", "Medium"],
        description: "Repeatedly remove k adjacent equal characters until impossible."
      },
      { 
        id: "st-2", 
        title: "Remove All Adjacent Duplicates", 
        url: "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/", 
        platform: "LeetCode",
        tags: ["Stack", "Easy"],
        description: "Remove pairs of adjacent duplicates from a string."
      },
      { 
        id: "st-3", 
        title: "Daily Temperatures", 
        url: "https://leetcode.com/problems/daily-temperatures/", 
        platform: "LeetCode",
        tags: ["Monotonic Stack", "Medium"],
        description: "For each day, find the number of days until a warmer temperature occurs."
      },
      { 
        id: "st-4", 
        title: "Next Larger Element", 
        url: "https://www.geeksforgeeks.org/problems/next-larger-element-1587115620/1", 
        platform: "GeeksForGeeks",
        tags: ["Monotonic Stack", "Medium"],
        description: "Find the next greater element to the right for every element in an array."
      },
      { 
        id: "st-5", 
        title: "Previous Greater Element", 
        url: "https://www.geeksforgeeks.org/previous-greater-element/", 
        platform: "GeeksForGeeks",
        tags: ["Monotonic Stack", "Medium"],
        description: "Find the nearest element to the left that is greater than the current element."
      },
      { 
        id: "st-6", 
        title: "Smallest Number on Left", 
        url: "https://www.geeksforgeeks.org/problems/smallest-number-on-left3403/1", 
        platform: "GeeksForGeeks",
        tags: ["Monotonic Stack", "Medium"],
        description: "Find the nearest element to the left that is smaller than the current element."
      },
      { 
        id: "st-7", 
        title: "Valid Parentheses", 
        url: "https://leetcode.com/problems/valid-parentheses/", 
        platform: "LeetCode",
        tags: ["Stack", "Easy"],
        description: "Check if the brackets in a string are closed in the correct order."
      },
      { 
        id: "st-8", 
        title: "Maximum Nesting Depth", 
        url: "https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/", 
        platform: "LeetCode",
        tags: ["Stack", "Simulation", "Easy"],
        description: "Calculate the maximum depth of nested parentheses."
      },
      { 
        id: "st-9", 
        title: "Next Greater Element I", 
        url: "https://leetcode.com/problems/next-greater-element-i/", 
        platform: "LeetCode",
        tags: ["Monotonic Stack", "Hash Map", "Easy"],
        description: "Find next greater elements for a subset of elements using a precomputed stack."
      },
      { 
        id: "st-10", 
        title: "Next Greater Element II", 
        url: "https://leetcode.com/problems/next-greater-element-ii/", 
        platform: "LeetCode",
        tags: ["Monotonic Stack", "Circular Array", "Medium"],
        description: "Find the next greater element in a circular array."
      },
      { 
        id: "st-11", 
        title: "Nearest Smaller Element", 
        url: "https://www.interviewbit.com/problems/nearest-smaller-element/", 
        platform: "InterviewBit",
        tags: ["Monotonic Stack", "Medium"],
        description: "Find the closest smaller element on the left side."
      },
      { 
        id: "st-12", 
        title: "Min Stack", 
        url: "https://leetcode.com/problems/min-stack/", 
        platform: "LeetCode",
        tags: ["Stack", "Design", "Medium"],
        description: "Implement a stack that supports retrieving the minimum element in O(1) time."
      },
      { 
        id: "st-13", 
        title: "Backspace String Compare", 
        url: "https://leetcode.com/problems/backspace-string-compare/", 
        platform: "LeetCode",
        tags: ["Stack", "Two Pointers", "Easy"],
        description: "Compare two strings containing backspace characters '#' to see if they are equal."
      },
      { 
        id: "st-14", 
        title: "Asteroid Collision", 
        url: "https://leetcode.com/problems/asteroid-collision/", 
        platform: "LeetCode",
        tags: ["Stack", "Simulation", "Medium"],
        description: "Simulate collisions between asteroids moving in different directions."
      },
      { 
        id: "st-15", 
        title: "Evaluate Reverse Polish Notation", 
        url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/description/", 
        platform: "LeetCode",
        tags: ["Stack", "Math", "Medium"],
        description: "Calculate the result of an arithmetic expression in RPN (postfix notation)."
      },
      { 
        id: "st-16", 
        title: "Sum of Subarray Minimums", 
        url: "https://leetcode.com/problems/sum-of-subarray-minimums/description/", 
        platform: "LeetCode",
        tags: ["Monotonic Stack", "Math", "Medium"],
        description: "Find the sum of minimum values for every possible subarray."
      },
      { 
        id: "st-17", 
        title: "Maximal Rectangle", 
        url: "https://leetcode.com/problems/maximal-rectangle/description/", 
        platform: "LeetCode",
        tags: ["Monotonic Stack", "Hard"],
        description: "Solve the Largest Rectangle in Histogram for every row in a binary matrix."
      },
      { 
        id: "st-18", 
        title: "The Celebrity Problem", 
        url: "https://www.geeksforgeeks.org/problems/the-celebrity-problem/1", 
        platform: "GeeksForGeeks",
        tags: ["Stack", "Two Pointers", "Medium"],
        description: "Find the person in a party who everyone knows but who knows no one."
      },
      { 
        id: "st-19", 
        title: "Remove K Digits", 
        url: "https://leetcode.com/problems/remove-k-digits/description/", 
        platform: "LeetCode",
        tags: ["Monotonic Stack", "Greedy", "Medium"],
        description: "Find the smallest possible number after removing k digits."
      },
      { 
        id: "st-20", 
        title: "Design Stack With Increment", 
        url: "https://leetcode.com/problems/design-a-stack-with-increment-operation/", 
        platform: "LeetCode",
        tags: ["Stack", "Design", "Medium"],
        description: "Design a stack that can increment the bottom k elements by a specific value."
      },
      { 
        id: "st-21", 
        title: "Stock Span Problem", 
        url: "https://www.geeksforgeeks.org/problems/stock-span-problem-1587115621/1", 
        platform: "GeeksForGeeks",
        tags: ["Monotonic Stack", "Medium"],
        description: "Calculate the number of consecutive days before a stock's price was less than or equal to current price."
      },
      { 
        id: "st-22", 
        title: "Online Stock Span", 
        url: "https://leetcode.com/problems/online-stock-span/", 
        platform: "LeetCode",
        tags: ["Monotonic Stack", "Design", "Medium"],
        description: "Implement a data structure to handle real-time stock price spans."
      },
      { 
        id: "st-23", 
        title: "Postfix to Infix", 
        url: "https://www.geeksforgeeks.org/problems/postfix-to-infix-conversion/1", 
        platform: "GeeksForGeeks",
        tags: ["Stack", "Simulation", "Medium"],
        description: "Convert an expression from postfix format to its standard infix format."
      },
      { 
        id: "st-24", 
        title: "Largest Rectangle in Histogram", 
        url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", 
        platform: "LeetCode",
        tags: ["Monotonic Stack", "Hard"],
        description: "Find the largest area that can be covered by a rectangle in a bar chart."
      },
      { 
        id: "st-25", 
        title: "Find the Town Judge", 
        url: "https://leetcode.com/problems/find-the-town-judge/", 
        platform: "LeetCode",
        tags: ["Graph", "Hash Table", "Easy"],
        description: "Identify the individual who is trusted by everyone else but trusts no one."
      },
      { 
        id: "st-26", 
        title: "Basic Calculator IV", 
        url: "https://leetcode.com/problems/basic-calculator-iv/description/", 
        platform: "LeetCode",
        tags: ["Stack", "Parsing", "Hard"],
        description: "Perform advanced arithmetic expression evaluation with variables and polynomials."
      }
    ]
  },
  {
    topicName: "Queue + Deque",
    problems: [
      { 
        id: "q-1", 
        title: "Implement Queue using Stacks", 
        url: "https://leetcode.com/problems/implement-queue-using-stacks/description/", 
        platform: "LeetCode",
        tags: ["Design", "Easy"],
        description: "Simulate FIFO behavior using two LIFO stacks."
      },
      { 
        id: "q-2", 
        title: "Implement Stack using Queues", 
        url: "https://leetcode.com/problems/implement-stack-using-queues/", 
        platform: "LeetCode",
        tags: ["Design", "Easy"],
        description: "Simulate LIFO behavior using one or two FIFO queues."
      },
      { 
        id: "q-3", 
        title: "Queue Using Two Stacks", 
        url: "https://www.geeksforgeeks.org/problems/queue-using-two-stacks/1", 
        platform: "GeeksForGeeks",
        tags: ["Design", "Easy"],
        description: "Standard implementation of a queue using the two-stack technique."
      },
      { 
        id: "q-4", 
        title: "Design Front Middle Back Queue", 
        url: "https://leetcode.com/problems/design-front-middle-back-queue/description/", 
        platform: "LeetCode",
        tags: ["Deque", "Design", "Medium"],
        description: "Implement a queue that supports push/pop at the front, middle, and back."
      },
      { 
        id: "q-5", 
        title: "First Negative Integer in Window", 
        url: "https://practice.geeksforgeeks.org/problems/first-negative-integer-in-every-window-of-size-k3345/1", 
        platform: "GeeksForGeeks",
        tags: ["Sliding Window", "Queue", "Medium"],
        description: "Find the first negative number in every subarray of size k."
      },
      { 
        id: "q-6", 
        title: "First Non-Repeating Char in Stream", 
        url: "https://www.geeksforgeeks.org/problems/first-non-repeating-character-in-a-stream1216/1", 
        platform: "GeeksForGeeks",
        tags: ["Queue", "Hash Map", "Medium"],
        description: "Process a sequence of characters and track the first character that appeared only once."
      },
      { 
        id: "q-7", 
        title: "Max Consecutive Ones III", 
        url: "https://leetcode.com/problems/max-consecutive-ones-iii/", 
        platform: "LeetCode",
        tags: ["Sliding Window", "Medium"],
        description: "Find the longest subarray of 1s if you can flip at most k 0s."
      },
      { 
        id: "q-8", 
        title: "Longest K Unique Characters", 
        url: "https://www.geeksforgeeks.org/problems/longest-k-unique-characters-substring0853/1", 
        platform: "GeeksForGeeks",
        tags: ["Sliding Window", "Hash Map", "Medium"],
        description: "Find the length of the longest substring containing exactly k unique characters."
      },
      { 
        id: "q-9", 
        title: "Length of Longest Substring", 
        url: "https://www.geeksforgeeks.org/problems/length-of-the-longest-substring3036/1", 
        platform: "GeeksForGeeks", 
        tags: ["Sliding Window", "Medium"],
        description: "Calculate the length of the longest substring without any repeating characters."
      },
      { 
        id: "q-10", 
        title: "Rotting Oranges", 
        url: "https://leetcode.com/problems/rotting-oranges/", 
        platform: "LeetCode",
        tags: ["BFS", "Matrix", "Medium"],
        description: "Determine the time required for all oranges to rot using multi-source BFS."
      },
      { 
        id: "q-11", 
        title: "Sliding Window Maximum", 
        url: "https://leetcode.com/problems/sliding-window-maximum/description/", 
        platform: "LeetCode",
        tags: ["Deque", "Sliding Window", "Hard"],
        description: "Use a monotonic deque to find the maximum in every sliding window of size k."
      },
      { 
        id: "q-12", 
        title: "Number of Substrings Containing All Three Characters", 
        url: "https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/", 
        platform: "LeetCode",
        tags: ["Sliding Window", "Two Pointers", "Medium"],
        description: "Count substrings that contain at least one occurrence of 'a', 'b', and 'c'."
      },
      { 
        id: "q-13", 
        title: "Task Scheduler II", 
        url: "https://leetcode.com/problems/task-scheduler-ii/description/", 
        platform: "LeetCode", 
        tags: ["Hash Map", "Simulation", "Medium"],
        description: "Calculate the total days needed to complete tasks with specific cooldown periods."
      },
      { 
        id: "q-14", 
        title: "Minimum Size Subarray Sum", 
        url: "https://leetcode.com/problems/minimum-size-subarray-sum/", 
        platform: "LeetCode",
        tags: ["Sliding Window", "Two Pointers", "Medium"],
        description: "Find the smallest subarray length whose sum is greater than or equal to target."
      },
      { 
        id: "q-15", 
        title: "Longest Substring Without Repeating Characters", 
        url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/description/", 
        platform: "LeetCode",
        tags: ["Sliding Window", "Hash Map", "Medium"],
        description: "Find the maximum length of a substring where no character is repeated."
      }
    ]
  },
  {
    topicName: "HashMap",
    problems: [
      { 
        id: "hm-1", 
        title: "Find Occurrences of Element", 
        url: "https://leetcode.com/problems/find-occurrences-of-an-element-in-an-array/description/", 
        platform: "LeetCode",
        tags: ["Hash Map", "Easy"],
        description: "Store the indices of each element in a hash map to answer occurrence queries."
      },
      { 
        id: "hm-2", 
        title: "Zero Sum Subarrays", 
        url: "https://www.geeksforgeeks.org/problems/zero-sum-subarrays1825/1", 
        platform: "GeeksForGeeks",
        tags: ["Prefix Sum", "Hash Map", "Medium"],
        description: "Count how many subarrays have a sum of zero."
      },
      { 
        id: "hm-3", 
        title: "Largest Subarray with 0 Sum", 
        url: "https://www.geeksforgeeks.org/problems/largest-subarray-with-0-sum/1", 
        platform: "GeeksForGeeks",
        tags: ["Prefix Sum", "Hash Map", "Medium"],
        description: "Identify the maximum length of a subarray that sums up to zero."
      },
      { 
        id: "hm-4", 
        title: "Longest Sub-Array with Sum K", 
        url: "https://www.geeksforgeeks.org/problems/longest-sub-array-with-sum-k0809/1", 
        platform: "GeeksForGeeks",
        tags: ["Prefix Sum", "Hash Map", "Medium"],
        description: "Find the length of the longest subarray with sum equal to k (supports negatives)."
      },
      { 
        id: "hm-5", 
        title: "Subarray Sum Equals K", 
        url: "https://leetcode.com/problems/subarray-sum-equals-k/description/", 
        platform: "LeetCode",
        tags: ["Prefix Sum", "Hash Map", "Medium"],
        description: "Count the total number of subarrays whose sum is exactly k."
      },
      { 
        id: "hm-6", 
        title: "Subarray Sums Divisible by K", 
        url: "https://leetcode.com/problems/subarray-sums-divisible-by-k/description/", 
        platform: "LeetCode",
        tags: ["Prefix Sum", "Modular Arithmetic", "Medium"],
        description: "Count subarrays where the sum modulo k equals zero."
      },
      { 
        id: "hm-7", 
        title: "Subarray with Given XOR", 
        url: "https://www.interviewbit.com/problems/subarray-with-given-xor/", 
        platform: "InterviewBit",
        tags: ["Prefix XOR", "Hash Map", "Medium"],
        description: "Find the number of subarrays whose XOR of elements is exactly m."
      },
      { 
        id: "hm-8", 
        title: "Group Anagrams", 
        url: "https://leetcode.com/problems/group-anagrams/description/", 
        platform: "LeetCode",
        tags: ["Hash Map", "Sorting", "Medium"],
        description: "Collect strings that are anagrams of each other into separate sub-lists."
      },
      { 
        id: "hm-9", 
        title: "Subarray with 0 Sum", 
        url: "https://www.geeksforgeeks.org/problems/subarray-with-0-sum-1587115621/1", 
        platform: "GeeksForGeeks",
        tags: ["Hash Set", "Easy"],
        description: "Check if there exists a subarray with sum equal to zero."
      },
      { 
        id: "hm-10", 
        title: "Non-Repeating Character", 
        url: "https://www.geeksforgeeks.org/problems/non-repeating-character-1587115620/1", 
        platform: "GeeksForGeeks",
        tags: ["Hash Map", "Easy"],
        description: "Find the first character in a string that appears only once."
      },
      { 
        id: "hm-11", 
        title: "Number of Submatrices That Sum to Target", 
        url: "https://leetcode.com/problems/number-of-submatrices-that-sum-to-target/description/", 
        platform: "LeetCode",
        tags: ["2D-Prefix Sum", "Hash Map", "Hard"],
        description: "Extend the 'Subarray Sum Equals K' logic to 2D matrices."
      },
      { 
        id: "hm-12", 
        title: "Longest Consecutive Sequence", 
        url: "https://leetcode.com/problems/longest-consecutive-sequence/description/", 
        platform: "LeetCode",
        tags: ["Hash Set", "Medium"],
        description: "Find the length of the longest sequence of consecutive integers in an unsorted array."
      }
    ]
  },
  {
    topicName: "Strings",
    problems: [
      { 
        id: "str-1", 
        title: "Palindromic Substrings", 
        url: "https://leetcode.com/problems/palindromic-substrings/", 
        platform: "LeetCode",
        tags: ["Expand Around Center", "DP", "Medium"],
        description: "Count how many palindromic substrings exist in a given string."
      },
      { 
        id: "str-2", 
        title: "Reverse Words in a String III", 
        url: "https://leetcode.com/problems/reverse-words-in-a-string-iii/", 
        platform: "LeetCode",
        tags: ["Two Pointers", "Easy"],
        description: "Reverse each word in a sentence individually while keeping the word order."
      },
      { 
        id: "str-3", 
        title: "Sort Characters By Frequency", 
        url: "https://leetcode.com/problems/sort-characters-by-frequency/", 
        platform: "LeetCode",
        tags: ["Hash Map", "Sorting", "Medium"],
        description: "Build a string with characters sorted by their count in the original input."
      },
      { 
        id: "str-4", 
        title: "Remove Characters Present in Second String", 
        url: "https://www.geeksforgeeks.org/remove-characters-from-the-first-string-which-are-present-in-the-second-string/", 
        platform: "GeeksForGeeks",
        tags: ["Hash Set", "Easy"],
        description: "Filter the first string by removing any characters found in the second string."
      },
      { 
        id: "str-5", 
        title: "Remove K Digits", 
        url: "https://leetcode.com/problems/remove-k-digits/", 
        platform: "LeetCode",
        tags: ["Monotonic Stack", "Greedy", "Medium"],
        description: "Obtain the smallest possible number by removing k digits from a number string."
      },
      { 
        id: "str-6", 
        title: "Last Match", 
        url: "https://www.geeksforgeeks.org/problems/last-match1928/1", 
        platform: "GeeksForGeeks",
        tags: ["KMP", "Z-Algorithm", "Medium"],
        description: "Find the starting index of the last occurrence of a pattern in a text."
      },
      { 
        id: "str-7", 
        title: "Find Index of First Occurrence", 
        url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/description/", 
        platform: "LeetCode",
        tags: ["Two Pointers", "KMP", "Easy"],
        description: "Implement strStr() to return the index of the first needle in a haystack."
      },
      { 
        id: "str-8", 
        title: "Find All Anagrams in a String", 
        url: "https://leetcode.com/problems/find-all-anagrams-in-a-string/description/", 
        platform: "LeetCode",
        tags: ["Sliding Window", "Hash Map", "Medium"],
        description: "Find all starting indices of substrings that are anagrams of a given pattern."
      }
    ]
  },
  {
    topicName: "Binary Search",
    problems: [
      { 
        id: "bs-1", 
        title: "Sqrt(x)", 
        url: "https://leetcode.com/problems/sqrtx/description/", 
        platform: "LeetCode",
        tags: ["Binary Search", "Math", "Easy"],
        description: "Find the integer square root of x using the search space [1, x]."
      },
      { 
        id: "bs-2", 
        title: "Find First and Last Position", 
        url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/", 
        platform: "LeetCode",
        tags: ["Binary Search", "Medium"],
        description: "Use binary search twice to find the boundaries of a target value."
      },
      { 
        id: "bs-3", 
        title: "Floor in a Sorted Array", 
        url: "https://www.geeksforgeeks.org/problems/floor-in-a-sorted-array-1587115620/1", 
        platform: "GeeksForGeeks",
        tags: ["Binary Search", "Easy"],
        description: "Find the largest element less than or equal to x."
      },
      { 
        id: "bs-4", 
        title: "Ceil the Floor", 
        url: "https://www.geeksforgeeks.org/problems/ceil-the-floor2802/1", 
        platform: "GeeksForGeeks",
        tags: ["Binary Search", "Easy"],
        description: "Find both the Floor and Ceiling for a given x in a sorted array."
      },
      { 
        id: "bs-5", 
        title: "Number of Occurrence", 
        url: "https://www.geeksforgeeks.org/problems/number-of-occurrence2259/1", 
        platform: "GeeksForGeeks",
        tags: ["Binary Search", "Easy"],
        description: "Count frequencies of x in a sorted array using (Last - First + 1)."
      },
      { 
        id: "bs-6", 
        title: "Search a 2D Matrix", 
        url: "https://leetcode.com/problems/search-a-2d-matrix/", 
        platform: "LeetCode",
        tags: ["Binary Search", "Matrix", "Medium"],
        description: "Treat a 2D sorted matrix as a flat 1D array to perform binary search."
      },
      { 
        id: "bs-7", 
        title: "Search a 2D Matrix II", 
        url: "https://leetcode.com/problems/search-a-2d-matrix-ii/", 
        platform: "LeetCode", 
        tags: ["Staircase search", "Medium"],
        description: "Navigate a row-wise and column-wise sorted matrix starting from top-right or bottom-left."
      },
      { 
        id: "bs-8", 
        title: "Row with Max 1s", 
        url: "https://www.geeksforgeeks.org/problems/row-with-max-1s0023/1", 
        platform: "GeeksForGeeks", 
        tags: ["Staircase search", "Matrix", "Medium"],
        description: "Find the row containing the maximum number of 1s in O(N+M) time."
      },
      { 
        id: "bs-9", 
        title: "Search in Rotated Sorted Array", 
        url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", 
        platform: "LeetCode",
        tags: ["Binary Search", "Medium"],
        description: "Find a target in a sorted array that has been rotated at some pivot."
      },
      { 
        id: "bs-10", 
        title: "Find Minimum in Rotated Sorted Array", 
        url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/description/", 
        platform: "LeetCode",
        tags: ["Binary Search", "Medium"],
        description: "Determine the smallest element in a rotated sorted array."
      },
      { 
        id: "bs-11", 
        title: "Rotation", 
        url: "https://www.geeksforgeeks.org/problems/rotation4723/1", 
        platform: "GeeksForGeeks", 
        tags: ["Kth rotation", "Binary Search", "Easy"],
        description: "Calculate how many times a sorted array was rotated by finding the minimum element's index."
      },
      { 
        id: "bs-12", 
        title: "Guess Number Higher or Lower", 
        url: "https://leetcode.com/problems/guess-number-higher-or-lower/", 
        platform: "LeetCode",
        tags: ["Binary Search", "Easy"],
        description: "Identify a hidden number by narrowing down based on higher/lower hints."
      },
      { 
        id: "bs-13", 
        title: "Find Peak Element", 
        url: "https://leetcode.com/problems/find-peak-element/", 
        platform: "LeetCode",
        tags: ["Binary Search", "Medium"],
        description: "Locate any element that is strictly greater than its neighbors."
      },
      { 
        id: "bs-14", 
        title: "Single Element in a Sorted Array", 
        url: "https://leetcode.com/problems/single-element-in-a-sorted-array/", 
        platform: "LeetCode",
        tags: ["Binary Search", "Bit Manipulation", "Medium"],
        description: "Find the element that appears only once in an array where all others appear twice."
      },
      { 
        id: "bs-15", 
        title: "The Painter's Partition Problem", 
        url: "https://practice.geeksforgeeks.org/problems/the-painters-partition-problem1535/1", 
        platform: "GeeksForGeeks",
        tags: ["BS on Answer", "Hard"],
        description: "Minimize the maximum time required for painters to paint all boards."
      },
      { 
        id: "bs-16", 
        title: "Aggressive Cows", 
        url: "https://www.geeksforgeeks.org/problems/aggressive-cows/0", 
        platform: "GeeksForGeeks",
        tags: ["BS on Answer", "Medium"],
        description: "Maximize the minimum distance between cows placed in stalls."
      },
      { 
        id: "bs-17", 
        title: "Minimum Limit of Balls in a Bag", 
        url: "https://leetcode.com/problems/minimum-limit-of-balls-in-a-bag/", 
        platform: "LeetCode",
        tags: ["BS on Answer", "Medium"],
        description: "Minimize the maximum number of balls in any bag after k operations."
      },
      { 
        id: "bs-18", 
        title: "Koko Eating Bananas", 
        url: "https://leetcode.com/problems/koko-eating-bananas/", 
        platform: "LeetCode",
        tags: ["BS on Answer", "Medium"],
        description: "Find the minimum eating speed k per hour to finish all bananas within h hours."
      },
      { 
        id: "bs-19", 
        title: "Minimum Days to Make M Bouquets", 
        url: "https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/description/", 
        platform: "LeetCode",
        tags: ["BS on Answer", "Medium"],
        description: "Calculate the minimum time to grow enough adjacent flowers for bouquets."
      },
      { 
        id: "bs-20", 
        title: "Allocate Books", 
        url: "https://www.interviewbit.com/problems/allocate-books/", 
        platform: "InterviewBit",
        tags: ["BS on Answer", "Hard"],
        description: "Minimize the maximum number of pages allocated to any single student."
      },
      { 
        id: "bs-21", 
        title: "Find Smallest Divisor Given Threshold", 
        url: "https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/description/", 
        platform: "LeetCode",
        tags: ["BS on Answer", "Medium"],
        description: "Find the smallest divisor such that the sum of division results is within threshold."
      },
      { 
        id: "bs-22", 
        title: "Minimum Window Substring", 
        url: "https://leetcode.com/problems/minimum-window-substring/description/", 
        platform: "LeetCode",
        tags: ["Sliding Window", "Two Pointers", "Hard"],
        description: "Find the smallest substring containing all characters of another string."
      },
      { 
        id: "bs-23", 
        title: "Median of Two Sorted Arrays", 
        url: "https://leetcode.com/problems/median-of-two-sorted-arrays/description/", 
        platform: "LeetCode", 
        tags: ["Binary Search", "Hard"],
        description: "Find the median of two merged sorted arrays in O(log(min(N,M))) time."
      },
      { 
        id: "bs-24", 
        title: "K-th Element of Two Sorted Arrays", 
        url: "https://www.geeksforgeeks.org/problems/k-th-element-of-two-sorted-array1317/1", 
        platform: "GeeksForGeeks",
        tags: ["Binary Search", "Medium"],
        description: "Identify the element at position k if two sorted arrays were merged."
      },
      { 
        id: "bs-25", 
        title: "Find K Closest Elements", 
        url: "https://leetcode.com/problems/find-k-closest-elements/description/", 
        platform: "LeetCode",
        tags: ["Binary Search", "Two Pointers", "Medium"],
        description: "Find k integers in a sorted array that are closest to a value x."
      }
    ]
  },
  {
    topicName: "Math & Number Theory",
    problems: [
      { 
        id: "math-1", 
        title: "Count Primes", 
        url: "https://leetcode.com/problems/count-primes/description/", 
        platform: "LeetCode",
        tags: ["Sieve of Eratosthenes", "Easy"],
        description: "Find the count of prime numbers strictly less than n."
      },
      { 
        id: "math-2", 
        title: "Divisor Summation", 
        url: "https://www.spoj.com/problems/DIVSUM/", 
        platform: "SPOJ",
        tags: ["Math", "Divisors"],
        description: "Calculate the sum of all proper divisors of a number."
      },
      { 
        id: "math-3", 
        title: "Four Divisors", 
        url: "https://leetcode.com/problems/four-divisors/description/", 
        platform: "LeetCode",
        tags: ["Math", "Medium"],
        description: "Find the sum of divisors for integers that have exactly four divisors."
      },
      { 
        id: "math-4", 
        title: "Find GCD of Array", 
        url: "https://leetcode.com/problems/find-greatest-common-divisor-of-array/description/", 
        platform: "LeetCode",
        tags: ["Euclidean Algorithm", "Easy"],
        description: "Calculate the greatest common divisor of the smallest and largest numbers in an array."
      },
      { 
        id: "math-5", 
        title: "Problem 26A", 
        url: "https://codeforces.com/problemset/problem/26/A", 
        platform: "CodeForces",
        tags: ["Number Theory", "Sieve"],
        description: "Count 'Almost Prime' numbers (integers with exactly two distinct prime factors)."
      },
      { 
        id: "math-6", 
        title: "Problem 1294C", 
        url: "https://codeforces.com/problemset/problem/1294/C", 
        platform: "CodeForces",
        tags: ["Number Theory", "Greedy"],
        description: "Represent a number as a product of three distinct integers greater than 1."
      },
      { 
        id: "math-7", 
        title: "Task 1617", 
        url: "https://cses.fi/problemset/task/1617", 
        platform: "CSES",
        tags: ["Math", "Exponentiation"],
        description: "Calculate 2^n modulo 10^9 + 7."
      }
    ]
  },
  {
    topicName: "Trees (Binary + BST)",
    problems: [
      { 
        id: "tree-1", 
        title: "Preorder Traversal", 
        url: "https://www.geeksforgeeks.org/problems/preorder-traversal/1", 
        platform: "GeeksForGeeks",
        tags: ["DFS", "Traversal", "Easy"],
        description: "Visit nodes in Root → Left → Right order."
      },
      { 
        id: "tree-2", 
        title: "Binary Tree Zigzag Level Order", 
        url: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/", 
        platform: "LeetCode",
        tags: ["BFS", "Queue", "Medium"],
        description: "Traverse a tree level by level, alternating left-to-right and right-to-left."
      },
      { 
        id: "tree-3", 
        title: "Same Tree", 
        url: "https://leetcode.com/problems/same-tree/", 
        platform: "LeetCode",
        tags: ["DFS", "Recursion", "Easy"],
        description: "Check if two trees are structurally identical with the same node values."
      },
      { 
        id: "tree-4", 
        title: "Symmetric Tree", 
        url: "https://leetcode.com/problems/symmetric-tree/", 
        platform: "LeetCode",
        tags: ["DFS", "BFS", "Easy"],
        description: "Verify if a tree is a mirror image of itself."
      },
      { 
        id: "tree-5", 
        title: "Left View of Binary Tree", 
        url: "https://www.geeksforgeeks.org/problems/left-view-of-binary-tree/1", 
        platform: "GeeksForGeeks",
        tags: ["DFS", "BFS", "Medium"],
        description: "Return the first node of each level when viewed from the left."
      },
      { 
        id: "tree-6", 
        title: "Invert Binary Tree", 
        url: "https://leetcode.com/problems/invert-binary-tree/", 
        platform: "LeetCode",
        tags: ["DFS", "BFS", "Easy"],
        description: "Flip the left and right children of every node in the tree."
      },
      { 
        id: "tree-7", 
        title: "Binary Tree Maximum Path Sum", 
        url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", 
        platform: "LeetCode",
        tags: ["DFS", "Recursion", "Hard"],
        description: "Find the maximum sum of any path between two nodes in the tree."
      },
      { 
        id: "tree-8", 
        title: "Check for Balanced Tree", 
        url: "https://www.geeksforgeeks.org/problems/check-for-balanced-tree/1", 
        platform: "GeeksForGeeks",
        tags: ["DFS", "Height", "Easy"],
        description: "Check if for every node, the height of its left and right subtrees differs by no more than 1."
      },
      { 
        id: "tree-9", 
        title: "Subtree of Another Tree", 
        url: "https://leetcode.com/problems/subtree-of-another-tree/", 
        platform: "LeetCode",
        tags: ["DFS", "KMP-Tree", "Easy"],
        description: "Check if a tree contains exactly the same structure and values as another tree."
      },
      { 
        id: "tree-10", 
        title: "Diameter of Binary Tree", 
        url: "https://leetcode.com/problems/diameter-of-binary-tree/description/", 
        platform: "LeetCode",
        tags: ["DFS", "Height", "Easy"],
        description: "Find the longest path between any two nodes in a tree."
      },
      { 
        id: "tree-11", 
        title: "Top View of Binary Tree", 
        url: "https://practice.geeksforgeeks.org/problems/top-view-of-binary-tree/1", 
        platform: "GeeksForGeeks",
        tags: ["BFS", "Vertical Order", "Medium"],
        description: "Return nodes that are visible when viewing the tree from above."
      },
      { 
        id: "tree-12", 
        title: "LCA of Binary Tree", 
        url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/description/", 
        platform: "LeetCode",
        tags: ["DFS", "Recursion", "Medium"],
        description: "Find the lowest shared ancestor of two given nodes."
      },
      { 
        id: "tree-13", 
        title: "Right View of Binary Tree", 
        url: "https://practice.geeksforgeeks.org/problems/right-view-of-binary-tree/1", 
        platform: "GeeksForGeeks",
        tags: ["DFS", "BFS", "Easy"],
        description: "Return the last node of each level when viewed from the right."
      },
      { 
        id: "tree-14", 
        title: "Sum Root to Leaf Numbers", 
        url: "https://leetcode.com/problems/sum-root-to-leaf-numbers/", 
        platform: "LeetCode",
        tags: ["DFS", "Math", "Medium"],
        description: "Convert paths from root to leaf into numbers and find their total sum."
      },
      { 
        id: "tree-15", 
        title: "Range Sum of BST", 
        url: "https://leetcode.com/problems/range-sum-of-bst/description/", 
        platform: "LeetCode",
        tags: ["DFS", "BST", "Easy"],
        description: "Calculate the sum of all nodes in a BST that lie within a given range."
      },
      { 
        id: "tree-16", 
        title: "Minimum Absolute Difference in BST", 
        url: "https://leetcode.com/problems/minimum-absolute-difference-in-bst/description/", 
        platform: "LeetCode",
        tags: ["Inorder Traversal", "BST", "Easy"],
        description: "Find the smallest difference between any two node values in a BST."
      },
      { 
        id: "tree-17", 
        title: "Kth Smallest Element in a BST", 
        url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", 
        platform: "LeetCode",
        tags: ["Inorder Traversal", "BST", "Medium"],
        description: "Find the k-th element in the sorted order of BST values."
      },
      { 
        id: "tree-18", 
        title: "Construct BT from Preorder/Inorder", 
        url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/", 
        platform: "LeetCode",
        tags: ["Recursion", "Hash Map", "Medium"],
        description: "Rebuild the tree using its preorder and inorder traversal arrays."
      },
      { 
        id: "tree-19", 
        title: "Pseudo-Palindromic Paths", 
        url: "https://leetcode.com/problems/pseudo-palindromic-paths-in-a-binary-tree/", 
        platform: "LeetCode",
        tags: ["DFS", "Bit Manipulation", "Medium"],
        description: "Count paths where node frequencies allow forming a palindrome."
      },
      { 
        id: "tree-20", 
        title: "BST Iterator", 
        url: "https://leetcode.com/problems/binary-search-tree-iterator/", 
        platform: "LeetCode",
        tags: ["Stack", "Design", "Medium"],
        description: "Implement an iterator over a BST that provides nodes in sorted order."
      },
      { 
        id: "tree-21", 
        title: "Two Sum IV - Input is a BST", 
        url: "https://leetcode.com/problems/two-sum-iv-input-is-a-bst/", 
        platform: "LeetCode",
        tags: ["Hash Set", "BST", "Easy"],
        description: "Find if any two nodes in a BST sum up to a target."
      },
      { 
        id: "tree-22", 
        title: "All Nodes Distance K in Binary Tree", 
        url: "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/", 
        platform: "LeetCode",
        tags: ["BFS", "Graph Conversion", "Medium"],
        description: "Find all nodes exactly distance k away from a specific target node."
      },
      { 
        id: "tree-23", 
        title: "Unique Binary Search Trees", 
        url: "https://leetcode.com/problems/unique-binary-search-trees/", 
        platform: "LeetCode",
        tags: ["DP", "Catalan Number", "Medium"],
        description: "Count how many structurally unique BSTs can be built with n nodes."
      },
      { 
        id: "tree-24", 
        title: "N-ary Tree Preorder Traversal", 
        url: "https://leetcode.com/problems/n-ary-tree-preorder-traversal/description/", 
        platform: "LeetCode",
        tags: ["DFS", "Easy"],
        description: "Perform preorder traversal on a tree where nodes can have multiple children."
      },
      { 
        id: "tree-25", 
        title: "N-ary Tree Postorder Traversal", 
        url: "https://leetcode.com/problems/n-ary-tree-postorder-traversal/", 
        platform: "LeetCode",
        tags: ["DFS", "Easy"],
        description: "Perform postorder traversal on an N-ary tree."
      },
      { 
        id: "tree-26", 
        title: "Average of Levels in Binary Tree", 
        url: "https://leetcode.com/problems/average-of-levels-in-binary-tree/", 
        platform: "LeetCode",
        tags: ["BFS", "Easy"],
        description: "Return a list of averages for the nodes at each level."
      },
      { 
        id: "tree-27", 
        title: "Print BT in Vertical Order", 
        url: "https://www.geeksforgeeks.org/problems/print-a-binary-tree-in-vertical-order/", 
        platform: "GeeksForGeeks",
        tags: ["BFS", "Hash Map", "Medium"],
        description: "Group nodes by their horizontal distance from the root."
      },
      { 
        id: "tree-28", 
        title: "LCA of BST", 
        url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/description/", 
        platform: "LeetCode",
        tags: ["BST Properties", "Recursion", "Easy"],
        description: "Leverage BST properties (Left < Root < Right) to find the LCA efficiently."
      },
      { 
        id: "tree-29", 
        title: "Validate Binary Search Tree", 
        url: "https://leetcode.com/problems/validate-binary-search-tree/", 
        platform: "LeetCode",
        tags: ["DFS", "Recursion", "Medium"],
        description: "Check if a tree satisfies the BST property using range boundaries [min, max]."
      }
    ]
  },
  {
    topicName: "Bit Manipulation",
    problems: [
      { 
        id: "bit-1", 
        title: "Single Number", 
        url: "https://leetcode.com/problems/single-number/description/", 
        platform: "LeetCode",
        tags: ["XOR", "Easy"],
        description: "Find the element that appears once in an array where every other element appears twice."
      },
      { 
        id: "bit-2", 
        title: "Decode XORed Array", 
        url: "https://leetcode.com/problems/decode-xored-array/description/", 
        platform: "LeetCode",
        tags: ["XOR", "Easy"],
        description: "Reconstruct an array given its XOR-encoded version and the first element."
      },
      { 
        id: "bit-3", 
        title: "Bits Basic Operations", 
        url: "https://www.geeksforgeeks.org/problems/bits-basic-operations/1", 
        platform: "GeeksForGeeks",
        tags: ["Bitwise Ops", "Easy"],
        description: "Get, Set, and Clear specific bits in an integer."
      },
      { 
        id: "bit-4", 
        title: "Sort Integers by Number of 1 Bits", 
        url: "https://leetcode.com/problems/sort-integers-by-the-number-of-1-bits/", 
        platform: "LeetCode",
        tags: ["Popcount", "Sorting", "Easy"],
        description: "Order an array by counting set bits (Hamming weight) of each number."
      },
      { 
        id: "bit-5", 
        title: "Single Number II", 
        url: "https://leetcode.com/problems/single-number-ii/", 
        platform: "LeetCode",
        tags: ["Bit Count", "Medium"],
        description: "Find the single element where every other element appears three times."
      },
      { 
        id: "bit-6", 
        title: "Find First Repeated Character", 
        url: "https://practice.geeksforgeeks.org/problems/find-first-repeated-character4108/1", 
        platform: "GeeksForGeeks", 
        tags: ["Bitmask", "Easy"],
        description: "Use a 32-bit integer as a hash set to track seen characters in a string."
      },
      { 
        id: "bit-7", 
        title: "Counting Bits", 
        url: "https://leetcode.com/problems/counting-bits/", 
        platform: "LeetCode",
        tags: ["DP", "Bit Manipulation", "Easy"],
        description: "Generate a popcount array for numbers from 0 to n in O(n) time."
      },
      { 
        id: "bit-8", 
        title: "Find the Duplicate Number", 
        url: "https://leetcode.com/problems/find-the-duplicate-number/description/", 
        platform: "LeetCode", 
        tags: ["Binary Search", "Bitmask", "Medium"],
        description: "Find a duplicate in an array of [1, n] without modifying the array."
      },
      { 
        id: "bit-9", 
        title: "Gray Code", 
        url: "https://leetcode.com/problems/gray-code/description/", 
        platform: "LeetCode",
        tags: ["Math", "Recursion", "Medium"],
        description: "Generate a sequence where adjacent numbers differ by exactly one bit."
      },
      { 
        id: "bit-10", 
        title: "Convert Number to Hexadecimal", 
        url: "https://leetcode.com/problems/convert-a-number-to-hexadecimal/description/", 
        platform: "LeetCode",
        tags: ["Bitwise Ops", "Easy"],
        description: "Convert an integer to hex, handling negative numbers using two's complement."
      },
      { 
        id: "bit-11", 
        title: "Base 7", 
        url: "https://leetcode.com/problems/base-7/description/", 
        platform: "LeetCode",
        tags: ["Math", "Easy"],
        description: "Convert a base-10 integer to base-7 string."
      },
      { 
        id: "bit-12", 
        title: "Minimum Bit Flips to Convert Number", 
        url: "https://leetcode.com/problems/minimum-bit-flips-to-convert-number/", 
        platform: "LeetCode",
        tags: ["XOR", "Popcount", "Easy"],
        description: "Calculate how many bits need to be flipped to change number A to B."
      },
      { 
        id: "bit-13", 
        title: "Finding the Numbers", 
        url: "https://practice.geeksforgeeks.org/problems/finding-the-numbers0215/1", 
        platform: "GeeksForGeeks",
        tags: ["XOR", "Bit Manipulation", "Medium"],
        description: "Find two unique numbers in an array where every other number appears twice."
      },
      { 
        id: "bit-14", 
        title: "Set Bits", 
        url: "https://www.geeksforgeeks.org/problems/set-bits0143/1", 
        platform: "GeeksForGeeks",
        tags: ["Popcount", "Easy"],
        description: "Count the total number of set bits (1s) in a given integer."
      },
      { 
        id: "bit-15", 
        title: "Sum of All Subset XOR Totals", 
        url: "https://leetcode.com/problems/sum-of-all-subset-xor-totals/description/", 
        platform: "LeetCode",
        tags: ["Bit Manipulation", "Math", "Easy"],
        description: "Observe bitwise contribution across all subsets to solve in O(n)."
      }
    ]
  },
  {
    topicName: "Greedy",
    problems: [
      { 
        id: "gr-1", 
        title: "Activity Selection", 
        url: "https://www.geeksforgeeks.org/problems/activity-selection-1587115620/1", 
        platform: "GeeksForGeeks",
        tags: ["Sorting", "Easy"],
        description: "Maximize the number of tasks performed by picking the one that ends earliest."
      },
      { 
        id: "gr-2", 
        title: "BUSYMAN", 
        url: "https://www.spoj.com/problems/BUSYMAN/", 
        platform: "SPOJ",
        tags: ["Sorting", "Classic"],
        description: "SPOJ classic implementation of the Activity Selection problem."
      },
      { 
        id: "gr-3", 
        title: "N Meetings in One Room", 
        url: "https://practice.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1", 
        platform: "GeeksForGeeks",
        tags: ["Sorting", "Greedy", "Easy"],
        description: "Select the maximum number of non-overlapping meetings."
      },
      { 
        id: "gr-4", 
        title: "Meeting Rooms", 
        url: "https://www.interviewbit.com/problems/meeting-rooms/", 
        platform: "InterviewBit",
        tags: ["Sorting", "Easy"],
        description: "Check if a person can attend all meetings (i.e., no meetings overlap)."
      },
      { 
        id: "gr-5", 
        title: "Meeting Room 1", 
        url: "https://www.lintcode.com/problem/920/", 
        platform: "LintCode",
        tags: ["Sorting", "Easy"],
        description: "Equivalent to checking for any overlaps in a list of intervals."
      },
      { 
        id: "gr-6", 
        title: "Meeting Room 2", 
        url: "https://www.lintcode.com/problem/919/", 
        platform: "LintCode",
        tags: ["Sorting", "Min Heap", "Medium"],
        description: "Calculate the minimum number of meeting rooms required."
      },
      { 
        id: "gr-7", 
        title: "Minimum Platforms", 
        url: "https://practice.geeksforgeeks.org/problems/minimum-platforms-1587115620/1", 
        platform: "GeeksForGeeks",
        tags: ["Sorting", "Two Pointers", "Medium"],
        description: "Find the maximum number of trains present at a station simultaneously."
      },
      { 
        id: "gr-8", 
        title: "Job Sequencing Problem", 
        url: "https://practice.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1", 
        platform: "GeeksForGeeks", 
        tags: ["Sorting", "Disjoint Set", "Medium"],
        description: "Maximize total profit by scheduling jobs before their deadlines."
      },
      { 
        id: "gr-9", 
        title: "Max Chunks To Make Sorted", 
        url: "https://leetcode.com/problems/max-chunks-to-make-sorted/", 
        platform: "LeetCode",
        tags: ["Greedy", "Prefix Max", "Medium"],
        description: "Divide an array into maximum chunks such that sorting each chunk sorts the entire array."
      },
      { 
        id: "gr-10", 
        title: "Next Permutation", 
        url: "https://leetcode.com/problems/next-permutation/", 
        platform: "LeetCode",
        tags: ["Lexicographical", "Medium"],
        description: "Greedy strategy to find the smallest increment to the current permutation."
      },
      { 
        id: "gr-11", 
        title: "Maximum Performance of a Team", 
        url: "https://leetcode.com/problems/maximum-performance-of-a-team/", 
        platform: "LeetCode",
        tags: ["Sorting", "Priority Queue", "Hard"],
        description: "Calculate max efficiency (Sum of Speeds * Min Reliability) for a team of size k."
      },
      { 
        id: "gr-12", 
        title: "Find the Duplicate Number", 
        url: "https://leetcode.com/problems/find-the-duplicate-number/description/", 
        platform: "LeetCode",
        tags: ["Floyd's Cycle Finding", "Medium"],
        description: "Solve using the cycle detection greedy approach to maintain O(1) space."
      }
    ]
  },
  {
    topicName: "Dynamic Programming",
    problems: [
      { 
        id: "dp-1", 
        title: "Max Sum Without Adjacents", 
        url: "https://practice.geeksforgeeks.org/problems/max-sum-without-adjacents2430/1", 
        platform: "GeeksForGeeks",
        tags: ["DP", "Easy"],
        description: "House Robber logic: find the maximum sum of non-adjacent elements."
      },
      { 
        id: "dp-2", 
        title: "Weird Algorithm (Task 1068)", 
        url: "https://cses.fi/problemset/task/1068", 
        platform: "CSES",
        tags: ["Math", "Collatz Conjecture"],
        description: "Simulate the Collatz sequence for a given n."
      },
      { 
        id: "dp-3", 
        title: "Min Cost Climbing Stairs", 
        url: "https://leetcode.com/problems/min-cost-climbing-stairs/description/", 
        platform: "LeetCode",
        tags: ["DP", "Easy"],
        description: "Calculate the cheapest way to reach the top of a staircase with costs."
      },
      { 
        id: "dp-4", 
        title: "Climbing Stairs", 
        url: "https://leetcode.com/problems/climbing-stairs/", 
        platform: "LeetCode",
        tags: ["Fibonacci", "DP", "Easy"],
        description: "Count the number of ways to climb n stairs by taking 1 or 2 steps."
      },
      { 
        id: "dp-5", 
        title: "House Robber", 
        url: "https://leetcode.com/problems/house-robber/description/", 
        platform: "LeetCode",
        tags: ["DP", "Medium"],
        description: "Determine the max money stolen without triggering alarms in adjacent houses."
      },
      { 
        id: "dp-6", 
        title: "MST1", 
        url: "https://www.spoj.com/problems/MST1/", 
        platform: "SPOJ",
        tags: ["DP", "Recursion"],
        description: "Calculate the minimum number of steps to reduce n to 1 (divide by 2, 3 or subtract 1)."
      },
      { 
        id: "dp-7", 
        title: "Unique Paths", 
        url: "https://leetcode.com/problems/unique-paths/", 
        platform: "LeetCode",
        tags: ["Combinatorics", "DP", "Medium"],
        description: "Count paths from top-left to bottom-right in a grid moving only down or right."
      },
      { 
        id: "dp-8", 
        title: "Partition Equal Subset Sum", 
        url: "https://leetcode.com/problems/partition-equal-subset-sum/", 
        platform: "LeetCode",
        tags: ["0/1 Knapsack", "Medium"],
        description: "Check if an array can be split into two subsets with equal sums."
      },
      { 
        id: "dp-9", 
        title: "Unique Paths II", 
        url: "https://leetcode.com/problems/unique-paths-ii/", 
        platform: "LeetCode",
        tags: ["Matrix DP", "Medium"],
        description: "Extend Unique Paths to grids containing obstacles."
      },
      { 
        id: "dp-10", 
        title: "Minimum Path Sum", 
        url: "https://leetcode.com/problems/minimum-path-sum/", 
        platform: "LeetCode",
        tags: ["Matrix DP", "Medium"],
        description: "Find a path in a grid that minimizes the total sum of elements visited."
      },
      { 
        id: "dp-11", 
        title: "Target Sum", 
        url: "https://leetcode.com/problems/target-sum/", 
        platform: "LeetCode",
        tags: ["Subset Sum", "DP", "Medium"],
        description: "Assign +/- signs to array elements to achieve a specific target sum."
      },
      { 
        id: "dp-12", 
        title: "Coin Change", 
        url: "https://leetcode.com/problems/coin-change/", 
        platform: "LeetCode",
        tags: ["Unbounded Knapsack", "Medium"],
        description: "Find the minimum number of coins needed to make a specific amount."
      },
      { 
        id: "dp-13", 
        title: "Longest Increasing Subsequence", 
        url: "https://leetcode.com/problems/longest-increasing-subsequence/", 
        platform: "LeetCode",
        tags: ["Binary Search", "LIS", "Medium"],
        description: "Find the length of the longest strictly increasing subsequence."
      },
      { 
        id: "dp-14", 
        title: "Projects (Task 1140)", 
        url: "https://cses.fi/problemset/task/1140/", 
        platform: "CSES",
        tags: ["DP", "Binary Search", "Intervals"],
        description: "Maximize reward by selecting non-overlapping projects with start/end times."
      },
      { 
        id: "dp-15", 
        title: "Longest Common Subsequence", 
        url: "https://leetcode.com/problems/longest-common-subsequence/", 
        platform: "LeetCode",
        tags: ["String DP", "Medium"],
        description: "Find the length of the longest subsequence shared by two strings."
      },
      { 
        id: "dp-16", 
        title: "Maximum Height by Stacking Cuboids", 
        url: "https://leetcode.com/problems/maximum-height-by-stacking-cuboids/description/", 
        platform: "LeetCode",
        tags: ["LIS Variation", "Hard"],
        description: "Rotate and stack cuboids to achieve maximum total height."
      },
      { 
        id: "dp-17", 
        title: "Rod Cutting", 
        url: "https://www.geeksforgeeks.org/problems/rod-cutting0840/1", 
        platform: "GeeksForGeeks",
        tags: ["Unbounded Knapsack", "Medium"],
        description: "Maximize profit by cutting a rod into pieces of various lengths with different prices."
      },
      { 
        id: "dp-18", 
        title: "Longest Palindromic Subsequence", 
        url: "https://www.interviewbit.com/problems/longest-palindromic-subsequence/", 
        platform: "InterviewBit",
        tags: ["String DP", "Medium"],
        description: "Find the LCS of a string and its reverse to determine its longest palindromic subsequence."
      },
      { 
        id: "dp-19", 
        title: "Interleaving String", 
        url: "https://leetcode.com/problems/interleaving-string/", 
        platform: "LeetCode",
        tags: ["String DP", "Medium"],
        description: "Check if a string can be formed by interleaving two other strings while maintaining order."
      },
      { 
        id: "dp-20", 
        title: "Decode Ways", 
        url: "https://leetcode.com/problems/decode-ways/", 
        platform: "LeetCode",
        tags: ["DP", "Medium"],
        description: "Count how many ways a digit string can be decoded into letters A-Z."
      },
      { 
        id: "dp-21", 
        title: "Matrix Chain Multiplication", 
        url: "https://www.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1", 
        platform: "GeeksForGeeks",
        tags: ["MCM", "Hard"],
        description: "Find the most efficient way to multiply a series of matrices."
      },
      { 
        id: "dp-22", 
        title: "Boolean Parenthesization", 
        url: "https://www.geeksforgeeks.org/problems/boolean-parenthesization5610/1", 
        platform: "GeeksForGeeks",
        tags: ["MCM", "Hard"],
        description: "Count ways to parenthesize a boolean expression to make it evaluate to True."
      },
      { 
        id: "dp-23", 
        title: "Palindrome Partitioning II", 
        url: "https://leetcode.com/problems/palindrome-partitioning-ii/", 
        platform: "LeetCode",
        tags: ["DP", "Hard"],
        description: "Find the minimum number of cuts needed to partition a string into palindromes."
      },
      { 
        id: "dp-24", 
        title: "Best Time to Buy and Sell Stock IV", 
        url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/", 
        platform: "LeetCode",
        tags: ["State Space DP", "Hard"],
        description: "Maximize profit with at most k buy-sell transactions."
      },
      { 
        id: "dp-25", 
        title: "Count Square Submatrices with All Ones", 
        url: "https://leetcode.com/problems/count-square-submatrices-with-all-ones/", 
        platform: "LeetCode",
        tags: ["Matrix DP", "Medium"],
        description: "For each (i, j), store the size of the largest square ending there and sum them."
      },
      { 
        id: "dp-26", 
        title: "0 - 1 Knapsack Problem", 
        url: "https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1", 
        platform: "GeeksForGeeks",
        tags: ["0/1 Knapsack", "Medium"],
        description: "Pick items with weights and values to maximize value within a weight limit."
      },
      { 
        id: "dp-27", 
        title: "Range Sum Query 2D - Immutable", 
        url: "https://leetcode.com/problems/range-sum-query-2d-immutable/", 
        platform: "LeetCode",
        tags: ["2D-Prefix Sum", "Medium"],
        description: "Precompute 2D sums to return sum of any sub-rectangle in O(1)."
      },
      { 
        id: "dp-28", 
        title: "Wildcard Matching", 
        url: "https://leetcode.com/problems/wildcard-matching/description/", 
        platform: "LeetCode",
        tags: ["String DP", "Hard"],
        description: "Check if a string matches a pattern containing '?' and '*'."
      }
    ]
  },
  {
    topicName: "Heaps",
    problems: [
      { 
        id: "heap-1", 
        title: "Does Array Represent Heap", 
        url: "https://www.geeksforgeeks.org/problems/does-array-represent-heap4345/1", 
        platform: "GeeksForGeeks",
        tags: ["Array", "Heap property", "Easy"],
        description: "Check if for every index i, arr[i] is greater than its children at (2*i+1) and (2*i+2)."
      },
      { 
        id: "heap-2", 
        title: "Kth Largest Element", 
        url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", 
        platform: "LeetCode",
        tags: ["Min Heap", "Medium"],
        description: "Maintain a min-heap of size k to find the k-th largest element."
      },
      { 
        id: "heap-3", 
        title: "Top K Frequent Elements", 
        url: "https://leetcode.com/problems/top-k-frequent-elements/", 
        platform: "LeetCode",
        tags: ["Hash Map", "Heap", "Medium"],
        description: "Count frequencies and use a heap to extract the k most frequent items."
      },
      { 
        id: "heap-4", 
        title: "Top K Frequent Words", 
        url: "https://leetcode.com/problems/top-k-frequent-words/description/", 
        platform: "LeetCode",
        tags: ["Trie", "Heap", "Medium"],
        description: "Same as frequent elements, but requires lexicographical sorting for equal frequencies."
      },
      { 
        id: "heap-5", 
        title: "K Closest Points to Origin", 
        url: "https://leetcode.com/problems/k-closest-points-to-origin/", 
        platform: "LeetCode",
        tags: ["Max Heap", "Medium"],
        description: "Maintain a max-heap of size k based on Euclidean distance."
      },
      { 
        id: "heap-6", 
        title: "Maximum Sum Combinations", 
        url: "https://www.interviewbit.com/problems/maximum-sum-combinations/", 
        platform: "InterviewBit",
        tags: ["Heap", "Sorting", "Hard"],
        description: "Extract the top C sums by picking pairs (A[i], B[j]) using a max-heap."
      },
      { 
        id: "heap-7", 
        title: "Merge K Sorted Arrays", 
        url: "https://practice.geeksforgeeks.org/problems/merge-k-sorted-arrays/1", 
        platform: "GeeksForGeeks",
        tags: ["Heap", "Medium"],
        description: "Use a min-heap of size k to merge sorted arrays efficiently."
      },
      { 
        id: "heap-8", 
        title: "Merge K Sorted Linked Lists", 
        url: "https://practice.geeksforgeeks.org/problems/merge-k-sorted-linked-lists/1", 
        platform: "GeeksForGeeks",
        tags: ["Heap", "Linked List", "Hard"],
        description: "Continuously extract the minimum head among k lists using a priority queue."
      },
      { 
        id: "heap-9", 
        title: "Minimum Cost of Ropes", 
        url: "https://practice.geeksforgeeks.org/problems/minimum-cost-of-ropes-1587115620/1", 
        platform: "GeeksForGeeks",
        tags: ["Greedy", "Min Heap", "Easy"],
        description: "Always merge the two shortest ropes to minimize total cost."
      },
      { 
        id: "heap-10", 
        title: "Max Score Removing Stones", 
        url: "https://leetcode.com/problems/maximum-score-from-removing-stones/description/", 
        platform: "LeetCode",
        tags: ["Heap", "Greedy", "Medium"],
        description: "Repeatedly pick the two largest piles to maximize removals."
      },
      { 
        id: "heap-11", 
        title: "Task Scheduler", 
        url: "https://leetcode.com/problems/task-scheduler/description/", 
        platform: "LeetCode",
        tags: ["Heap", "Greedy", "Medium"],
        description: "Calculate the idle time needed between identical tasks with cooldown."
      },
      { 
        id: "heap-12", 
        title: "Hand of Straights", 
        url: "https://leetcode.com/problems/hand-of-straights/description/", 
        platform: "LeetCode",
        tags: ["Greedy", "Hash Map", "Medium"],
        description: "Check if an array can be divided into groups of consecutive integers."
      },
      { 
        id: "heap-13", 
        title: "Find Median from Data Stream", 
        url: "https://leetcode.com/problems/find-median-from-data-stream/", 
        platform: "LeetCode", 
        tags: ["Two Heaps", "Hard"],
        description: "Maintain a Max-Heap for the left half and a Min-Heap for the right half to find the median in O(1)."
      }
    ]
  },
  {
    topicName: "Trie",
    problems: [
      { 
        id: "trie-1", 
        title: "Implement Trie (Prefix Tree)", 
        url: "https://leetcode.com/problems/implement-trie-prefix-tree/description/", 
        platform: "LeetCode",
        tags: ["Design", "Medium"],
        description: "Build a tree structure where nodes represent characters for efficient string searching."
      },
      { 
        id: "trie-2", 
        title: "Longest Common Prefix Length", 
        url: "https://leetcode.com/problems/find-the-length-of-the-longest-common-prefix/description/", 
        platform: "LeetCode",
        tags: ["Trie", "Medium"],
        description: "Find the longest prefix shared by two arrays of strings using a Trie."
      },
      { 
        id: "trie-3", 
        title: "SUBXOR", 
        url: "https://www.spoj.com/problems/SUBXOR/", 
        platform: "SPOJ",
        tags: ["Trie", "Bit Manipulation"],
        description: "Count subarrays with XOR sum less than k using a binary Trie."
      },
      { 
        id: "trie-4", 
        title: "Max XOR of Two Numbers", 
        url: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/description/", 
        platform: "LeetCode",
        tags: ["Binary Trie", "Medium"],
        description: "Insert numbers into a Trie bit-by-bit and search for the complement for max XOR."
      },
      { 
        id: "trie-5", 
        title: "Max XOR With Element", 
        url: "https://leetcode.com/problems/maximum-xor-with-an-element-from-array/description/", 
        platform: "LeetCode",
        tags: ["Binary Trie", "Sorting", "Hard"],
        description: "Solve offline XOR queries by sorting both the array and queries by their limit."
      }
    ]
  },
  {
    topicName: "Disjoint Set Union (DSU)",
    problems: [
      { 
        id: "dsu-1", 
        title: "CLFLARR", 
        url: "https://www.spoj.com/problems/CLFLARR/", 
        platform: "SPOJ",
        tags: ["DSU", "Reverse Queries"],
        description: "Handle range color updates efficiently by working backwards with DSU."
      },
      { 
        id: "dsu-2", 
        title: "Redundant Connection", 
        url: "https://leetcode.com/problems/redundant-connection/description/", 
        platform: "LeetCode",
        tags: ["DSU", "Cycle Detection", "Medium"],
        description: "Find an edge that can be removed while keeping the graph connected (cycle detection)."
      },
      { 
        id: "dsu-3", 
        title: "Accounts Merge", 
        url: "https://leetcode.com/problems/accounts-merge/description/", 
        platform: "LeetCode",
        tags: ["DSU", "String Hash Map", "Medium"],
        description: "Group emails belonging to the same person using DSU."
      }
    ]
  },
  {
    topicName: "Graphs",
    problems: [
      { 
        id: "graph-1", 
        title: "DFS Traversal", 
        url: "https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1", 
        platform: "GeeksForGeeks",
        tags: ["DFS", "Recursion", "Easy"],
        description: "Explore graph nodes as deep as possible along each branch."
      },
      { 
        id: "graph-2", 
        title: "BFS Traversal", 
        url: "https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1", 
        platform: "GeeksForGeeks",
        tags: ["BFS", "Queue", "Easy"],
        description: "Explore all neighbors at the current distance before moving deeper."
      },
      { 
        id: "graph-3", 
        title: "Number of Provinces", 
        url: "https://leetcode.com/problems/number-of-provinces/description/", 
        platform: "LeetCode",
        tags: ["DFS", "BFS", "DSU", "Medium"],
        description: "Count disjoint connected components in an adjacency matrix."
      },
      { 
        id: "graph-4", 
        title: "Find if Path Exists", 
        url: "https://leetcode.com/problems/find-if-path-exists-in-graph/description/", 
        platform: "LeetCode",
        tags: ["DFS", "BFS", "Easy"],
        description: "Basic connectivity check between two nodes."
      },
      { 
        id: "graph-5", 
        title: "Rotting Oranges", 
        url: "https://leetcode.com/problems/rotting-oranges/description/", 
        platform: "LeetCode",
        tags: ["BFS", "Multi-source", "Medium"],
        description: "Find minimum time for decay to spread throughout a grid."
      },
      { 
        id: "graph-6", 
        title: "Flood Fill", 
        url: "https://leetcode.com/problems/flood-fill/description/", 
        platform: "LeetCode",
        tags: ["DFS", "BFS", "Easy"],
        description: "Change the color of an image pixel and all adjacent same-colored pixels."
      },
      { 
        id: "graph-7", 
        title: "Snakes and Ladders", 
        url: "https://leetcode.com/problems/snakes-and-ladders/description/", 
        platform: "LeetCode",
        tags: ["BFS", "Shortest Path", "Medium"],
        description: "Find minimum rolls to reach the end of the board using BFS on moves."
      },
      { 
        id: "graph-8", 
        title: "NAKANJ", 
        url: "https://www.spoj.com/problems/NAKANJ/", 
        platform: "SPOJ",
        tags: ["BFS", "Knight Move"],
        description: "Find minimum knight moves between two squares on a chessboard."
      },
      { 
        id: "graph-9", 
        title: "Detect Cycle (Undirected)", 
        url: "https://www.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1", 
        platform: "GeeksForGeeks",
        tags: ["DFS", "BFS", "Medium"],
        description: "Identify cycles in undirected graphs by tracking the parent node."
      },
      { 
        id: "graph-10", 
        title: "Detect Cycle (Directed)", 
        url: "https://www.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1", 
        platform: "GeeksForGeeks",
        tags: ["DFS", "Recursion Stack", "Medium"],
        description: "Detect cycles in directed graphs using a 'visiting' recursion stack."
      },
      { 
        id: "graph-11", 
        title: "01 Matrix", 
        url: "https://leetcode.com/problems/01-matrix/description/", 
        platform: "LeetCode",
        tags: ["Multi-source BFS", "Medium"],
        description: "For each cell, find the distance to the nearest 0."
      },
      { 
        id: "graph-12", 
        title: "Keys and Rooms", 
        url: "https://leetcode.com/problems/keys-and-rooms/description/", 
        platform: "LeetCode",
        tags: ["DFS", "Connectivity", "Medium"],
        description: "Check if all rooms can be visited starting with the key to room 0."
      },
      { 
        id: "graph-13", 
        title: "Surrounded Regions", 
        url: "https://leetcode.com/problems/surrounded-regions/description/", 
        platform: "LeetCode",
        tags: ["DFS", "Boundary traversal", "Medium"],
        description: "Flip all 'O's that aren't connected to the boundary."
      },
      { 
        id: "graph-14", 
        title: "Number of Enclaves", 
        url: "https://leetcode.com/problems/number-of-enclaves/description/", 
        platform: "LeetCode",
        tags: ["DFS", "Matrix", "Medium"],
        description: "Count land cells from which you cannot walk off the boundary."
      },
      { 
        id: "graph-15", 
        title: "Word Ladder", 
        url: "https://leetcode.com/problems/word-ladder/description/", 
        platform: "LeetCode",
        tags: ["BFS", "String Manipulation", "Hard"],
        description: "Find the shortest transformation sequence from startWord to endWord."
      },
      { 
        id: "graph-16", 
        title: "Number of Islands", 
        url: "https://leetcode.com/problems/number-of-islands/", 
        platform: "LeetCode",
        tags: ["DFS", "BFS", "Medium"],
        description: "Count distinct connected components of 1s in a grid."
      },
      { 
        id: "graph-17", 
        title: "Word Ladder II", 
        url: "https://leetcode.com/problems/word-ladder-ii/description/", 
        platform: "LeetCode",
        tags: ["BFS", "Backtracking", "Hard"],
        description: "Find all shortest word transformation sequences."
      },
      { 
        id: "graph-18", 
        title: "Evaluate Division", 
        url: "https://leetcode.com/problems/evaluate-division/description/", 
        platform: "LeetCode",
        tags: ["DFS", "Weighted Graph", "Medium"],
        description: "Calculate query results based on a set of known ratios using graph paths."
      },
      { 
        id: "graph-19", 
        title: "Is Graph Bipartite?", 
        url: "https://leetcode.com/problems/is-graph-bipartite/description/", 
        platform: "LeetCode",
        tags: ["BFS", "Two Coloring", "Medium"],
        description: "Check if a graph's nodes can be colored with two colors such that no neighbors share a color."
      },
      { 
        id: "graph-20", 
        title: "Course Schedule II (LintCode)", 
        url: "https://www.lintcode.com/problem/3663/", 
        platform: "LintCode",
        tags: ["Topological Sort", "Kahn's Algorithm"],
        description: "LintCode version of finding a valid course completion order."
      },
      { 
        id: "graph-21", 
        title: "Course Schedule II", 
        url: "https://leetcode.com/problems/course-schedule-ii/description/", 
        platform: "LeetCode",
        tags: ["Topological Sort", "Medium"],
        description: "Return a valid ordering of courses given their prerequisites."
      },
      { 
        id: "graph-22", 
        title: "Topological Sort", 
        url: "https://www.geeksforgeeks.org/problems/topological-sort/1", 
        platform: "GeeksForGeeks",
        tags: ["DFS", "Stack", "Medium"],
        description: "Linear ordering of nodes such that for every edge uv, u comes before v."
      },
      { 
        id: "graph-23", 
        title: "Find Eventual Safe States", 
        url: "https://leetcode.com/problems/find-eventual-safe-states/description/", 
        platform: "LeetCode",
        tags: ["DFS", "Topological Sort", "Medium"],
        description: "Identify nodes from which all paths eventually lead to a terminal node (no cycles)."
      },
      { 
        id: "graph-24", 
        title: "Alien Dictionary", 
        url: "https://leetcode.ca/all/269.html", 
        platform: "LeetCode",
        tags: ["Topological Sort", "Hard"],
        description: "Infer character ordering from a dictionary sorted in a foreign language."
      },
      { 
        id: "graph-25", 
        title: "Shortest Path Unit Distance", 
        url: "https://www.geeksforgeeks.org/problems/shortest-path-in-undirected-graph-having-unit-distance/1", 
        platform: "GeeksForGeeks",
        tags: ["BFS", "Easy"],
        description: "Calculate shortest distances from source in an unweighted graph."
      },
      { 
        id: "graph-26", 
        title: "Shortest Path Undirected", 
        url: "https://www.geeksforgeeks.org/problems/shortest-path-in-undirected-graph/1", 
        platform: "GeeksForGeeks",
        tags: ["BFS", "Medium"],
        description: "Find minimal edges between two nodes in an undirected graph."
      },
      { 
        id: "graph-27", 
        title: "Implementing Dijkstra (Adj Matrix)", 
        url: "https://www.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1", 
        platform: "GeeksForGeeks",
        tags: ["Greedy", "Shortest Path", "Medium"],
        description: "Classic shortest path algorithm for graphs with non-negative weights."
      },
      { 
        id: "graph-28", 
        title: "Largest Divisible Subset", 
        url: "https://leetcode.com/problems/largest-divisible-subset/description/", 
        platform: "LeetCode",
        tags: ["DP", "Graph", "Medium"],
        description: "Find a subset where for every pair (a, b), either a divides b or vice-versa."
      },
      { 
        id: "graph-29", 
        title: "Course Schedule", 
        url: "https://leetcode.com/problems/course-schedule/", 
        platform: "LeetCode",
        tags: ["Cycle Detection", "Topological Sort", "Medium"],
        description: "Determine if it's even possible to finish all courses (detect cycles)."
      },
      { 
        id: "graph-30", 
        title: "Clone Graph", 
        url: "https://leetcode.com/problems/clone-graph/", 
        platform: "LeetCode",
        tags: ["DFS", "Hash Map", "Medium"],
        description: "Make a deep copy of a graph structure."
      },
      { 
        id: "graph-31", 
        title: "Distance from Source (Bellman Ford)", 
        url: "https://www.geeksforgeeks.org/problems/distance-from-the-source-bellman-ford-algorithm/1", 
        platform: "GeeksForGeeks",
        tags: ["DP", "Negative Cycles", "Medium"],
        description: "Find shortest paths and detect negative weight cycles."
      },
      { 
        id: "graph-32", 
        title: "Floyd Warshall", 
        url: "https://www.geeksforgeeks.org/problems/implementing-floyd-warshall2042/1", 
        platform: "GeeksForGeeks",
        tags: ["DP", "All-Pairs Shortest Path", "Medium"],
        description: "Find shortest paths between every pair of nodes in O(N^3)."
      },
      { 
        id: "graph-33", 
        title: "Shortest Path in Binary Matrix", 
        url: "https://leetcode.com/problems/shortest-path-in-binary-matrix/description/", 
        platform: "LeetCode",
        tags: ["BFS", "Medium"],
        description: "Find the shortest path in a grid of 0s from top-left to bottom-right."
      },
      { 
        id: "graph-34", 
        title: "Path With Minimum Effort", 
        url: "https://leetcode.com/problems/path-with-minimum-effort/", 
        platform: "LeetCode",
        tags: ["Dijkstra", "Binary Search", "Medium"],
        description: "Minimize the maximum absolute difference between adjacent cells in a path."
      },
      { 
        id: "graph-35", 
        title: "Cheapest Flights Within K Stops", 
        url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/", 
        platform: "LeetCode",
        tags: ["BFS", "Dijkstra Variation", "Medium"],
        description: "Find minimum cost path with an additional constraint on number of edges."
      },
      { 
        id: "graph-36", 
        title: "Minimum Multiplications", 
        url: "https://www.geeksforgeeks.org/problems/minimum-multiplications-to-reach-end/1", 
        platform: "GeeksForGeeks",
        tags: ["BFS", "Modular Arithmetic", "Medium"],
        description: "Find the minimum number of multiplications from a set to reach a target value."
      },
      { 
        id: "graph-37", 
        title: "Champagne Tower", 
        url: "https://leetcode.com/problems/champagne-tower/", 
        platform: "LeetCode",
        tags: ["DP", "Simulation", "Medium"],
        description: "Simulate glass overflow to find how much liquid is in a specific glass."
      },
      { 
        id: "graph-38", 
        title: "Travelling Salesman Problem", 
        url: "https://www.geeksforgeeks.org/problems/travelling-salesman-problem2732/1", 
        platform: "GeeksForGeeks",
        tags: ["DP + Masking", "Hard"],
        description: "Find the minimum cost cycle visiting every city exactly once."
      },
      { 
        id: "graph-39", 
        title: "Number of Ways to Arrive", 
        url: "https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/", 
        platform: "LeetCode",
        tags: ["Dijkstra", "DP", "Medium"],
        description: "Count how many distinct shortest paths exist from source to destination."
      },
      { 
        id: "graph-40", 
        title: "Network Delay Time", 
        url: "https://leetcode.com/problems/network-delay-time/description/", 
        platform: "LeetCode",
        tags: ["Dijkstra", "Medium"],
        description: "Find the time when all nodes have received a signal from the source."
      },
      { 
        id: "graph-41", 
        title: "Reconstruct Itinerary", 
        url: "https://leetcode.com/problems/reconstruct-itinerary/description/", 
        platform: "LeetCode",
        tags: ["Eulerian Path", "Hierholzer's Algorithm", "Hard"],
        description: "Find a path that uses every edge (flight) exactly once in lexicographical order."
      }
    ]
  },
  {
    topicName: "Segment Tree / Fenwick Tree",
    problems: [
      { 
        id: "seg-1", 
        title: "Dynamic Range Sum Queries", 
        url: "https://cses.fi/problemset/task/1648/", 
        platform: "CSES",
        tags: ["Fenwick Tree", "Range Query"],
        description: "Support point updates and range sum queries efficiently."
      },
      { 
        id: "seg-2", 
        title: "Dynamic Range Minimum Queries", 
        url: "https://cses.fi/problemset/task/1649/", 
        platform: "CSES",
        tags: ["Segment Tree", "Range Query"],
        description: "Support point updates and range minimum queries."
      },
      { 
        id: "seg-3", 
        title: "Range Update Queries", 
        url: "https://cses.fi/problemset/task/1651", 
        platform: "CSES",
        tags: ["Lazy Propagation", "Segment Tree"],
        description: "Update a range of values and query for individual point values."
      }
    ]
  }
];