export type Platform = 'LeetCode' | 'GeeksForGeeks' | 'InterviewBit' | 'LintCode' | 'CodeForces' | 'SPOJ' | 'CSES' | 'HackerEarth' | 'Other';

export interface DSAProblem {
  id: string;
  title: string;
  url: string;
  platform: Platform;
  tags?: string[]; // e.g., "Hard", "New", "Voting-Algo"
  isCompleted?: boolean; // Useful for your tracker UI
}

export interface DSATopic {
  topicName: string;
  problems: DSAProblem[];
}

// Helper to determine platform from URL
const getPlatform = (url: string): Platform => {
  if (url.includes('leetcode')) return 'LeetCode';
  if (url.includes('geeksforgeeks')) return 'GeeksForGeeks';
  if (url.includes('interviewbit')) return 'InterviewBit';
  if (url.includes('lintcode')) return 'LintCode';
  if (url.includes('codeforces')) return 'CodeForces';
  if (url.includes('spoj')) return 'SPOJ';
  if (url.includes('cses')) return 'CSES';
  if (url.includes('hackerearth')) return 'HackerEarth';
  return 'Other';
};

export const SHEET: DSATopic[] = [
  {
    topicName: "Time Complexity",
    problems: [
      { id: "tc-1", title: "Time Complexity Analysis Practice", url: "https://www.geeksforgeeks.org/practice-questions-time-complexity-analysis/", platform: "GeeksForGeeks" },
      { id: "tc-2", title: "Time Complexity Problems", url: "https://www.interviewbit.com/courses/programming/time-complexity#problems", platform: "InterviewBit" },
    ]
  },
  {
    topicName: "Array and 2D Array",
    problems: [
      { id: "arr-1", title: "Kadane's Algorithm", url: "https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1", platform: "GeeksForGeeks" },
      { id: "arr-2", title: "Pascal's Triangle", url: "https://leetcode.com/problems/pascals-triangle/description/", platform: "LeetCode" },
      { id: "arr-3", title: "Majority Element", url: "https://leetcode.com/problems/majority-element/description/", platform: "LeetCode", tags: ["Voting-Algo"] },
      { id: "arr-4", title: "Zigzag Conversion", url: "https://leetcode.com/problems/zigzag-conversion/description/", platform: "LeetCode", tags: ["New"] },
      { id: "arr-5", title: "Max Consecutive Ones", url: "https://leetcode.com/problems/max-consecutive-ones/", platform: "LeetCode" },
      { id: "arr-6", title: "Repetitions", url: "https://cses.fi/problemset/task/1069", platform: "CSES" },
      { id: "arr-7", title: "Friends Of Appropriate Ages", url: "https://leetcode.com/problems/friends-of-appropriate-ages/", platform: "LeetCode", tags: ["Frequency Array"] },
      { id: "arr-8", title: "Valid Palindrome II", url: "https://leetcode.com/problems/valid-palindrome-ii/description/", platform: "LeetCode" },
      { id: "arr-9", title: "Range Sum Query Immutable", url: "https://leetcode.com/problems/range-sum-query-immutable/", platform: "LeetCode" },
      { id: "arr-10", title: "Two Sum", url: "https://leetcode.com/problems/two-sum/", platform: "LeetCode" },
      { id: "arr-11", title: "Two Sum II (Sorted)", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", platform: "LeetCode" },
      { id: "arr-12", title: "3Sum", url: "https://leetcode.com/problems/3sum/description/", platform: "LeetCode" },
      { id: "arr-13", title: "4Sum", url: "https://leetcode.com/problems/4sum/description/", platform: "LeetCode" },
      { id: "arr-14", title: "LintCode 3691", url: "https://www.lintcode.com/problem/3691/", platform: "LintCode" },
      { id: "arr-15", title: "Sort Colors", url: "https://leetcode.com/problems/sort-colors/", platform: "LeetCode" },
      { id: "arr-16", title: "First Element Occurring K Times", url: "https://www.geeksforgeeks.org/first-element-occurring-k-times-array/", platform: "GeeksForGeeks" },
      { id: "arr-17", title: "Max Distance Between Same Elements", url: "https://practice.geeksforgeeks.org/problems/max-distance-between-same-elements/1", platform: "GeeksForGeeks" },
      { id: "arr-18", title: "Maximum Difference Between Two Elements", url: "https://www.geeksforgeeks.org/maximum-difference-between-two-elements/", platform: "GeeksForGeeks" },
      { id: "arr-19", title: "In First But Second", url: "https://practice.geeksforgeeks.org/problems/in-first-but-second5423/1", platform: "GeeksForGeeks" },
      { id: "arr-20", title: "Maximum Product Subarray", url: "https://leetcode.com/problems/maximum-product-subarray/", platform: "LeetCode" },
      { id: "arr-21", title: "Move Zeroes", url: "https://leetcode.com/problems/move-zeroes/", platform: "LeetCode" },
      { id: "arr-22", title: "Best Time to Buy and Sell Stock", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", platform: "LeetCode" },
      { id: "arr-23", title: "Find Pivot Index", url: "https://leetcode.com/problems/find-pivot-index/description/", platform: "LeetCode" },
      { id: "arr-24", title: "Running Sum of 1d Array", url: "https://leetcode.com/problems/running-sum-of-1d-array/", platform: "LeetCode" },
      { id: "arr-25", title: "Longest Distinct Characters In String", url: "https://www.geeksforgeeks.org/problems/longest-distinct-characters-in-string5848/1", platform: "GeeksForGeeks" },
      { id: "arr-26", title: "Union Of Two Sorted Arrays", url: "https://www.geeksforgeeks.org/problems/union-of-two-sorted-arrays-1587115621/1", platform: "GeeksForGeeks", tags: ["New"] },
      { id: "arr-27", title: "Rotate Array", url: "https://leetcode.com/problems/rotate-array/description/", platform: "LeetCode", tags: ["New"] },
      { id: "arr-28", title: "Rearrange Array Elements By Sign", url: "https://leetcode.com/problems/rearrange-array-elements-by-sign/description/", platform: "LeetCode" },
      { id: "arr-29", title: "Next Permutation", url: "https://leetcode.com/problems/next-permutation/description/", platform: "LeetCode", tags: ["New", "Imp"] },
      { id: "arr-30", title: "Leaders In An Array", url: "https://www.geeksforgeeks.org/problems/leaders-in-an-array-1587115620/1", platform: "GeeksForGeeks" },
      { id: "arr-31", title: "Set Matrix Zeroes", url: "https://leetcode.com/problems/set-matrix-zeroes/description/", platform: "LeetCode" },
      { id: "arr-32", title: "Rotate Image", url: "https://leetcode.com/problems/rotate-image/description/", platform: "LeetCode" },
      { id: "arr-33", title: "Missing Number", url: "https://leetcode.com/problems/missing-number/description/", platform: "LeetCode" },
      { id: "arr-34", title: "Subarrays Size K Avg >= Threshold", url: "https://leetcode.com/problems/number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold/description/", platform: "LeetCode" },
      { id: "arr-35", title: "Maximal Rectangle", url: "https://leetcode.com/problems/maximal-rectangle/description/", platform: "LeetCode" },
      { id: "arr-36", title: "Greatest Sum Divisible By Three", url: "https://leetcode.com/problems/greatest-sum-divisible-by-three/description/", platform: "LeetCode" },
      { id: "arr-37", title: "First Missing Positive", url: "https://leetcode.com/problems/first-missing-positive/description/", platform: "LeetCode" },
      { id: "arr-38", title: "Find All Duplicates", url: "https://leetcode.com/problems/find-all-duplicates-in-an-array/description/", platform: "LeetCode" },
      { id: "arr-39", title: "Find All Numbers Disappeared", url: "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/description/", platform: "LeetCode" },
      { id: "arr-40", title: "Container With Most Water", url: "https://leetcode.com/problems/container-with-most-water/description/", platform: "LeetCode" },
      { id: "arr-41", title: "Product of Array Except Self", url: "https://leetcode.com/problems/product-of-array-except-self/description/", platform: "LeetCode" },
      { id: "arr-42", title: "Queries On A Matrix", url: "https://www.geeksforgeeks.org/problems/queries-on-a-matrix0443/1", platform: "GeeksForGeeks" },
      { id: "arr-43", title: "Trapping Rain Water", url: "https://leetcode.com/problems/trapping-rain-water/", platform: "LeetCode" },
      { id: "arr-44", title: "Maximum Sum Circular Subarray", url: "https://leetcode.com/problems/maximum-sum-circular-subarray/description/", platform: "LeetCode" }
    ]
  },
  {
    topicName: "Recursion And Backtracking",
    problems: [
      { id: "rec-1", title: "Power of Four", url: "https://leetcode.com/problems/power-of-four/description/", platform: "LeetCode" },
      { id: "rec-2", title: "Power of Two", url: "https://leetcode.com/problems/power-of-two/description/", platform: "LeetCode" },
      { id: "rec-3", title: "Pow(x, n)", url: "https://leetcode.com/problems/powx-n/description/", platform: "LeetCode" },
      { id: "rec-4", title: "Valid Palindrome", url: "https://leetcode.com/problems/valid-palindrome/description/", platform: "LeetCode" },
      { id: "rec-5", title: "Combination Sum", url: "https://leetcode.com/problems/combination-sum/", platform: "LeetCode" },
      { id: "rec-6", title: "Generate Parentheses", url: "https://leetcode.com/problems/generate-parentheses/", platform: "LeetCode" },
      { id: "rec-7", title: "Subset Sums", url: "https://practice.geeksforgeeks.org/problems/subset-sums2234/1", platform: "GeeksForGeeks" },
      { id: "rec-8", title: "Combination Sum II", url: "https://leetcode.com/problems/combination-sum-ii/description/", platform: "LeetCode" },
      { id: "rec-9", title: "Combination Sum III", url: "https://leetcode.com/problems/combination-sum-iii/description/", platform: "LeetCode" },
      { id: "rec-10", title: "Tower Of Hanoi", url: "https://www.geeksforgeeks.org/problems/tower-of-hanoi-1587115621/1", platform: "GeeksForGeeks" },
      { id: "rec-11", title: "Permutations", url: "https://leetcode.com/problems/permutations/", platform: "LeetCode", tags: ["Must try"] },
      { id: "rec-12", title: "Subsets", url: "https://leetcode.com/problems/subsets/", platform: "LeetCode" },
      { id: "rec-13", title: "Letter Combinations of a Phone Number", url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/", platform: "LeetCode" },
      { id: "rec-14", title: "Sum of All Subset XOR Totals", url: "https://leetcode.com/problems/sum-of-all-subset-xor-totals/", platform: "LeetCode" },
      { id: "rec-15", title: "Combination Sum IV", url: "https://leetcode.com/problems/combination-sum-iv/description/", platform: "LeetCode", tags: ["DP"] },
      { id: "rec-16", title: "Sudoku Solver", url: "https://leetcode.com/problems/sudoku-solver/", platform: "LeetCode", tags: ["Hard"] },
      { id: "rec-17", title: "Find the Winner of the Circular Game", url: "https://leetcode.com/problems/find-the-winner-of-the-circular-game/description/", platform: "LeetCode" },
      { id: "rec-18", title: "N-Queens", url: "https://leetcode.com/problems/n-queens/description/", platform: "LeetCode" },
      { id: "rec-19", title: "Palindrome Partitioning", url: "https://leetcode.com/problems/palindrome-partitioning/description/", platform: "LeetCode" },
      { id: "rec-20", title: "Rat in a Maze", url: "https://www.geeksforgeeks.org/problems/rat-in-a-maze-problem/1", platform: "GeeksForGeeks" },
      { id: "rec-21", title: "Word Search", url: "https://leetcode.com/problems/word-search/description/", platform: "LeetCode" },
      { id: "rec-22", title: "Subsets II", url: "https://leetcode.com/problems/subsets-ii/description/", platform: "LeetCode" },
      { id: "rec-23", title: "N-Queens II", url: "https://leetcode.com/problems/n-queens-ii/description/", platform: "LeetCode" },
      { id: "rec-24", title: "Count Good Numbers", url: "https://leetcode.com/problems/count-good-numbers/", platform: "LeetCode" },
      { id: "rec-25", title: "Sort a Stack", url: "https://www.geeksforgeeks.org/problems/sort-a-stack/1", platform: "GeeksForGeeks" },
      { id: "rec-26", title: "String to Integer (atoi)", url: "https://leetcode.com/problems/string-to-integer-atoi/description/", platform: "LeetCode", tags: ["Good implementation"] },
      { id: "rec-27", title: "All Unique Permutations", url: "https://www.interviewbit.com/problems/all-unique-permutations/", platform: "InterviewBit" },
      { id: "rec-28", title: "Kth Permutation Sequence", url: "https://www.interviewbit.com/problems/kth-permutation-sequence/", platform: "InterviewBit" },
      { id: "rec-29", title: "Restore IP Addresses", url: "https://leetcode.com/problems/restore-ip-addresses/description/", platform: "LeetCode" },
      { id: "rec-30", title: "Word Break II", url: "https://leetcode.com/problems/word-break-ii/description/", platform: "LeetCode" },
      { id: "rec-31", title: "Count Numbers With Unique Digits", url: "https://leetcode.com/problems/count-numbers-with-unique-digits/", platform: "LeetCode" }
    ]
  },
  {
    topicName: "Sorting",
    problems: [
      { id: "sort-1", title: "Squares of a Sorted Array", url: "https://leetcode.com/problems/squares-of-a-sorted-array/description/", platform: "LeetCode" },
      { id: "sort-2", title: "Merge Sorted Array", url: "https://leetcode.com/problems/merge-sorted-array/", platform: "LeetCode" },
      { id: "sort-3", title: "Merge Intervals", url: "https://leetcode.com/problems/merge-intervals/description/", platform: "LeetCode" },
      { id: "sort-4", title: "Sort Characters By Frequency", url: "https://leetcode.com/problems/sort-characters-by-frequency/description/", platform: "LeetCode" },
      { id: "sort-5", title: "Largest Number", url: "https://leetcode.com/problems/largest-number/description/", platform: "LeetCode" },
      { id: "sort-6", title: "How Many Numbers Are Smaller", url: "https://leetcode.com/problems/how-many-numbers-are-smaller-than-the-current-number/", platform: "LeetCode" },
      { id: "sort-7", title: "Sort an Array", url: "https://leetcode.com/problems/sort-an-array/description/", platform: "LeetCode" },
      { id: "sort-8", title: "Inversion of Array", url: "https://www.geeksforgeeks.org/problems/inversion-of-array-1587115620/1", platform: "GeeksForGeeks" },
      { id: "sort-9", title: "Kth Largest Element", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", platform: "LeetCode" },
      { id: "sort-10", title: "Rotate Array by N Elements", url: "https://practice.geeksforgeeks.org/problems/rotate-array-by-n-elements-1587115621/1", platform: "GeeksForGeeks" },
      { id: "sort-11", title: "Reverse Pairs", url: "https://leetcode.com/problems/reverse-pairs/description/", platform: "LeetCode" },
      { id: "sort-12", title: "Largest Number Variation", url: "https://codeforces.com/problemset/problem/632/C", platform: "CodeForces" }
    ]
  },
  {
    topicName: "Linked List",
    problems: [
      { id: "ll-1", title: "Linked List Insertion", url: "https://practice.geeksforgeeks.org/problems/linked-list-insertion-1587115620/1", platform: "GeeksForGeeks" },
      { id: "ll-2", title: "Count Nodes of Linked List", url: "https://www.geeksforgeeks.org/problems/count-nodes-of-linked-list/1", platform: "GeeksForGeeks" },
      { id: "ll-3", title: "Middle of the Linked List", url: "https://leetcode.com/problems/middle-of-the-linked-list/", platform: "LeetCode" },
      { id: "ll-4", title: "Reverse Linked List", url: "https://leetcode.com/problems/reverse-linked-list/", platform: "LeetCode" },
      { id: "ll-5", title: "Remove Nth Node From End", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", platform: "LeetCode" },
      { id: "ll-6", title: "Delete Node in a Linked List", url: "https://leetcode.com/problems/delete-node-in-a-linked-list/", platform: "LeetCode" },
      { id: "ll-7", title: "Linked List Cycle", url: "https://leetcode.com/problems/linked-list-cycle/", platform: "LeetCode" },
      { id: "ll-8", title: "Linked List Cycle II", url: "https://leetcode.com/problems/linked-list-cycle-ii/", platform: "LeetCode" },
      { id: "ll-9", title: "Add Two Numbers", url: "https://practice.geeksforgeeks.org/problems/add-two-numbers-represented-by-linked-lists/1", platform: "GeeksForGeeks" },
      { id: "ll-10", title: "Merge Two Sorted Lists", url: "https://leetcode.com/problems/merge-two-sorted-lists/", platform: "LeetCode" },
      { id: "ll-11", title: "Palindrome Linked List", url: "https://leetcode.com/problems/palindrome-linked-list/", platform: "LeetCode" },
      { id: "ll-12", title: "Reorder List", url: "https://leetcode.com/problems/reorder-list/", platform: "LeetCode" },
      { id: "ll-13", title: "Add Two Numbers II", url: "https://leetcode.com/problems/add-two-numbers-ii/", platform: "LeetCode" },
      { id: "ll-14", title: "Intersection of Two Linked Lists", url: "https://leetcode.com/problems/intersection-of-two-linked-lists", platform: "LeetCode" },
      { id: "ll-15", title: "Remove Duplicates from Sorted List", url: "https://www.geeksforgeeks.org/remove-duplicates-from-a-sorted-linked-list/", platform: "GeeksForGeeks" },
      { id: "ll-16", title: "Swap Nodes in Pairs", url: "https://leetcode.com/problems/swap-nodes-in-pairs/", platform: "LeetCode" },
      { id: "ll-17", title: "Odd Even Linked List", url: "https://leetcode.com/problems/odd-even-linked-list/", platform: "LeetCode" },
      { id: "ll-18", title: "Sort List", url: "https://leetcode.com/problems/sort-list/", platform: "LeetCode", tags: ["Implementation Skill"] },
      { id: "ll-19", title: "Flattening a Linked List", url: "https://practice.geeksforgeeks.org/problems/flattening-a-linked-list/1", platform: "GeeksForGeeks" },
      { id: "ll-20", title: "Reverse Nodes in k-Group", url: "https://leetcode.com/problems/reverse-nodes-in-k-group/", platform: "LeetCode" },
      { id: "ll-21", title: "Linked List Matrix", url: "https://www.geeksforgeeks.org/problems/linked-list-matrix/1", platform: "GeeksForGeeks", tags: ["Implement Skill"] },
      { id: "ll-22", title: "Merge k Sorted Lists", url: "https://leetcode.com/problems/merge-k-sorted-lists/description/", platform: "LeetCode", tags: ["Heap"] },
      { id: "ll-23", title: "Deletion and Reverse in Linked List", url: "https://www.geeksforgeeks.org/problems/deletion-and-reverse-in-linked-list/1", platform: "GeeksForGeeks", tags: ["New"] },
      { id: "ll-24", title: "Reverse a Doubly Linked List", url: "https://www.geeksforgeeks.org/problems/reverse-a-doubly-linked-list/1", platform: "GeeksForGeeks" },
      { id: "ll-25", title: "Find Length of Loop", url: "https://www.geeksforgeeks.org/problems/find-length-of-loop/1", platform: "GeeksForGeeks" },
      { id: "ll-26", title: "Delete All Occurrences of Key in DLL", url: "https://www.geeksforgeeks.org/problems/delete-all-occurrences-of-a-given-key-in-a-doubly-linked-list/1", platform: "GeeksForGeeks" },
      { id: "ll-27", title: "Rotate List", url: "https://leetcode.com/problems/rotate-list/description/", platform: "LeetCode" },
      { id: "ll-28", title: "Find Pairs With Given Sum in DLL", url: "https://www.geeksforgeeks.org/problems/find-pairs-with-given-sum-in-doubly-linked-list/1", platform: "GeeksForGeeks" },
      { id: "ll-29", title: "LRU Cache", url: "https://leetcode.com/problems/lru-cache/", platform: "LeetCode" },
      { id: "ll-30", title: "Copy List with Random Pointer", url: "https://leetcode.com/problems/copy-list-with-random-pointer/", platform: "LeetCode" }
    ]
  },
  {
    topicName: "Stacks",
    problems: [
      { id: "st-1", title: "Remove All Adjacent Duplicates II", url: "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/", platform: "LeetCode" },
      { id: "st-2", title: "Remove All Adjacent Duplicates", url: "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/", platform: "LeetCode" },
      { id: "st-3", title: "Daily Temperatures", url: "https://leetcode.com/problems/daily-temperatures/", platform: "LeetCode" },
      { id: "st-4", title: "Next Larger Element", url: "https://www.geeksforgeeks.org/problems/next-larger-element-1587115620/1", platform: "GeeksForGeeks" },
      { id: "st-5", title: "Previous Greater Element", url: "https://www.geeksforgeeks.org/previous-greater-element/", platform: "GeeksForGeeks" },
      { id: "st-6", title: "Smallest Number on Left", url: "https://www.geeksforgeeks.org/problems/smallest-number-on-left3403/1", platform: "GeeksForGeeks" },
      { id: "st-7", title: "Valid Parentheses", url: "https://leetcode.com/problems/valid-parentheses/", platform: "LeetCode" },
      { id: "st-8", title: "Maximum Nesting Depth", url: "https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/", platform: "LeetCode" },
      { id: "st-9", title: "Next Greater Element I", url: "https://leetcode.com/problems/next-greater-element-i/", platform: "LeetCode" },
      { id: "st-10", title: "Next Greater Element II", url: "https://leetcode.com/problems/next-greater-element-ii/", platform: "LeetCode" },
      { id: "st-11", title: "Nearest Smaller Element", url: "https://www.interviewbit.com/problems/nearest-smaller-element/", platform: "InterviewBit" },
      { id: "st-12", title: "Min Stack", url: "https://leetcode.com/problems/min-stack/", platform: "LeetCode" },
      { id: "st-13", title: "Backspace String Compare", url: "https://leetcode.com/problems/backspace-string-compare/", platform: "LeetCode" },
      { id: "st-14", title: "Asteroid Collision", url: "https://leetcode.com/problems/asteroid-collision/", platform: "LeetCode" },
      { id: "st-15", title: "Evaluate Reverse Polish Notation", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/description/", platform: "LeetCode" },
      { id: "st-16", title: "Sum of Subarray Minimums", url: "https://leetcode.com/problems/sum-of-subarray-minimums/description/", platform: "LeetCode" },
      { id: "st-17", title: "Maximal Rectangle", url: "https://leetcode.com/problems/maximal-rectangle/description/", platform: "LeetCode" },
      { id: "st-18", title: "The Celebrity Problem", url: "https://www.geeksforgeeks.org/problems/the-celebrity-problem/1", platform: "GeeksForGeeks" },
      { id: "st-19", title: "Remove K Digits", url: "https://leetcode.com/problems/remove-k-digits/description/", platform: "LeetCode" },
      { id: "st-20", title: "Design Stack With Increment", url: "https://leetcode.com/problems/design-a-stack-with-increment-operation/", platform: "LeetCode" },
      { id: "st-21", title: "Stock Span Problem", url: "https://www.geeksforgeeks.org/problems/stock-span-problem-1587115621/1", platform: "GeeksForGeeks" },
      { id: "st-22", title: "Online Stock Span", url: "https://leetcode.com/problems/online-stock-span/", platform: "LeetCode" },
      { id: "st-23", title: "Postfix to Infix", url: "https://www.geeksforgeeks.org/problems/postfix-to-infix-conversion/1", platform: "GeeksForGeeks" },
      { id: "st-24", title: "Largest Rectangle in Histogram", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", platform: "LeetCode" },
      { id: "st-25", title: "Find the Town Judge", url: "https://leetcode.com/problems/find-the-town-judge/", platform: "LeetCode" },
      { id: "st-26", title: "Basic Calculator IV", url: "https://leetcode.com/problems/basic-calculator-iv/description/", platform: "LeetCode" }
    ]
  },
  {
    topicName: "Queue + Deque",
    problems: [
      { id: "q-1", title: "Implement Queue using Stacks", url: "https://leetcode.com/problems/implement-queue-using-stacks/description/", platform: "LeetCode" },
      { id: "q-2", title: "Implement Stack using Queues", url: "https://leetcode.com/problems/implement-stack-using-queues/", platform: "LeetCode" },
      { id: "q-3", title: "Queue Using Two Stacks", url: "https://www.geeksforgeeks.org/problems/queue-using-two-stacks/1", platform: "GeeksForGeeks" },
      { id: "q-4", title: "Design Front Middle Back Queue", url: "https://leetcode.com/problems/design-front-middle-back-queue/description/", platform: "LeetCode" },
      { id: "q-5", title: "First Negative Integer in Window", url: "https://practice.geeksforgeeks.org/problems/first-negative-integer-in-every-window-of-size-k3345/1", platform: "GeeksForGeeks" },
      { id: "q-6", title: "First Non-Repeating Char in Stream", url: "https://www.geeksforgeeks.org/problems/first-non-repeating-character-in-a-stream1216/1", platform: "GeeksForGeeks" },
      { id: "q-7", title: "Max Consecutive Ones III", url: "https://leetcode.com/problems/max-consecutive-ones-iii/", platform: "LeetCode" },
      { id: "q-8", title: "Longest K Unique Characters", url: "https://www.geeksforgeeks.org/problems/longest-k-unique-characters-substring0853/1", platform: "GeeksForGeeks" },
      { id: "q-9", title: "Length of Longest Substring", url: "https://www.geeksforgeeks.org/problems/length-of-the-longest-substring3036/1", platform: "GeeksForGeeks", tags: ["IMP"] },
      { id: "q-10", title: "Rotting Oranges", url: "https://leetcode.com/problems/rotting-oranges/", platform: "LeetCode" },
      { id: "q-11", title: "Sliding Window Maximum", url: "https://leetcode.com/problems/sliding-window-maximum/description/", platform: "LeetCode" },
      { id: "q-12", title: "Number of Substrings Containing All Three Characters", url: "https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/", platform: "LeetCode" },
      { id: "q-13", title: "Task Scheduler II", url: "https://leetcode.com/problems/task-scheduler-ii/description/", platform: "LeetCode", tags: ["New"] },
      { id: "q-14", title: "Minimum Size Subarray Sum", url: "https://leetcode.com/problems/minimum-size-subarray-sum/", platform: "LeetCode" },
      { id: "q-15", title: "Longest Substring Without Repeating Characters", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/description/", platform: "LeetCode" }
    ]
  },
  {
    topicName: "HashMap",
    problems: [
      { id: "hm-1", title: "Find Occurrences of Element", url: "https://leetcode.com/problems/find-occurrences-of-an-element-in-an-array/description/", platform: "LeetCode" },
      { id: "hm-2", title: "Zero Sum Subarrays", url: "https://www.geeksforgeeks.org/problems/zero-sum-subarrays1825/1", platform: "GeeksForGeeks" },
      { id: "hm-3", title: "Largest Subarray with 0 Sum", url: "https://www.geeksforgeeks.org/problems/largest-subarray-with-0-sum/1", platform: "GeeksForGeeks" },
      { id: "hm-4", title: "Longest Sub-Array with Sum K", url: "https://www.geeksforgeeks.org/problems/longest-sub-array-with-sum-k0809/1", platform: "GeeksForGeeks" },
      { id: "hm-5", title: "Subarray Sum Equals K", url: "https://leetcode.com/problems/subarray-sum-equals-k/description/", platform: "LeetCode" },
      { id: "hm-6", title: "Subarray Sums Divisible by K", url: "https://leetcode.com/problems/subarray-sums-divisible-by-k/description/", platform: "LeetCode" },
      { id: "hm-7", title: "Subarray with Given XOR", url: "https://www.interviewbit.com/problems/subarray-with-given-xor/", platform: "InterviewBit" },
      { id: "hm-8", title: "Group Anagrams", url: "https://leetcode.com/problems/group-anagrams/description/", platform: "LeetCode" },
      { id: "hm-9", title: "Subarray with 0 Sum", url: "https://www.geeksforgeeks.org/problems/subarray-with-0-sum-1587115621/1", platform: "GeeksForGeeks" },
      { id: "hm-10", title: "Non-Repeating Character", url: "https://www.geeksforgeeks.org/problems/non-repeating-character-1587115620/1", platform: "GeeksForGeeks" },
      { id: "hm-11", title: "Number of Submatrices That Sum to Target", url: "https://leetcode.com/problems/number-of-submatrices-that-sum-to-target/description/", platform: "LeetCode" },
      { id: "hm-12", title: "Longest Consecutive Sequence", url: "https://leetcode.com/problems/longest-consecutive-sequence/description/", platform: "LeetCode" }
    ]
  },
  {
    topicName: "Strings",
    problems: [
      { id: "str-1", title: "Palindromic Substrings", url: "https://leetcode.com/problems/palindromic-substrings/", platform: "LeetCode" },
      { id: "str-2", title: "Reverse Words in a String III", url: "https://leetcode.com/problems/reverse-words-in-a-string-iii/", platform: "LeetCode" },
      { id: "str-3", title: "Sort Characters By Frequency", url: "https://leetcode.com/problems/sort-characters-by-frequency/", platform: "LeetCode" },
      { id: "str-4", title: "Remove Characters Present in Second String", url: "https://www.geeksforgeeks.org/remove-characters-from-the-first-string-which-are-present-in-the-second-string/", platform: "GeeksForGeeks" },
      { id: "str-5", title: "Remove K Digits", url: "https://leetcode.com/problems/remove-k-digits/", platform: "LeetCode" },
      { id: "str-6", title: "Last Match", url: "https://www.geeksforgeeks.org/problems/last-match1928/1", platform: "GeeksForGeeks" },
      { id: "str-7", title: "Find Index of First Occurrence", url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/description/", platform: "LeetCode" },
      { id: "str-8", title: "Find All Anagrams in a String", url: "https://leetcode.com/problems/find-all-anagrams-in-a-string/description/", platform: "LeetCode" }
    ]
  },
  {
    topicName: "Binary Search",
    problems: [
      { id: "bs-1", title: "Sqrt(x)", url: "https://leetcode.com/problems/sqrtx/description/", platform: "LeetCode" },
      { id: "bs-2", title: "Find First and Last Position", url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/", platform: "LeetCode" },
      { id: "bs-3", title: "Floor in a Sorted Array", url: "https://www.geeksforgeeks.org/problems/floor-in-a-sorted-array-1587115620/1", platform: "GeeksForGeeks" },
      { id: "bs-4", title: "Ceil the Floor", url: "https://www.geeksforgeeks.org/problems/ceil-the-floor2802/1", platform: "GeeksForGeeks" },
      { id: "bs-5", title: "Number of Occurrence", url: "https://www.geeksforgeeks.org/problems/number-of-occurrence2259/1", platform: "GeeksForGeeks" },
      { id: "bs-6", title: "Search a 2D Matrix", url: "https://leetcode.com/problems/search-a-2d-matrix/", platform: "LeetCode" },
      { id: "bs-7", title: "Search a 2D Matrix II", url: "https://leetcode.com/problems/search-a-2d-matrix-ii/", platform: "LeetCode", tags: ["Staircase search"] },
      { id: "bs-8", title: "Row with Max 1s", url: "https://www.geeksforgeeks.org/problems/row-with-max-1s0023/1", platform: "GeeksForGeeks", tags: ["Staircase search"] },
      { id: "bs-9", title: "Search in Rotated Sorted Array", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", platform: "LeetCode" },
      { id: "bs-10", title: "Find Minimum in Rotated Sorted Array", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/description/", platform: "LeetCode" },
      { id: "bs-11", title: "Rotation", url: "https://www.geeksforgeeks.org/problems/rotation4723/1", platform: "GeeksForGeeks", tags: ["Kth rotation"] },
      { id: "bs-12", title: "Guess Number Higher or Lower", url: "https://leetcode.com/problems/guess-number-higher-or-lower/", platform: "LeetCode" },
      { id: "bs-13", title: "Find Peak Element", url: "https://leetcode.com/problems/find-peak-element/", platform: "LeetCode" },
      { id: "bs-14", title: "Single Element in a Sorted Array", url: "https://leetcode.com/problems/single-element-in-a-sorted-array/", platform: "LeetCode" },
      { id: "bs-15", title: "The Painter's Partition Problem", url: "https://practice.geeksforgeeks.org/problems/the-painters-partition-problem1535/1", platform: "GeeksForGeeks" },
      { id: "bs-16", title: "Aggressive Cows", url: "https://www.geeksforgeeks.org/problems/aggressive-cows/0", platform: "GeeksForGeeks" },
      { id: "bs-17", title: "Minimum Limit of Balls in a Bag", url: "https://leetcode.com/problems/minimum-limit-of-balls-in-a-bag/", platform: "LeetCode" },
      { id: "bs-18", title: "Koko Eating Bananas", url: "https://leetcode.com/problems/koko-eating-bananas/", platform: "LeetCode" },
      { id: "bs-19", title: "Minimum Days to Make M Bouquets", url: "https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/description/", platform: "LeetCode" },
      { id: "bs-20", title: "Allocate Books", url: "https://www.interviewbit.com/problems/allocate-books/", platform: "InterviewBit" },
      { id: "bs-21", title: "Find Smallest Divisor Given Threshold", url: "https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/description/", platform: "LeetCode" },
      { id: "bs-22", title: "Minimum Window Substring", url: "https://leetcode.com/problems/minimum-window-substring/description/", platform: "LeetCode" },
      { id: "bs-23", title: "Median of Two Sorted Arrays", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/description/", platform: "LeetCode", tags: ["Hard"] },
      { id: "bs-24", title: "K-th Element of Two Sorted Arrays", url: "https://www.geeksforgeeks.org/problems/k-th-element-of-two-sorted-array1317/1", platform: "GeeksForGeeks" },
      { id: "bs-25", title: "Find K Closest Elements", url: "https://leetcode.com/problems/find-k-closest-elements/description/", platform: "LeetCode" }
    ]
  },
  {
    topicName: "Math & Number Theory",
    problems: [
      { id: "math-1", title: "Count Primes", url: "https://leetcode.com/problems/count-primes/description/", platform: "LeetCode" },
      { id: "math-2", title: "Divisor Summation", url: "https://www.spoj.com/problems/DIVSUM/", platform: "SPOJ" },
      { id: "math-3", title: "Four Divisors", url: "https://leetcode.com/problems/four-divisors/description/", platform: "LeetCode" },
      { id: "math-4", title: "Find GCD of Array", url: "https://leetcode.com/problems/find-greatest-common-divisor-of-array/description/", platform: "LeetCode" },
      { id: "math-5", title: "Problem 26A", url: "https://codeforces.com/problemset/problem/26/A", platform: "CodeForces" },
      { id: "math-6", title: "Problem 1294C", url: "https://codeforces.com/problemset/problem/1294/C", platform: "CodeForces" },
      { id: "math-7", title: "Task 1617", url: "https://cses.fi/problemset/task/1617", platform: "CSES" }
    ]
  },
  {
    topicName: "Trees (Binary + BST)",
    problems: [
      { id: "tree-1", title: "Preorder Traversal", url: "https://www.geeksforgeeks.org/problems/preorder-traversal/1", platform: "GeeksForGeeks" },
      { id: "tree-2", title: "Binary Tree Zigzag Level Order", url: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/", platform: "LeetCode" },
      { id: "tree-3", title: "Same Tree", url: "https://leetcode.com/problems/same-tree/", platform: "LeetCode" },
      { id: "tree-4", title: "Symmetric Tree", url: "https://leetcode.com/problems/symmetric-tree/", platform: "LeetCode" },
      { id: "tree-5", title: "Left View of Binary Tree", url: "https://www.geeksforgeeks.org/problems/left-view-of-binary-tree/1", platform: "GeeksForGeeks" },
      { id: "tree-6", title: "Invert Binary Tree", url: "https://leetcode.com/problems/invert-binary-tree/", platform: "LeetCode" },
      { id: "tree-7", title: "Binary Tree Maximum Path Sum", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", platform: "LeetCode" },
      { id: "tree-8", title: "Check for Balanced Tree", url: "https://www.geeksforgeeks.org/problems/check-for-balanced-tree/1", platform: "GeeksForGeeks" },
      { id: "tree-9", title: "Subtree of Another Tree", url: "https://leetcode.com/problems/subtree-of-another-tree/", platform: "LeetCode" },
      { id: "tree-10", title: "Diameter of Binary Tree", url: "https://leetcode.com/problems/diameter-of-binary-tree/description/", platform: "LeetCode" },
      { id: "tree-11", title: "Top View of Binary Tree", url: "https://practice.geeksforgeeks.org/problems/top-view-of-binary-tree/1", platform: "GeeksForGeeks" },
      { id: "tree-12", title: "LCA of Binary Tree", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/description/", platform: "LeetCode" },
      { id: "tree-13", title: "Right View of Binary Tree", url: "https://practice.geeksforgeeks.org/problems/right-view-of-binary-tree/1", platform: "GeeksForGeeks" },
      { id: "tree-14", title: "Sum Root to Leaf Numbers", url: "https://leetcode.com/problems/sum-root-to-leaf-numbers/", platform: "LeetCode" },
      { id: "tree-15", title: "Range Sum of BST", url: "https://leetcode.com/problems/range-sum-of-bst/description/", platform: "LeetCode" },
      { id: "tree-16", title: "Minimum Absolute Difference in BST", url: "https://leetcode.com/problems/minimum-absolute-difference-in-bst/description/", platform: "LeetCode" },
      { id: "tree-17", title: "Kth Smallest Element in a BST", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", platform: "LeetCode" },
      { id: "tree-18", title: "Construct BT from Preorder/Inorder", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/", platform: "LeetCode" },
      { id: "tree-19", title: "Pseudo-Palindromic Paths", url: "https://leetcode.com/problems/pseudo-palindromic-paths-in-a-binary-tree/", platform: "LeetCode" },
      { id: "tree-20", title: "BST Iterator", url: "https://leetcode.com/problems/binary-search-tree-iterator/", platform: "LeetCode" },
      { id: "tree-21", title: "Two Sum IV - Input is a BST", url: "https://leetcode.com/problems/two-sum-iv-input-is-a-bst/", platform: "LeetCode" },
      { id: "tree-22", title: "All Nodes Distance K in Binary Tree", url: "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/", platform: "LeetCode" },
      { id: "tree-23", title: "Unique Binary Search Trees", url: "https://leetcode.com/problems/unique-binary-search-trees/", platform: "LeetCode" },
      { id: "tree-24", title: "N-ary Tree Preorder Traversal", url: "https://leetcode.com/problems/n-ary-tree-preorder-traversal/description/", platform: "LeetCode" },
      { id: "tree-25", title: "N-ary Tree Postorder Traversal", url: "https://leetcode.com/problems/n-ary-tree-postorder-traversal/", platform: "LeetCode" },
      { id: "tree-26", title: "Average of Levels in Binary Tree", url: "https://leetcode.com/problems/average-of-levels-in-binary-tree/", platform: "LeetCode" },
      { id: "tree-27", title: "Print BT in Vertical Order", url: "https://www.geeksforgeeks.org/problems/print-a-binary-tree-in-vertical-order/", platform: "GeeksForGeeks" },
      { id: "tree-28", title: "LCA of BST", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/description/", platform: "LeetCode" },
      { id: "tree-29", title: "Validate Binary Search Tree", url: "https://leetcode.com/problems/validate-binary-search-tree/", platform: "LeetCode" }
    ]
  },
  {
    topicName: "Bit Manipulation",
    problems: [
      { id: "bit-1", title: "Single Number", url: "https://leetcode.com/problems/single-number/description/", platform: "LeetCode" },
      { id: "bit-2", title: "Decode XORed Array", url: "https://leetcode.com/problems/decode-xored-array/description/", platform: "LeetCode" },
      { id: "bit-3", title: "Bits Basic Operations", url: "https://www.geeksforgeeks.org/problems/bits-basic-operations/1", platform: "GeeksForGeeks" },
      { id: "bit-4", title: "Sort Integers by Number of 1 Bits", url: "https://leetcode.com/problems/sort-integers-by-the-number-of-1-bits/", platform: "LeetCode" },
      { id: "bit-5", title: "Single Number II", url: "https://leetcode.com/problems/single-number-ii/", platform: "LeetCode" },
      { id: "bit-6", title: "Find First Repeated Character", url: "https://practice.geeksforgeeks.org/problems/find-first-repeated-character4108/1", platform: "GeeksForGeeks", tags: ["Must try"] },
      { id: "bit-7", title: "Counting Bits", url: "https://leetcode.com/problems/counting-bits/", platform: "LeetCode" },
      { id: "bit-8", title: "Find the Duplicate Number", url: "https://leetcode.com/problems/find-the-duplicate-number/description/", platform: "LeetCode", tags: ["Tricky"] },
      { id: "bit-9", title: "Gray Code", url: "https://leetcode.com/problems/gray-code/description/", platform: "LeetCode" },
      { id: "bit-10", title: "Convert Number to Hexadecimal", url: "https://leetcode.com/problems/convert-a-number-to-hexadecimal/description/", platform: "LeetCode" },
      { id: "bit-11", title: "Base 7", url: "https://leetcode.com/problems/base-7/description/", platform: "LeetCode" },
      { id: "bit-12", title: "Minimum Bit Flips to Convert Number", url: "https://leetcode.com/problems/minimum-bit-flips-to-convert-number/", platform: "LeetCode" },
      { id: "bit-13", title: "Finding the Numbers", url: "https://practice.geeksforgeeks.org/problems/finding-the-numbers0215/1", platform: "GeeksForGeeks" },
      { id: "bit-14", title: "Set Bits", url: "https://www.geeksforgeeks.org/problems/set-bits0143/1", platform: "GeeksForGeeks" },
      { id: "bit-15", title: "Sum of All Subset XOR Totals", url: "https://leetcode.com/problems/sum-of-all-subset-xor-totals/description/", platform: "LeetCode" }
    ]
  },
  {
    topicName: "Greedy",
    problems: [
      { id: "gr-1", title: "Activity Selection", url: "https://www.geeksforgeeks.org/problems/activity-selection-1587115620/1", platform: "GeeksForGeeks" },
      { id: "gr-2", title: "BUSYMAN", url: "https://www.spoj.com/problems/BUSYMAN/", platform: "SPOJ" },
      { id: "gr-3", title: "N Meetings in One Room", url: "https://practice.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1", platform: "GeeksForGeeks" },
      { id: "gr-4", title: "Meeting Rooms", url: "https://www.interviewbit.com/problems/meeting-rooms/", platform: "InterviewBit" },
      { id: "gr-5", title: "Meeting Room 1", url: "https://www.lintcode.com/problem/920/", platform: "LintCode" },
      { id: "gr-6", title: "Meeting Room 2", url: "https://www.lintcode.com/problem/919/", platform: "LintCode" },
      { id: "gr-7", title: "Minimum Platforms", url: "https://practice.geeksforgeeks.org/problems/minimum-platforms-1587115620/1", platform: "GeeksForGeeks" },
      { id: "gr-8", title: "Job Sequencing Problem", url: "https://practice.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1", platform: "GeeksForGeeks", tags: ["New"] },
      { id: "gr-9", title: "Max Chunks To Make Sorted", url: "https://leetcode.com/problems/max-chunks-to-make-sorted/", platform: "LeetCode" },
      { id: "gr-10", title: "Next Permutation", url: "https://leetcode.com/problems/next-permutation/", platform: "LeetCode" },
      { id: "gr-11", title: "Maximum Performance of a Team", url: "https://leetcode.com/problems/maximum-performance-of-a-team/", platform: "LeetCode" },
      { id: "gr-12", title: "Find the Duplicate Number", url: "https://leetcode.com/problems/find-the-duplicate-number/description/", platform: "LeetCode" }
    ]
  },
  {
    topicName: "Dynamic Programming",
    problems: [
      { id: "dp-1", title: "Max Sum Without Adjacents", url: "https://practice.geeksforgeeks.org/problems/max-sum-without-adjacents2430/1", platform: "GeeksForGeeks" },
      { id: "dp-2", title: "Weird Algorithm (Task 1068)", url: "https://cses.fi/problemset/task/1068", platform: "CSES" },
      { id: "dp-3", title: "Min Cost Climbing Stairs", url: "https://leetcode.com/problems/min-cost-climbing-stairs/description/", platform: "LeetCode" },
      { id: "dp-4", title: "Climbing Stairs", url: "https://leetcode.com/problems/climbing-stairs/", platform: "LeetCode" },
      { id: "dp-5", title: "House Robber", url: "https://leetcode.com/problems/house-robber/description/", platform: "LeetCode" },
      { id: "dp-6", title: "MST1", url: "https://www.spoj.com/problems/MST1/", platform: "SPOJ" },
      { id: "dp-7", title: "Unique Paths", url: "https://leetcode.com/problems/unique-paths/", platform: "LeetCode" },
      { id: "dp-8", title: "Partition Equal Subset Sum", url: "https://leetcode.com/problems/partition-equal-subset-sum/", platform: "LeetCode" },
      { id: "dp-9", title: "Unique Paths II", url: "https://leetcode.com/problems/unique-paths-ii/", platform: "LeetCode" },
      { id: "dp-10", title: "Minimum Path Sum", url: "https://leetcode.com/problems/minimum-path-sum/", platform: "LeetCode" },
      { id: "dp-11", title: "Target Sum", url: "https://leetcode.com/problems/target-sum/", platform: "LeetCode" },
      { id: "dp-12", title: "Coin Change", url: "https://leetcode.com/problems/coin-change/", platform: "LeetCode" },
      { id: "dp-13", title: "Longest Increasing Subsequence", url: "https://leetcode.com/problems/longest-increasing-subsequence/", platform: "LeetCode" },
      { id: "dp-14", title: "Projects (Task 1140)", url: "https://cses.fi/problemset/task/1140/", platform: "CSES" },
      { id: "dp-15", title: "Longest Common Subsequence", url: "https://leetcode.com/problems/longest-common-subsequence/", platform: "LeetCode" },
      { id: "dp-16", title: "Maximum Height by Stacking Cuboids", url: "https://leetcode.com/problems/maximum-height-by-stacking-cuboids/description/", platform: "LeetCode" },
      { id: "dp-17", title: "Rod Cutting", url: "https://www.geeksforgeeks.org/problems/rod-cutting0840/1", platform: "GeeksForGeeks" },
      { id: "dp-18", title: "Longest Palindromic Subsequence", url: "https://www.interviewbit.com/problems/longest-palindromic-subsequence/", platform: "InterviewBit" },
      { id: "dp-19", title: "Interleaving String", url: "https://leetcode.com/problems/interleaving-string/", platform: "LeetCode" },
      { id: "dp-20", title: "Decode Ways", url: "https://leetcode.com/problems/decode-ways/", platform: "LeetCode" },
      { id: "dp-21", title: "Matrix Chain Multiplication", url: "https://www.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1", platform: "GeeksForGeeks" },
      { id: "dp-22", title: "Boolean Parenthesization", url: "https://www.geeksforgeeks.org/problems/boolean-parenthesization5610/1", platform: "GeeksForGeeks" },
      { id: "dp-23", title: "Palindrome Partitioning II", url: "https://leetcode.com/problems/palindrome-partitioning-ii/", platform: "LeetCode" },
      { id: "dp-24", title: "Best Time to Buy and Sell Stock IV", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/", platform: "LeetCode" },
      { id: "dp-25", title: "Count Square Submatrices with All Ones", url: "https://leetcode.com/problems/count-square-submatrices-with-all-ones/", platform: "LeetCode" },
      { id: "dp-26", title: "0 - 1 Knapsack Problem", url: "https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1", platform: "GeeksForGeeks" },
      { id: "dp-27", title: "Range Sum Query 2D - Immutable", url: "https://leetcode.com/problems/range-sum-query-2d-immutable/", platform: "LeetCode" },
      { id: "dp-28", title: "Wildcard Matching", url: "https://leetcode.com/problems/wildcard-matching/description/", platform: "LeetCode" }
    ]
  },
  {
    topicName: "Heaps",
    problems: [
      { id: "heap-1", title: "Does Array Represent Heap", url: "https://www.geeksforgeeks.org/problems/does-array-represent-heap4345/1", platform: "GeeksForGeeks" },
      { id: "heap-2", title: "Kth Largest Element", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", platform: "LeetCode" },
      { id: "heap-3", title: "Top K Frequent Elements", url: "https://leetcode.com/problems/top-k-frequent-elements/", platform: "LeetCode" },
      { id: "heap-4", title: "Top K Frequent Words", url: "https://leetcode.com/problems/top-k-frequent-words/description/", platform: "LeetCode" },
      { id: "heap-5", title: "K Closest Points to Origin", url: "https://leetcode.com/problems/k-closest-points-to-origin/", platform: "LeetCode" },
      { id: "heap-6", title: "Maximum Sum Combinations", url: "https://www.interviewbit.com/problems/maximum-sum-combinations/", platform: "InterviewBit" },
      { id: "heap-7", title: "Merge K Sorted Arrays", url: "https://practice.geeksforgeeks.org/problems/merge-k-sorted-arrays/1", platform: "GeeksForGeeks" },
      { id: "heap-8", title: "Merge K Sorted Linked Lists", url: "https://practice.geeksforgeeks.org/problems/merge-k-sorted-linked-lists/1", platform: "GeeksForGeeks" },
      { id: "heap-9", title: "Minimum Cost of Ropes", url: "https://practice.geeksforgeeks.org/problems/minimum-cost-of-ropes-1587115620/1", platform: "GeeksForGeeks" },
      { id: "heap-10", title: "Max Score Removing Stones", url: "https://leetcode.com/problems/maximum-score-from-removing-stones/description/", platform: "LeetCode" },
      { id: "heap-11", title: "Task Scheduler", url: "https://leetcode.com/problems/task-scheduler/description/", platform: "LeetCode" },
      { id: "heap-12", title: "Hand of Straights", url: "https://leetcode.com/problems/hand-of-straights/description/", platform: "LeetCode" },
      { id: "heap-13", title: "Find Median from Data Stream", url: "https://leetcode.com/problems/find-median-from-data-stream/", platform: "LeetCode", tags: ["Hard"] }
    ]
  },
  {
    topicName: "Trie",
    problems: [
      { id: "trie-1", title: "Implement Trie (Prefix Tree)", url: "https://leetcode.com/problems/implement-trie-prefix-tree/description/", platform: "LeetCode" },
      { id: "trie-2", title: "Longest Common Prefix Length", url: "https://leetcode.com/problems/find-the-length-of-the-longest-common-prefix/description/", platform: "LeetCode" },
      { id: "trie-3", title: "SUBXOR", url: "https://www.spoj.com/problems/SUBXOR/", platform: "SPOJ" },
      { id: "trie-4", title: "Max XOR of Two Numbers", url: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/description/", platform: "LeetCode" },
      { id: "trie-5", title: "Max XOR With Element", url: "https://leetcode.com/problems/maximum-xor-with-an-element-from-array/description/", platform: "LeetCode" }
    ]
  },
  {
    topicName: "Disjoint Set Union (DSU)",
    problems: [
      { id: "dsu-1", title: "CLFLARR", url: "https://www.spoj.com/problems/CLFLARR/", platform: "SPOJ" },
      { id: "dsu-2", title: "Redundant Connection", url: "https://leetcode.com/problems/redundant-connection/description/", platform: "LeetCode" },
      { id: "dsu-3", title: "Accounts Merge", url: "https://leetcode.com/problems/accounts-merge/description/", platform: "LeetCode" }
    ]
  },
  {
    topicName: "Graphs",
    problems: [
      { id: "graph-1", title: "DFS Traversal", url: "https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1", platform: "GeeksForGeeks" },
      { id: "graph-2", title: "BFS Traversal", url: "https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1", platform: "GeeksForGeeks" },
      { id: "graph-3", title: "Number of Provinces", url: "https://leetcode.com/problems/number-of-provinces/description/", platform: "LeetCode" },
      { id: "graph-4", title: "Find if Path Exists", url: "https://leetcode.com/problems/find-if-path-exists-in-graph/description/", platform: "LeetCode" },
      { id: "graph-5", title: "Rotting Oranges", url: "https://leetcode.com/problems/rotting-oranges/description/", platform: "LeetCode" },
      { id: "graph-6", title: "Flood Fill", url: "https://leetcode.com/problems/flood-fill/description/", platform: "LeetCode" },
      { id: "graph-7", title: "Snakes and Ladders", url: "https://leetcode.com/problems/snakes-and-ladders/description/", platform: "LeetCode" },
      { id: "graph-8", title: "NAKANJ", url: "https://www.spoj.com/problems/NAKANJ/", platform: "SPOJ" },
      { id: "graph-9", title: "Detect Cycle (Undirected)", url: "https://www.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1", platform: "GeeksForGeeks" },
      { id: "graph-10", title: "Detect Cycle (Directed)", url: "https://www.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1", platform: "GeeksForGeeks" },
      { id: "graph-11", title: "01 Matrix", url: "https://leetcode.com/problems/01-matrix/description/", platform: "LeetCode" },
      { id: "graph-12", title: "Keys and Rooms", url: "https://leetcode.com/problems/keys-and-rooms/description/", platform: "LeetCode" },
      { id: "graph-13", title: "Surrounded Regions", url: "https://leetcode.com/problems/surrounded-regions/description/", platform: "LeetCode" },
      { id: "graph-14", title: "Number of Enclaves", url: "https://leetcode.com/problems/number-of-enclaves/description/", platform: "LeetCode" },
      { id: "graph-15", title: "Word Ladder", url: "https://leetcode.com/problems/word-ladder/description/", platform: "LeetCode" },
      { id: "graph-16", title: "Number of Islands", url: "https://leetcode.com/problems/number-of-islands/", platform: "LeetCode" },
      { id: "graph-17", title: "Word Ladder II", url: "https://leetcode.com/problems/word-ladder-ii/description/", platform: "LeetCode" },
      { id: "graph-18", title: "Evaluate Division", url: "https://leetcode.com/problems/evaluate-division/description/", platform: "LeetCode" },
      { id: "graph-19", title: "Is Graph Bipartite?", url: "https://leetcode.com/problems/is-graph-bipartite/description/", platform: "LeetCode" },
      { id: "graph-20", title: "Course Schedule II (LintCode)", url: "https://www.lintcode.com/problem/3663/", platform: "LintCode" },
      { id: "graph-21", title: "Course Schedule II", url: "https://leetcode.com/problems/course-schedule-ii/description/", platform: "LeetCode" },
      { id: "graph-22", title: "Topological Sort", url: "https://www.geeksforgeeks.org/problems/topological-sort/1", platform: "GeeksForGeeks" },
      { id: "graph-23", title: "Find Eventual Safe States", url: "https://leetcode.com/problems/find-eventual-safe-states/description/", platform: "LeetCode" },
      { id: "graph-24", title: "Alien Dictionary", url: "https://leetcode.ca/all/269.html", platform: "LeetCode" },
      { id: "graph-25", title: "Shortest Path Unit Distance", url: "https://www.geeksforgeeks.org/problems/shortest-path-in-undirected-graph-having-unit-distance/1", platform: "GeeksForGeeks" },
      { id: "graph-26", title: "Shortest Path Undirected", url: "https://www.geeksforgeeks.org/problems/shortest-path-in-undirected-graph/1", platform: "GeeksForGeeks" },
      { id: "graph-27", title: "Implementing Dijkstra (Adj Matrix)", url: "https://www.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1", platform: "GeeksForGeeks" },
      { id: "graph-28", title: "Largest Divisible Subset", url: "https://leetcode.com/problems/largest-divisible-subset/description/", platform: "LeetCode" },
      { id: "graph-29", title: "Course Schedule", url: "https://leetcode.com/problems/course-schedule/", platform: "LeetCode" },
      { id: "graph-30", title: "Clone Graph", url: "https://leetcode.com/problems/clone-graph/", platform: "LeetCode" },
      { id: "graph-31", title: "Distance from Source (Bellman Ford)", url: "https://www.geeksforgeeks.org/problems/distance-from-the-source-bellman-ford-algorithm/1", platform: "GeeksForGeeks" },
      { id: "graph-32", title: "Floyd Warshall", url: "https://www.geeksforgeeks.org/problems/implementing-floyd-warshall2042/1", platform: "GeeksForGeeks" },
      { id: "graph-33", title: "Shortest Path in Binary Matrix", url: "https://leetcode.com/problems/shortest-path-in-binary-matrix/description/", platform: "LeetCode" },
      { id: "graph-34", title: "Path With Minimum Effort", url: "https://leetcode.com/problems/path-with-minimum-effort/", platform: "LeetCode" },
      { id: "graph-35", title: "Cheapest Flights Within K Stops", url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/", platform: "LeetCode" },
      { id: "graph-36", title: "Minimum Multiplications", url: "https://www.geeksforgeeks.org/problems/minimum-multiplications-to-reach-end/1", platform: "GeeksForGeeks" },
      { id: "graph-37", title: "Champagne Tower", url: "https://leetcode.com/problems/champagne-tower/", platform: "LeetCode" },
      { id: "graph-38", title: "Travelling Salesman Problem", url: "https://www.geeksforgeeks.org/problems/travelling-salesman-problem2732/1", platform: "GeeksForGeeks" },
      { id: "graph-39", title: "Number of Ways to Arrive", url: "https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/", platform: "LeetCode" },
      { id: "graph-40", title: "Network Delay Time", url: "https://leetcode.com/problems/network-delay-time/description/", platform: "LeetCode" },
      { id: "graph-41", title: "Reconstruct Itinerary", url: "https://leetcode.com/problems/reconstruct-itinerary/description/", platform: "LeetCode" }
    ]
  },
  {
    topicName: "Segment Tree / Fenwick Tree",
    problems: [
      { id: "seg-1", title: "Dynamic Range Sum Queries", url: "https://cses.fi/problemset/task/1648/", platform: "CSES" },
      { id: "seg-2", title: "Dynamic Range Minimum Queries", url: "https://cses.fi/problemset/task/1649/", platform: "CSES" },
      { id: "seg-3", title: "Range Update Queries", url: "https://cses.fi/problemset/task/1651", platform: "CSES" }
    ]
  }
];