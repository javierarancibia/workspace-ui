import { TabType } from '@/types/workspace';
import { 
  Home, 
  FolderOpen, 
  Library, 
  MessageSquare, 
  Compass,
  Moon,
  Bell,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const navItems: { id: TabType | string; label: string; icon: React.ElementType; isWorkspace?: boolean }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'workspace', label: 'Workspace', icon: FolderOpen, isWorkspace: true },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'assistant', label: 'Assistant', icon: MessageSquare },
  { id: 'explorer', label: 'Explorer', icon: Compass },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  // Workspace tab includes documents, templates, drafts, clients, compliance, activity
  const workspaceTabs: TabType[] = ['documents', 'templates', 'drafts', 'clients', 'compliance', 'activity'];
  const isWorkspaceActive = workspaceTabs.includes(activeTab);

  const handleNavClick = (id: string) => {
    if (id === 'workspace') {
      onTabChange('documents'); // Default to documents when clicking workspace
    } else if (id === 'dashboard' || id === 'library' || id === 'assistant' || id === 'explorer') {
      // These would navigate to other pages in a real app
      // For now, we'll stay on workspace
      onTabChange('documents');
    } else {
      onTabChange(id as TabType);
    }
  };

  return (
    <aside className="w-56 bg-sidebar border-r border-sidebar-border flex flex-col h-screen">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">ث</span>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-lg font-semibold text-foreground">Thak</span>
            <span className="text-lg font-semibold text-primary">AI</span>
            <span className="text-lg font-semibold text-foreground mr-0.5">ذكي</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isWorkspace ? isWorkspaceActive : false;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                'sidebar-nav-item w-full',
                isActive && 'active'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        {/* Theme and Notifications */}
        <div className="flex items-center justify-center gap-6 py-3 mb-3">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Moon className="h-5 w-5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=40&h=40&fit=crop&crop=face" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">JA</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Javier Ara...</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </aside>
  );
}
