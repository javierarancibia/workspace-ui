import { useState } from 'react';
import { Template } from '@/types/workspace';
import { mockTemplates } from '@/data/mockData';
import { 
  Search, Plus, FileText, LayoutGrid, List, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const categories = ['all', 'contracts', 'corporate', 'compliance', 'employment', 'other'] as const;

const fileTypeConfig: Record<string, { color: string; label: string }> = {
  pdf: { color: 'bg-red-500/10 text-red-600 border-red-200', label: 'PDF' },
  docx: { color: 'bg-blue-500/10 text-blue-600 border-blue-200', label: 'DOCX' },
  xlsx: { color: 'bg-green-500/10 text-green-600 border-green-200', label: 'XLSX' },
  txt: { color: 'bg-gray-500/10 text-gray-600 border-gray-200', label: 'TXT' },
};

const categoryIconConfig: Record<string, { bg: string; text: string }> = {
  contracts: { bg: 'bg-amber-500/15', text: 'text-amber-600' },
  corporate: { bg: 'bg-indigo-500/15', text: 'text-indigo-600' },
  compliance: { bg: 'bg-emerald-500/15', text: 'text-emerald-600' },
  employment: { bg: 'bg-rose-500/15', text: 'text-rose-600' },
  other: { bg: 'bg-slate-500/15', text: 'text-slate-600' },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

interface TemplateCardProps {
  template: Template;
  onNewDraft: () => void;
}

function TemplateCard({ template, onNewDraft }: TemplateCardProps) {
  const typeConfig = fileTypeConfig[template.file_type] || fileTypeConfig.txt;
  const iconConfig = categoryIconConfig[template.category] || categoryIconConfig.other;

  return (
    <div className="card-elevated p-5 flex flex-col animate-scale-in group hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4 mb-3">
        <div className={cn('w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0', iconConfig.bg)}>
          <FileText className={cn('h-5 w-5', iconConfig.text)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-[15px] text-foreground truncate">{template.name.replace(/\.[^/.]+$/, '')}</h3>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 h-5 font-medium border', typeConfig.color)}>
          {typeConfig.label}
        </Badge>
        <span className="text-[11px] text-muted-foreground">{formatFileSize(template.size)}</span>
      </div>

      <div className="mt-auto pt-3 border-t border-border flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 gap-1.5 text-xs h-8 border-primary/30 text-primary hover:bg-primary/5"
          onClick={onNewDraft}
        >
          <Plus className="h-3.5 w-3.5" />
          Use Template
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => window.open(template.url, '_blank')}
        >
          <Download className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}

export function TemplatesTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [templates] = useState<Template[]>(mockTemplates);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleNewDraft = (template: Template) => {
    console.log('Creating new draft from template:', template.name);
  };

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">Pre-built legal document templates</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            className={cn('h-9 w-9', viewMode === 'grid' && 'btn-primary-gold')}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            className={cn('h-9 w-9', viewMode === 'list' && 'btn-primary-gold')}
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border overflow-x-auto">
        {categories.map(category => (
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className={cn(
              'capitalize whitespace-nowrap',
              activeCategory === category && 'btn-primary-gold'
            )}
          >
            {category}
          </Button>
        ))}
        <div className="flex-1" />
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 input-search"
          />
        </div>
      </div>

      {/* Template Grid */}
      <div className={cn(
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'flex flex-col gap-3'
      )}>
        {filteredTemplates.map(template => (
          <TemplateCard 
            key={template.key} 
            template={template}
            onNewDraft={() => handleNewDraft(template)}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No templates found</p>
        </div>
      )}
    </div>
  );
}
