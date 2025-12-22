export type Topic = {
  id: string;
  title: string;
  problems: { id: string; title: string }[];
};

export const SHEET: Topic[] = [
  {
    id: "arrays",
    title: "Arrays",
    problems: [
      { id: "two-sum", title: "Two Sum" },
      { id: "kadane", title: "Kadane’s Algorithm" },
    ],
  },
  {
    id: "hashing",
    title: "Hashing",
    problems: [
      { id: "freq-map", title: "Frequency Map" },
    ],
  },
  {
    id: "dp",
    title: "Dynamic Programming",
    problems: [
      { id: "climb", title: "Climbing Stairs" },
    ],
  },
];
