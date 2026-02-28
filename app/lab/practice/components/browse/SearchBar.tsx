// app/lab/practice/components/browse/SearchBar.tsx

"use client";

import { Search, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  onRandom: (e: React.MouseEvent) => void;
}

/**
 * Search input + "Pick Random" button.
 * Rendered sticky at the top of the Browse right column.
 */
export function SearchBar({ query, onQueryChange, onRandom }: SearchBarProps) {
  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search problems, tags, platforms..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="pl-9 bg-background/50 border-border/50 focus:border-primary/50 text-sm h-10 transition-all hover:bg-background/80"
        />
      </div>
      <Button
        variant="outline"
        className="gap-2 h-10 hover:bg-primary/10 hover:text-primary transition-colors"
        onClick={onRandom}
        title="Pick a random unsolved problem"
      >
        <Shuffle className="h-4 w-4" />
        <span className="hidden sm:inline">Pick Random</span>
      </Button>
    </div>
  );
}