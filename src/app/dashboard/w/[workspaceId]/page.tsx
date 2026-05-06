import WorkspaceRoutePageClient from './WorkspaceRoutePageClient';

/** Erforderlich für `output: "export"` (Next 16 prüft die `page`-Datei). Platzhalter → Client leitet `__` nach `/dashboard` um. */
export function generateStaticParams() {
  return [{ workspaceId: '__' }];
}

export default function WorkspaceRoutePage() {
  return <WorkspaceRoutePageClient />;
}
