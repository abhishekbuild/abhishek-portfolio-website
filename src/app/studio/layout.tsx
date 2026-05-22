import type { ReactNode } from "react";

// Studio gets its own layout — no Nav, no footer, full-height canvas.
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
      {children}
    </div>
  );
}
