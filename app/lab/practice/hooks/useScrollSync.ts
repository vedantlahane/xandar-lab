import { Inter } from "next/font/google";
import { useEffect,useState } from "react";

export function useScrollSync(){
    const [activeTopic, setActiveTopic] = useState<string | null>(null);

    useEffect(() =>{
        const container = document.getElementById("problem-scroll-container");

        if(!container) return;

        const sections = Array.from(container.querySelectorAll<HTMLElement>("section[data-topic]"));

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach
            }
        )
    })
}