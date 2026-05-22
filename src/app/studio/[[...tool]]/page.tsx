"use client";

import NextDynamic from "next/dynamic";
import config from "../../../../sanity.config";

export const dynamic = "force-dynamic";

// Disable SSR entirely — Sanity Studio is browser-only and conflicts with
// React 19's compiler runtime during server rendering.
const Studio = NextDynamic(
  () => import("next-sanity/studio").then((mod) => ({ default: mod.NextStudio })),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "#101112",
          color: "#8b8da0",
          fontFamily: "system-ui, sans-serif",
          fontSize: 14,
        }}
      >
        Loading Studio…
      </div>
    ),
  }
);

export default function StudioPage() {
  return <Studio config={config} />;
}
