"use client";

import { useScrollSync } from "../../hooks/useScrollSync";
import { BaseSidebar } from "@/app/lab/components/shared/BaseSidebar";

export function TopicSidebar() {
    const { activeTopic, categories } = useScrollSync();
    return <BaseSidebar activeId={activeTopic} categories={categories} />;
}
