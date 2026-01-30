import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TabType } from '@/types/workspace';

interface WorkspaceLayoutProps {
  children: ReactNode;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function WorkspaceLayout({ children, activeTab, onTabChange }: WorkspaceLayoutProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
