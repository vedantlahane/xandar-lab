"use client";

import { useDocScroll } from "../hooks/useDocScroll";
import { BaseSidebar } from "@/app/lab/components/shared/BaseSidebar";

export default function SectionSidebar() {
    const { activeSection, categories } = useDocScroll();
    return <BaseSidebar activeId={activeSection} categories={categories} />;
}