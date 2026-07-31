import { Search } from "lucide-react";

export interface LabSearchBarProps {
    query: string;
    onQueryChange: (query: string) => void;
    placeholder?: string;
}

export function LabSearchBar({ query, onQueryChange, placeholder = "Search..." }: LabSearchBarProps) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border/40 bg-muted/20 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
            />
        </div>
    );
}
