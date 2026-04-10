"use client";

import { useJobScroll } from "../hooks/useJobScroll";
import { BaseSidebar } from "@/app/lab/components/shared/BaseSidebar";

export default function JobSidebar() {
    const { activeCategory, categories } = useJobScroll();
    return <BaseSidebar activeId={activeCategory} categories={categories} />;
}