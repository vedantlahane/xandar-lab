import { cn } from "@/lib/utils";

export interface TabGroupProps<T extends string> {
    tabs: { id: T; label: string }[];
    activeTab: T;
    onTabChange: (tabId: T) => void;
}

export function TabGroup<T extends string>({ tabs, activeTab, onTabChange }: TabGroupProps<T>) {
    return (
        <div className="flex gap-1">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
                        activeTab === tab.id
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
