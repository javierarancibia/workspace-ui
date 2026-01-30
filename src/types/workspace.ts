export interface Document {
  id: string;
  title: string;
  summary: string;
  doc_type: 'pdf' | 'docx' | 'xlsx' | 'txt';
  jurisdiction: string;
  topics: string[];
  published_date: string;
  is_private: boolean;
}

export interface Folder {
  id: string;
  name: string;
  is_private: boolean;
  documents: Document[];
  children: Folder[];
}

export interface Draft {
  id: string;
  documentName: string;
  relatedAlert: string;
  severity: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  lastModified: string;
  content: string;
  suggestions: AISuggestion[];
}

export interface AISuggestion {
  id: string;
  section: string;
  originalText: string;
  suggestedText: string;
  reason: string;
  applied: boolean;
}

export interface ComplianceJob {
  id: string;
  documentName: string;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  progress: string;
  updatedAt: string;
  score?: number;
  clauses?: ComplianceClause[];
}

export interface ComplianceClause {
  id: string;
  text: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  isCompliant: boolean;
  explanation: string;
  recommendation: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Template {
  key: string;
  name: string;
  folder: string;
  file_type: 'pdf' | 'docx' | 'xlsx' | 'txt';
  size: number;
  last_modified: string;
  url: string;
  description?: string;
  category: 'contracts' | 'corporate' | 'compliance' | 'employment' | 'other';
}

export interface Client {
  client_id: string;
  user_id: string;
  name: string;
  placeholders: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export type ActivityType = 
  | 'document_uploaded'
  | 'compliance_completed'
  | 'news_added'
  | 'publication_added'
  | 'entity_subscribed'
  | 'team_joined';

export interface Activity {
  id: string;
  activity_type: ActivityType;
  icon_type: string;
  title: string;
  relative_timestamp: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  mentions: string[];
}

export interface Task {
  id: string;
  title: string;
  assignee: {
    name: string;
    avatar: string;
  };
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export type TabType = 'documents' | 'templates' | 'drafts' | 'clients' | 'compliance' | 'activity' | 'collaborative';
