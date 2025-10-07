import type { ReactNode } from 'react';

export default function Card({ children }: { children: ReactNode }) {
  return <div className="card p-4">{children}</div>;
}
