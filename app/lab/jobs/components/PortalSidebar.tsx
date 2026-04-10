"use client";

import { usePortalScroll } from "../hooks/usePortalScroll";
import { BaseSidebar } from "@/app/lab/components/shared/BaseSidebar";

export default function PortalSidebar() {
    const { activeCategory, categories } = usePortalScroll();
    return <BaseSidebar activeId={activeCategory} categories={categories} />;
}