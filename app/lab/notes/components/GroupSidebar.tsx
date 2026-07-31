"use client";

import { useNoteScroll } from "../hooks/useNoteScroll";
import { BaseSidebar } from "@/app/lab/components/shared/BaseSidebar";

export default function GroupSidebar() {
    const { activeGroup, categories } = useNoteScroll();

    return <BaseSidebar activeId={activeGroup} categories={categories} />;
}