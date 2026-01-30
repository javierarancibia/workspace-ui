import { useState } from 'react';
import { TabType } from '@/types/workspace';
import { WorkspaceLayout } from '@/components/layout/WorkspaceLayout';
import { 
  DocumentsTab, 
  TemplatesTab, 
  DraftsTab, 
  ComplianceTab, 
  ClientsTab, 
  ActivityTab,
  CollaborativeTab 
} from '@/components/tabs';
import { Button } from '@/components/ui/button';
import { FileText, Files, Edit3, Users, Shield, Clock, MessagesSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const workspaceTabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'templates', label: 'Templates', icon: Files },
  { id: 'drafts', label: 'Drafts', icon: Edit3 },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'compliance', label: 'Compliance', icon: Shield },
  { id: 'activity', label: 'Activity', icon: Clock },
  { id: 'collaborative', label: 'Collaborate', icon: MessagesSquare },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('documents');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'documents':
        return <DocumentsTab />;
      case 'templates':
        return <TemplatesTab />;
      case 'drafts':
        return <DraftsTab />;
      case 'clients':
        return <ClientsTab />;
      case 'compliance':
        return <ComplianceTab />;
      case 'activity':
        return <ActivityTab />;
      case 'collaborative':
        return <CollaborativeTab />;
      default:
        return <DocumentsTab />;
    }
  };

  return (
    <WorkspaceLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Workspace Header with Tabs */}
      <div className="border-b border-border bg-card/50">
        <div className="px-6 pt-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin pb-0 min-h-[44px]">
            {workspaceTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap',
                    'border-b-2 -mb-[2px]',
                    isActive 
                      ? 'bg-background text-primary border-primary' 
                      : 'text-muted-foreground hover:text-foreground border-transparent hover:bg-muted/50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto bg-muted/30">
        {renderTabContent()}
      </div>
    </WorkspaceLayout>
  );
};

export default Index;
