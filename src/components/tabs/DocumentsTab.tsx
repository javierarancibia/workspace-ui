import { useState } from 'react';
import { Document, Folder } from '@/types/workspace';
import { mockFolders } from '@/data/mockData';
import { 
  Search, Upload, FolderIcon, FileText, ChevronRight, ChevronDown,
  MoreHorizontal, Lock, Globe, FileSpreadsheet, File
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

function getDocIcon(docType: Document['doc_type']) {
  const iconClass = "h-4 w-4";
  switch (docType) {
    case 'pdf':
      return <FileText className={cn(iconClass, "text-[hsl(var(--doc-pdf))]")} />;
    case 'docx':
      return <File className={cn(iconClass, "text-[hsl(var(--doc-docx))]")} />;
    case 'xlsx':
      return <FileSpreadsheet className={cn(iconClass, "text-[hsl(var(--doc-xlsx))]")} />;
    default:
      return <FileText className={cn(iconClass, "text-[hsl(var(--doc-txt))]")} />;
  }
}

function JurisdictionBadge({ jurisdiction }: { jurisdiction: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
      {jurisdiction}
    </span>
  );
}

function TopicTag({ topic }: { topic: string }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground capitalize">
      {topic}
    </span>
  );
}

function DocTypeBadge({ type }: { type: Document['doc_type'] }) {
  const colors = {
    pdf: 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400',
    docx: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    xlsx: 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400',
    txt: 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  };
  
  return (
    <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase", colors[type])}>
      {type}
    </span>
  );
}

interface DocumentRowProps {
  document: Document;
  depth?: number;
}

function DocumentRow({ document, depth = 0 }: DocumentRowProps) {
  return (
    <div 
      className="group flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors rounded-lg mx-2 cursor-pointer"
      style={{ paddingLeft: `${depth * 20 + 12}px` }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {getDocIcon(document.doc_type)}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground truncate">
              {document.title}
            </span>
            {document.is_private && (
              <Lock className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{document.summary}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5">
          {document.topics.slice(0, 2).map((topic) => (
            <TopicTag key={topic} topic={topic} />
          ))}
        </div>
        <JurisdictionBadge jurisdiction={document.jurisdiction} />
        <DocTypeBadge type={document.doc_type} />
        <span className="text-xs text-muted-foreground w-20 text-right hidden md:block">
          {new Date(document.published_date).toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
          })}
        </span>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem>Open</DropdownMenuItem>
          <DropdownMenuItem>Download</DropdownMenuItem>
          <DropdownMenuItem>Share</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface FolderItemProps {
  folder: Folder;
  expandedFolders: Set<string>;
  onToggle: (id: string) => void;
  depth?: number;
}

function FolderItem({ folder, expandedFolders, onToggle, depth = 0 }: FolderItemProps) {
  const isExpanded = expandedFolders.has(folder.id);
  const hasContent = folder.documents.length > 0 || folder.children.length > 0;
  const totalItems = folder.documents.length + folder.children.length;

  return (
    <div>
      <div 
        className="group flex items-center gap-2 px-3 py-2 hover:bg-muted/50 transition-colors rounded-lg mx-2 cursor-pointer"
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
        onClick={() => onToggle(folder.id)}
      >
        <button className="p-0.5 hover:bg-muted rounded transition-colors">
          {hasContent ? (
            isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )
          ) : (
            <div className="h-3.5 w-3.5" />
          )}
        </button>
        
        <FolderIcon className={cn(
          "h-4 w-4 transition-colors",
          isExpanded ? "text-primary" : "text-primary/70"
        )} />
        
        <span className="text-sm font-medium text-foreground flex-1">{folder.name}</span>
        
        <div className="flex items-center gap-2">
          {folder.is_private ? (
            <Lock className="h-3 w-3 text-muted-foreground" />
          ) : (
            <Globe className="h-3 w-3 text-muted-foreground" />
          )}
          {totalItems > 0 && (
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
              {totalItems}
            </span>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem>New Subfolder</DropdownMenuItem>
            <DropdownMenuItem>Upload Files</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {isExpanded && (
        <div className="animate-in slide-in-from-top-1 duration-200">
          {folder.children.map((child) => (
            <FolderItem
              key={child.id}
              folder={child}
              expandedFolders={expandedFolders}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
          {folder.documents.map((doc) => (
            <DocumentRow key={doc.id} document={doc} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function DocumentsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['folder-1']));
  const [folders] = useState<Folder[]>(mockFolders);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    folder.documents.some(doc => doc.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Documents</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage and organize your files</p>
        </div>
        <Button size="sm" className="btn-primary-gold gap-1.5 h-8 text-xs">
          <Upload className="h-3.5 w-3.5" />
          Upload
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search files and folders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 h-8 text-sm input-search"
        />
      </div>

      {/* File Browser */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center gap-3 px-5 py-2.5 border-b bg-muted/30">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex-1">
            Name
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hidden sm:block w-24">
            Topics
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-14">
            Region
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-12">
            Type
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-20 text-right hidden md:block">
            Date
          </span>
          <div className="w-7" />
        </div>
        
        {/* Content */}
        <div className="py-1">
          {filteredFolders.length > 0 ? (
            filteredFolders.map(folder => (
              <FolderItem
                key={folder.id}
                folder={folder}
                expandedFolders={expandedFolders}
                onToggle={toggleFolder}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">No documents found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
