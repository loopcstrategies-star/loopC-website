import type { ReactNode } from "react";

export function TableScroll({ children }: { children: ReactNode }) {
  return <div className="mt-4 overflow-x-auto">{children}</div>;
}
