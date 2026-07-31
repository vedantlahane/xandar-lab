"use client";

import { useExperimentScroll } from "../hooks/useExperimentScroll";
import { BaseSidebar } from "@/app/lab/components/shared/BaseSidebar";

export default function CategorySidebar() {
    const { activeCategory, categories } = useExperimentScroll();

    return <BaseSidebar activeId={activeCategory} categories={categories} />;
}