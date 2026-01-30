import { useState } from 'react';
import { Client } from '@/types/workspace';
import { mockClients } from '@/data/mockData';
import { 
  Search, Plus, Building2, MoreHorizontal, Calendar, Tag, Edit, Trash2, Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Emirate color configuration
const emirateColors: Record<string, { bg: string; text: string }> = {
  'Dubai': { bg: 'bg-blue-500/15', text: 'text-blue-600' },
  'Abu Dhabi': { bg: 'bg-emerald-500/15', text: 'text-emerald-600' },
  'Sharjah': { bg: 'bg-amber-500/15', text: 'text-amber-600' },
  'DIFC': { bg: 'bg-indigo-500/15', text: 'text-indigo-600' },
  'Ajman': { bg: 'bg-rose-500/15', text: 'text-rose-600' },
  'RAK': { bg: 'bg-cyan-500/15', text: 'text-cyan-600' },
  'Fujairah': { bg: 'bg-violet-500/15', text: 'text-violet-600' },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getPlaceholderCount(placeholders: Record<string, string>): number {
  return Object.keys(placeholders).length;
}

interface ClientCardProps {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
}

function ClientCard({ client, onEdit, onDelete }: ClientCardProps) {
  const emirate = client.placeholders.EMIRATE || 'Unknown';
  const emirateConfig = emirateColors[emirate] || { bg: 'bg-slate-500/15', text: 'text-slate-600' };
  const placeholderCount = getPlaceholderCount(client.placeholders);
  const businessActivity = client.placeholders.BUSINESS_ACTIVITY || '';
  
  return (
    <div className="card-elevated p-5 flex flex-col animate-scale-in group hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', emirateConfig.bg)}>
          <Building2 className={cn('h-6 w-6', emirateConfig.text)} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="h-3.5 w-3.5 mr-2" />
              Edit Client
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="h-3.5 w-3.5 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Company Name */}
      <h3 className="font-semibold text-[15px] text-foreground mb-1 line-clamp-1">
        {client.name}
      </h3>
      
      {/* Business Activity */}
      {businessActivity && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
          {businessActivity}
        </p>
      )}

      {/* Tags Row */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className={cn(
          'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
          emirateConfig.bg, emirateConfig.text
        )}>
          {emirate}
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground">
          <Tag className="h-3 w-3 mr-1" />
          {placeholderCount} fields
        </span>
      </div>

      {/* Placeholders Preview */}
      <div className="bg-muted/50 rounded-lg p-3 mb-4 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
          Key Fields
        </p>
        <div className="space-y-1.5">
          {Object.entries(client.placeholders).slice(0, 3).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              <code className="text-[10px] px-1.5 py-0.5 bg-background rounded border border-border font-mono text-muted-foreground">
                {key}
              </code>
              <span className="text-foreground truncate flex-1">{value}</span>
            </div>
          ))}
          {placeholderCount > 3 && (
            <p className="text-[10px] text-muted-foreground">
              +{placeholderCount - 3} more fields
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Updated {formatDate(client.updated_at)}</span>
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onEdit}>
          View Details
        </Button>
      </div>
    </div>
  );
}

export function ClientsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>(mockClients);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    Object.values(client.placeholders).some(v => 
      v.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleDeleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.client_id !== clientId));
  };

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {clients.length} client{clients.length !== 1 ? 's' : ''} • Manage profiles for document generation
          </p>
        </div>
        <Button className="btn-primary-gold gap-2">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients by name or field values..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 input-search"
          />
        </div>
      </div>

      {/* Cards Grid */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredClients.map(client => (
            <ClientCard
              key={client.client_id}
              client={client}
              onEdit={() => console.log('Edit:', client.client_id)}
              onDelete={() => handleDeleteClient(client.client_id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-xl border">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No clients found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery ? 'Try adjusting your search terms' : 'Get started by adding your first client'}
          </p>
          {!searchQuery && (
            <Button className="btn-primary-gold gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
