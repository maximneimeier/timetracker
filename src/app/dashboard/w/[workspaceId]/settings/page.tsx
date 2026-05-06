import WorkspaceAppearanceSettingsClient from './WorkspaceAppearanceSettingsClient';

export function generateStaticParams() {
  return [{ workspaceId: '__' }];
}

export default function WorkspaceAppearanceSettingsPage() {
  return <WorkspaceAppearanceSettingsClient />;
}
