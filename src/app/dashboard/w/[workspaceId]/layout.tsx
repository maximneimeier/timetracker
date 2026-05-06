import type { ReactNode } from 'react';

export function generateStaticParams() {
  return [{ workspaceId: '__' }];
}

export default function WorkspaceSegmentLayout({ children }: { children: ReactNode }) {
  return children;
}
