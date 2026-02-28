// app/lab/practice/components/browse/ProblemList.tsx

"use client";

import { Search, Hash } from "lucide-react";
import { ProblemRow } from "./ProblemRow";
import type { DSAProblem } from "../../data/sheet";
import type { ExtensionData } from "../../hooks/useProblemFilters";

// Reuse the shape that useProblemFilters returns
type FilteredTopic = {
  topicName: string;
  problems: DSAProblem[];
};

interface ProblemListProps {
  topics: FilteredTopic[];
  activeProblemId: string | null;
  savedSet: Set<string>;
  completedSet: Set<string>;
  extensionMap: Map<string, ExtensionData>;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onSave: (id: string, e: React.MouseEvent) => void;
  onComplete: (id: string, e: React.MouseEvent) => void;
}

export function ProblemList({
  topics,
  activeProblemId,
  savedSet,
  completedSet,
  extensionMap,
  onSelect,
  onSave,
  onComplete,
}: ProblemListProps) {
  if (topics.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border flex flex-col items-center justify-center">
        <div className="bg-muted/50 w-12 h-12 rounded-full flex items-center justify-center mb-3">
          <Search className="h-6 w-6 opacity-50" />
        </div>
        <p className="font-medium">No problems found</p>
        <p className="text-sm opacity-70 mt-1">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {topics.map((topic) => (
        <section
          key={topic.topicName}
          id={topic.topicName}
          data-topic
          data-topic-title={topic.topicName}
          className="space-y-0"
        >
          {/* Topic header */}
          <div className="flex items-center gap-3 pb-2 mb-2 border-b border-border/40">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Hash className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{topic.topicName}</h2>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>{topic.problems.length} problems</span>
              </div>
            </div>
          </div>

          {/* Problem rows */}
          <div>
            {topic.problems.map((problem) => (
              <ProblemRow
                key={problem.id}
                problem={problem}
                isActive={activeProblemId === problem.id}
                isSaved={savedSet.has(problem.id)}
                isCompleted={completedSet.has(problem.id)}
                extData={extensionMap.get(problem.id) ?? null}
                onSelect={onSelect}
                onSave={onSave}
                onComplete={onComplete}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
