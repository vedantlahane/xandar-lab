"use client";

import { JobsHeader } from "../components/JobsHeader";
import PortalCanvas from "../components/PortalCanvas";

export default function JobsPortalsPage() {
  return (
    <>
      <JobsHeader />
      {/* fill remaining space with canvas */}
      <div className="flex-1 overflow-hidden relative">
        <PortalCanvas />
      </div>
    </>
  );
}
