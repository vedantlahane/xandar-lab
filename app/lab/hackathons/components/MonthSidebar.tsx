"use client";

import { useHackathonScroll } from "../hooks/useHackathonScroll";
import { BaseSidebar } from "@/app/lab/components/shared/BaseSidebar";

export default function MonthSidebar() {
    const { activeMonth, categories } = useHackathonScroll();
    return <BaseSidebar activeId={activeMonth} categories={categories} />;
}