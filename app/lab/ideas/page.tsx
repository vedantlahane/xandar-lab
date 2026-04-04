import type { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
    title: "Project Ideas — Xandar Lab",
    description: "Browse AI-validated project ideas across developer tools, fintech, AI/ML, and more. Every idea has been brainstormed, critiqued, and market-validated by AI agents.",
    openGraph: {
        title: "Project Ideas — Xandar Lab",
        description: "Browse AI-validated project ideas across developer tools, fintech, AI/ML, and more.",
        type: "website",
        siteName: "Xandar Lab",
    },
    twitter: {
        card: "summary",
        title: "Project Ideas — Xandar Lab",
        description: "AI-validated project ideas, refreshed daily.",
    },
};

export default function IdeasCatalogPage() {
    return <ClientPage />;
}
