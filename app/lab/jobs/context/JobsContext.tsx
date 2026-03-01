"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { Portal } from "../data/portals";

interface JobsContextValue {
  portals: Portal[];
  loadMorePortals: () => Promise<void>;
  hasMorePortals: boolean;
}

const JobsContext = createContext<JobsContextValue | null>(null);

export function useJobsContext(): JobsContextValue {
  const ctx = useContext(JobsContext);
  if (!ctx) {
    throw new Error("useJobsContext must be used inside <JobsProvider>");
  }
  return ctx;
}

export function JobsProvider({ children }: { children: ReactNode }) {
  const [portals, setPortals] = useState<Portal[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // load more function reads current page via updater to avoid stale deps
  const loadMore = async () => {
    if (!hasMore) return;
    try {
      // use current page value when performing request
      const res = await fetch(`/api/portals?page=${page}&pageSize=20`);
      if (!res.ok) return;
      const data: { portals: Portal[]; total: number } = await res.json();
      setPortals((prev) => {
        const toAdd = data.portals.filter((p) => !prev.some((q) => q.id === p.id));
        const newLen = prev.length + toAdd.length;
        if (newLen >= data.total) {
          setHasMore(false);
        }
        return [...prev, ...toAdd];
      });
      setPage((p) => p + 1);
    } catch (err) {
      console.error("failed to load portals", err);
    }
  };

  // load first page once
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <JobsContext.Provider
      value={{ portals, loadMorePortals: loadMore, hasMorePortals: hasMore }}
    >
      {children}
    </JobsContext.Provider>
  );
}
