import React, { useState } from 'react';
import { Draft, AISuggestion } from '@/types/workspace';
import { mockDrafts } from '@/data/mockData';
import { 
  Search, Edit, Download, Trash2, FileText, ExternalLink,
  Info, Check, Copy, RotateCcw, AlertTriangle, Clock, CheckCircle2,
  MoreHorizontal, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const severityConfig = {
  high: { 
    label: 'High Priority', 
    icon: AlertTriangle,
    bg: 'bg-rose-500/10', 
    text: 'text-rose-600',
    border: 'border-rose-500/20',
    dot: 'bg-rose-500'
  },
  medium: { 
    label: 'Medium', 
    icon: Clock,
    bg: 'bg-amber-500/10', 
    text: 'text-amber-600',
    border: 'border-amber-500/20',
    dot: 'bg-amber-500'
  },
  low: { 
    label: 'Low', 
    icon: CheckCircle2,
    bg: 'bg-emerald-500/10', 
    text: 'text-emerald-600',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-500'
  },
};

const statusConfig = {
  'pending': { 
    label: 'Pending', 
    bg: 'bg-slate-500/10', 
    text: 'text-slate-600',
    icon: Clock
  },
  'in-progress': { 
    label: 'In Progress', 
    bg: 'bg-blue-500/10', 
    text: 'text-blue-600',
    icon: Edit
  },
  'completed': { 
    label: 'Completed', 
    bg: 'bg-emerald-500/10', 
    text: 'text-emerald-600',
    icon: CheckCircle2
  },
};

function SeverityBadge({ severity }: { severity: Draft['severity'] }) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <Badge variant="secondary" className={cn('font-normal gap-1.5', config.bg, config.text)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

function StatusBadge({ status }: { status: Draft['status'] }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="secondary" className={cn('font-normal gap-1.5', config.bg, config.text)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

interface DraftEditorDialogProps {
  draft: Draft;
  open: boolean;
  onClose: () => void;
}

function DraftEditorDialog({ draft, open, onClose }: DraftEditorDialogProps) {
  const [content, setContent] = useState(draft.content);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>(draft.suggestions);
  const [viewMode, setViewMode] = useState<'edit' | 'compare'>('edit');

  const appliedCount = suggestions.filter(s => s.applied).length;

  const handleApplySuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.map(s => 
      s.id === suggestionId ? { ...s, applied: true } : s
    ));
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      setContent(prev => prev.replace(suggestion.originalText, suggestion.suggestedText));
    }
  };

  const handleRevertSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.map(s => 
      s.id === suggestionId ? { ...s, applied: false } : s
    ));
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      setContent(prev => prev.replace(suggestion.suggestedText, suggestion.originalText));
    }
  };

  const handleCopySuggestion = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {draft.documentName}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'edit' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('edit')}
                className={viewMode === 'edit' ? 'btn-primary-gold' : ''}
              >
                Edit
              </Button>
              <Button
                variant={viewMode === 'compare' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('compare')}
                className={viewMode === 'compare' ? 'btn-primary-gold' : ''}
              >
                Compare
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Document Editor */}
          <div className="flex-1 flex flex-col">
            <div className="text-sm text-muted-foreground mb-2">Document Content</div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 resize-none font-mono text-sm"
            />
          </div>

          {/* AI Suggestions Panel */}
          <div className="w-96 flex flex-col border-l border-border pl-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Suggestions
              </h3>
              <span className="text-sm text-muted-foreground">
                {appliedCount} of {suggestions.length} applied
              </span>
            </div>

            <div className="flex-1 overflow-auto space-y-4 scrollbar-thin">
              {suggestions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No suggestions available
                </div>
              ) : (
                suggestions.map(suggestion => (
                  <div 
                    key={suggestion.id} 
                    className={cn(
                      'p-4 rounded-lg border',
                      suggestion.applied ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-card border-border'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        {suggestion.section}
                      </span>
                      {suggestion.applied && (
                        <Check className="h-4 w-4 text-emerald-600" />
                      )}
                    </div>

                    <div className="text-sm mb-2">
                      <span className="font-medium text-muted-foreground">Original: </span>
                      <span className="line-through text-muted-foreground/70">{suggestion.originalText}</span>
                    </div>

                    <div className="text-sm mb-2">
                      <span className="font-medium text-foreground">Suggested: </span>
                      <span className="text-foreground">{suggestion.suggestedText}</span>
                    </div>

                    <div className="text-xs text-muted-foreground italic mb-3">
                      {suggestion.reason}
                    </div>

                    <div className="flex items-center gap-2">
                      {!suggestion.applied ? (
                        <Button 
                          size="sm" 
                          className="btn-primary-gold text-xs h-7"
                          onClick={() => handleApplySuggestion(suggestion.id)}
                        >
                          Apply
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs h-7"
                          onClick={() => handleRevertSuggestion(suggestion.id)}
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Revert
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-xs h-7"
                        onClick={() => handleCopySuggestion(suggestion.suggestedText)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="btn-primary-gold">Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DraftRow({ draft, onEdit }: { draft: Draft; onEdit: () => void }) {
  const severity = severityConfig[draft.severity];

  return (
    <tr className="group border-b border-border/40 hover:bg-muted/30 transition-all duration-150">
      <td className="py-4 px-5">
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex items-center justify-center w-10 h-10 rounded-lg',
            severity.bg
          )}>
            <Edit className={cn('h-4 w-4', severity.text)} />
          </div>
          <div>
            <p className="font-medium text-[15px] text-foreground">{draft.documentName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{draft.relatedAlert}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-5">
        <SeverityBadge severity={draft.severity} />
      </td>
      <td className="py-4 px-5">
        <StatusBadge status={draft.status} />
      </td>
      <td className="py-4 px-5">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {draft.lastModified}
        </div>
      </td>
      <td className="py-4 px-5">
        <div className="flex items-center justify-end gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 px-3 text-xs font-medium hover:bg-primary/10 hover:text-primary"
            onClick={onEdit}
          >
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Original
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}

export function DraftsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [drafts] = useState<Draft[]>(mockDrafts);
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null);

  const filteredDrafts = drafts.filter(draft => {
    const matchesSearch = draft.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         draft.relatedAlert.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || draft.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: 'Total Drafts', value: drafts.length, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'High Priority', value: drafts.filter(d => d.severity === 'high').length, color: 'text-rose-600', bg: 'bg-rose-500/10' },
    { label: 'In Progress', value: drafts.filter(d => d.status === 'in-progress').length, color: 'text-amber-600', bg: 'bg-amber-500/10' },
    { label: 'Completed', value: drafts.filter(d => d.status === 'completed').length, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Drafts</h1>
          <p className="text-sm text-muted-foreground mt-1">Edit documents based on compliance alerts</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className={cn('px-2 py-1 rounded-md text-lg font-bold', stat.bg, stat.color)}>
                  {stat.value}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drafts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Info Banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Info className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">How Drafts Work</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Drafts are created when compliance analysis identifies documents that need updates. 
              Each draft includes AI-powered suggestions for required changes.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Drafts Table */}
      <Card className="border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Document</th>
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Severity</th>
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Modified</th>
                <th className="py-3.5 px-5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrafts.map(draft => (
                <DraftRow 
                  key={draft.id} 
                  draft={draft} 
                  onEdit={() => setEditingDraft(draft)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {filteredDrafts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-foreground font-medium">No drafts found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Drafts will appear when compliance alerts require document updates
            </p>
          </div>
        )}
      </Card>

      {/* Edit Dialog */}
      {editingDraft && (
        <DraftEditorDialog
          draft={editingDraft}
          open={!!editingDraft}
          onClose={() => setEditingDraft(null)}
        />
      )}
    </div>
  );
}
