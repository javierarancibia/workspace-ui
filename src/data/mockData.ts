import { Document, Folder, Draft, ComplianceJob, Template, Client, Activity, Comment, Task } from '@/types/workspace';

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    title: 'Corporate Contract',
    summary: 'Standard corporate agreement for business partnerships',
    doc_type: 'pdf',
    jurisdiction: 'UAE',
    topics: ['corporate', 'contracts'],
    published_date: '2024-01-15',
    is_private: false,
  },
  {
    id: 'doc-2',
    title: 'Employment Agreement',
    summary: 'Standard employment terms and conditions',
    doc_type: 'docx',
    jurisdiction: 'UAE',
    topics: ['employment', 'hr'],
    published_date: '2024-02-20',
    is_private: false,
  },
  {
    id: 'doc-3',
    title: 'NDA Template',
    summary: 'Non-disclosure agreement for confidential matters',
    doc_type: 'pdf',
    jurisdiction: 'UK',
    topics: ['legal', 'confidentiality'],
    published_date: '2024-03-10',
    is_private: true,
  },
  {
    id: 'doc-4',
    title: 'Financial Report Q1',
    summary: 'Quarterly financial statements and analysis',
    doc_type: 'xlsx',
    jurisdiction: 'UAE',
    topics: ['finance', 'reports'],
    published_date: '2024-04-05',
    is_private: false,
  },
];

export const mockFolders: Folder[] = [
  {
    id: 'folder-1',
    name: 'Legal Documents',
    is_private: false,
    documents: [mockDocuments[0], mockDocuments[2]],
    children: [
      {
        id: 'folder-1-1',
        name: '2024 Contracts',
        is_private: false,
        documents: [mockDocuments[1]],
        children: [],
      },
      {
        id: 'folder-1-2',
        name: 'Templates',
        is_private: false,
        documents: [],
        children: [],
      },
    ],
  },
  {
    id: 'folder-2',
    name: 'Financial Records',
    is_private: false,
    documents: [mockDocuments[3]],
    children: [],
  },
  {
    id: 'folder-3',
    name: 'Client Files',
    is_private: true,
    documents: [],
    children: [],
  },
];

export const mockDrafts: Draft[] = [
  {
    id: '1',
    documentName: 'Investment Term Sheet - Revision',
    relatedAlert: 'DFSA Investment Regulations 2025',
    severity: 'high',
    status: 'in-progress',
    lastModified: '2025-01-25',
    content: `INVESTMENT TERM SHEET

Section 1 - Investment Overview
This term sheet outlines the proposed investment structure and key terms.

Section 2 - Valuation
Pre-money valuation: AED 10,000,000
Investment amount: AED 2,000,000

Section 3 - Investor Rights
Investors shall have standard protective provisions including anti-dilution protection.

Section 4 - Governance
Board composition shall include one investor representative.`,
    suggestions: [
      {
        id: 's1',
        section: 'Section 3',
        originalText: 'Investors shall have standard protective provisions including anti-dilution protection.',
        suggestedText: 'In accordance with DFSA Regulations 2025, investors shall have protective provisions including weighted-average anti-dilution protection.',
        reason: 'Updated language required to comply with new DFSA investment regulations.',
        applied: false,
      },
      {
        id: 's2',
        section: 'Section 4',
        originalText: 'Board composition shall include one investor representative.',
        suggestedText: 'Board composition shall include one investor representative with voting rights as per the updated corporate governance guidelines.',
        reason: 'Corporate governance update mandates explicit voting rights specification.',
        applied: false,
      },
    ],
  },
  {
    id: '2',
    documentName: 'Confidentiality Agreement - Update',
    relatedAlert: 'Data Protection Law Amendment',
    severity: 'medium',
    status: 'pending',
    lastModified: '2025-01-22',
    content: 'This Confidentiality Agreement includes provisions for data handling...',
    suggestions: [],
  },
  {
    id: '3',
    documentName: 'Employment Contract - Labor Law',
    relatedAlert: 'UAE Labor Law 2024 Updates',
    severity: 'low',
    status: 'completed',
    lastModified: '2025-01-18',
    content: 'Updated employment terms and conditions...',
    suggestions: [],
  },
];

export const mockComplianceJobs: ComplianceJob[] = [
  {
    id: '1',
    documentName: 'Investment Term Sheet',
    status: 'completed',
    progress: 'Analysis complete',
    updatedAt: '2025-01-25',
    score: 72,
    clauses: [
      {
        id: 'c1',
        text: 'The investment shall be structured as preferred equity with standard terms...',
        riskLevel: 'low',
        isCompliant: true,
        explanation: 'Clause meets current DFSA requirements for equity investments.',
        recommendation: 'No changes required.',
        status: 'pending',
      },
      {
        id: 'c2',
        text: 'Anti-dilution provisions shall apply at the discretion of the board...',
        riskLevel: 'high',
        isCompliant: false,
        explanation: 'New regulations require explicit anti-dilution methodology specification.',
        recommendation: 'Specify weighted-average or full-ratchet anti-dilution method.',
        status: 'pending',
      },
      {
        id: 'c3',
        text: 'Financial reporting shall be provided on a semi-annual basis...',
        riskLevel: 'medium',
        isCompliant: false,
        explanation: 'Updated guidelines require quarterly financial reporting.',
        recommendation: 'Amend reporting frequency from semi-annual to quarterly.',
        status: 'pending',
      },
    ],
  },
  {
    id: '2',
    documentName: 'Partnership Agreement',
    status: 'analyzing',
    progress: 'Reviewing governance clauses...',
    updatedAt: '2025-01-25',
  },
  {
    id: '3',
    documentName: 'Confidentiality Agreement',
    status: 'pending',
    progress: 'Queued for analysis',
    updatedAt: '2025-01-24',
  },
  {
    id: '4',
    documentName: 'Service Level Agreement',
    status: 'completed',
    progress: 'Analysis complete',
    updatedAt: '2025-01-23',
    score: 94,
    clauses: [],
  },
];

export const mockTemplates: Template[] = [
  {
    key: 'Templates/Contracts/Service_Level_Agreement.docx',
    name: 'Service Level Agreement.docx',
    folder: 'Contracts',
    file_type: 'docx',
    size: 892200,
    last_modified: '2026-01-15T10:30:00+00:00',
    url: 'https://example.com/templates/sla.docx',
    description: 'Comprehensive SLA template for service providers with performance metrics.',
    category: 'contracts',
  },
  {
    key: 'Templates/Corporate/Partnership_Agreement.pdf',
    name: 'Partnership Agreement.pdf',
    folder: 'Corporate',
    file_type: 'pdf',
    size: 156800,
    last_modified: '2026-01-14T14:20:00+00:00',
    url: 'https://example.com/templates/partnership.pdf',
    description: 'Joint venture and partnership framework covering profit sharing.',
    category: 'corporate',
  },
  {
    key: 'Templates/Contracts/NDA_Template.pdf',
    name: 'Non-Disclosure Agreement.pdf',
    folder: 'Contracts',
    file_type: 'pdf',
    size: 95100,
    last_modified: '2026-01-12T09:15:00+00:00',
    url: 'https://example.com/templates/nda.pdf',
    description: 'Mutual or unilateral NDA for protecting confidential information.',
    category: 'contracts',
  },
  {
    key: 'Templates/Corporate/Investment_Term_Sheet.docx',
    name: 'Investment Term Sheet.docx',
    folder: 'Corporate',
    file_type: 'docx',
    size: 445600,
    last_modified: '2026-01-10T16:45:00+00:00',
    url: 'https://example.com/templates/termsheet.docx',
    description: 'Standard term sheet for equity investments including valuation.',
    category: 'corporate',
  },
  {
    key: 'Templates/Employment/Employment_Contract.docx',
    name: 'Employment Contract.docx',
    folder: 'Employment',
    file_type: 'docx',
    size: 678900,
    last_modified: '2026-01-08T11:00:00+00:00',
    url: 'https://example.com/templates/employment.docx',
    description: 'UAE-compliant employment agreement with mandatory provisions.',
    category: 'employment',
  },
  {
    key: 'Templates/Other/Power_of_Attorney.pdf',
    name: 'Power of Attorney.pdf',
    folder: 'Other',
    file_type: 'pdf',
    size: 124500,
    last_modified: '2026-01-05T13:30:00+00:00',
    url: 'https://example.com/templates/poa.pdf',
    description: 'General or specific power of attorney for legal representation.',
    category: 'other',
  },
  {
    key: 'Templates/Compliance/Compliance_Checklist.xlsx',
    name: 'Compliance Checklist.xlsx',
    folder: 'Compliance',
    file_type: 'xlsx',
    size: 234100,
    last_modified: '2026-01-03T08:20:00+00:00',
    url: 'https://example.com/templates/checklist.xlsx',
    description: 'Regulatory compliance verification checklist for periodic reviews.',
    category: 'compliance',
  },
  {
    key: 'Templates/Corporate/Board_Resolution.docx',
    name: 'Board Resolution.docx',
    folder: 'Corporate',
    file_type: 'docx',
    size: 356700,
    last_modified: '2026-01-02T17:28:19+00:00',
    url: 'https://example.com/templates/resolution.docx',
    description: 'Standard format for documenting corporate board decisions.',
    category: 'corporate',
  },
];

export const mockClients: Client[] = [
  {
    client_id: '123e4567-e89b-12d3-a456-426614174000',
    user_id: 'user-uuid-1',
    name: 'Al Noor Tech Solutions LLC',
    placeholders: {
      COMPANY_NAME: 'Al Noor Tech Solutions LLC',
      EMIRATE: 'Dubai',
      LICENSE_NUMBER: 'DED-12345',
      BUSINESS_ACTIVITY: 'Software Development',
    },
    created_at: '2025-12-26T10:30:00Z',
    updated_at: '2025-12-26T10:30:00Z',
  },
  {
    client_id: '223e4567-e89b-12d3-a456-426614174001',
    user_id: 'user-uuid-1',
    name: 'Emirates Consulting Group',
    placeholders: {
      COMPANY_NAME: 'Emirates Consulting Group',
      EMIRATE: 'Abu Dhabi',
      LICENSE_NUMBER: 'ADC-67890',
      BUSINESS_ACTIVITY: 'Management Consulting',
    },
    created_at: '2025-12-20T14:15:00Z',
    updated_at: '2026-01-10T09:20:00Z',
  },
  {
    client_id: '323e4567-e89b-12d3-a456-426614174002',
    user_id: 'user-uuid-1',
    name: 'Gulf Maritime Services',
    placeholders: {
      COMPANY_NAME: 'Gulf Maritime Services',
      EMIRATE: 'Sharjah',
      LICENSE_NUMBER: 'SHJ-11223',
      BUSINESS_ACTIVITY: 'Shipping & Logistics',
    },
    created_at: '2025-11-15T08:45:00Z',
    updated_at: '2026-01-05T16:30:00Z',
  },
  {
    client_id: '423e4567-e89b-12d3-a456-426614174003',
    user_id: 'user-uuid-1',
    name: 'Oasis Real Estate Development',
    placeholders: {
      COMPANY_NAME: 'Oasis Real Estate Development',
      EMIRATE: 'Dubai',
      LICENSE_NUMBER: 'DED-44556',
      BUSINESS_ACTIVITY: 'Property Development',
    },
    created_at: '2025-10-01T11:00:00Z',
    updated_at: '2025-12-18T13:45:00Z',
  },
  {
    client_id: '523e4567-e89b-12d3-a456-426614174004',
    user_id: 'user-uuid-1',
    name: 'Falcon Investment Holdings',
    placeholders: {
      COMPANY_NAME: 'Falcon Investment Holdings',
      EMIRATE: 'DIFC',
      LICENSE_NUMBER: 'DIFC-78901',
      BUSINESS_ACTIVITY: 'Investment Management',
    },
    created_at: '2025-09-12T09:30:00Z',
    updated_at: '2026-01-15T10:00:00Z',
  },
  {
    client_id: '623e4567-e89b-12d3-a456-426614174005',
    user_id: 'user-uuid-1',
    name: 'Pearl Healthcare Solutions',
    placeholders: {
      COMPANY_NAME: 'Pearl Healthcare Solutions',
      EMIRATE: 'Ajman',
      LICENSE_NUMBER: 'AJM-33445',
      BUSINESS_ACTIVITY: 'Healthcare Services',
    },
    created_at: '2025-08-20T15:20:00Z',
    updated_at: '2025-11-30T11:15:00Z',
  },
];

export const mockActivities: Activity[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    activity_type: 'document_uploaded',
    icon_type: 'document',
    title: 'Document uploaded: Investment Term Sheet.pdf',
    relative_timestamp: '2 hours ago',
    timestamp: '2026-01-28T09:30:00Z',
  },
  {
    id: '223e4567-e89b-12d3-a456-426614174001',
    activity_type: 'compliance_completed',
    icon_type: 'check-circle',
    title: 'Compliance review completed for Partnership Agreement',
    relative_timestamp: '4 hours ago',
    timestamp: '2026-01-28T07:30:00Z',
  },
  {
    id: '323e4567-e89b-12d3-a456-426614174002',
    activity_type: 'news_added',
    icon_type: 'newspaper',
    title: 'Regulatory news: DFSA updates investment guidelines',
    relative_timestamp: '6 hours ago',
    timestamp: '2026-01-28T05:30:00Z',
  },
  {
    id: '423e4567-e89b-12d3-a456-426614174003',
    activity_type: 'team_joined',
    icon_type: 'user-plus',
    title: 'Sarah Ahmed joined the workspace',
    relative_timestamp: 'Yesterday',
    timestamp: '2026-01-27T14:00:00Z',
  },
  {
    id: '523e4567-e89b-12d3-a456-426614174004',
    activity_type: 'publication_added',
    icon_type: 'book-open',
    title: 'Publication added: UAE Corporate Law Handbook 2026',
    relative_timestamp: 'Yesterday',
    timestamp: '2026-01-27T11:15:00Z',
  },
  {
    id: '623e4567-e89b-12d3-a456-426614174005',
    activity_type: 'entity_subscribed',
    icon_type: 'bell',
    title: 'Subscribed to ADGM regulatory updates',
    relative_timestamp: '2 days ago',
    timestamp: '2026-01-26T16:45:00Z',
  },
  {
    id: '723e4567-e89b-12d3-a456-426614174006',
    activity_type: 'document_uploaded',
    icon_type: 'document',
    title: 'Document uploaded: NDA_Template.docx',
    relative_timestamp: '2 days ago',
    timestamp: '2026-01-26T10:20:00Z',
  },
  {
    id: '823e4567-e89b-12d3-a456-426614174007',
    activity_type: 'compliance_completed',
    icon_type: 'check-circle',
    title: 'Compliance review completed for Service Agreement',
    relative_timestamp: '3 days ago',
    timestamp: '2026-01-25T15:00:00Z',
  },
];

const avatarUrls = [
  'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=40&h=40&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=40&h=40&fit=crop&crop=face',
];

export const mockComments: Comment[] = [
  {
    id: '1',
    author: { name: 'Sarah Ahmed', avatar: avatarUrls[1] },
    content: 'Please review the updated term sheet before the investor meeting.',
    timestamp: '2025-01-25 10:00 AM',
    mentions: [],
  },
  {
    id: '2',
    author: { name: 'Omar Hassan', avatar: avatarUrls[2] },
    content: '@Sarah Ahmed I\'ve reviewed the anti-dilution clauses. They need updating per the new DFSA guidelines.',
    timestamp: '2025-01-25 11:30 AM',
    mentions: ['Sarah Ahmed'],
  },
  {
    id: '3',
    author: { name: 'Layla Mansour', avatar: avatarUrls[1] },
    content: 'The compliance team has approved the NDA template changes.',
    timestamp: '2025-01-25 02:15 PM',
    mentions: [],
  },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review DFSA compliance updates',
    assignee: { name: 'Sarah Ahmed', avatar: avatarUrls[1] },
    priority: 'high',
    dueDate: '2025-01-28',
    status: 'in-progress',
  },
  {
    id: '2',
    title: 'Update client onboarding documents',
    assignee: { name: 'Omar Hassan', avatar: avatarUrls[2] },
    priority: 'medium',
    dueDate: '2025-01-30',
    status: 'pending',
  },
  {
    id: '3',
    title: 'Prepare quarterly compliance report',
    assignee: { name: 'Layla Mansour', avatar: avatarUrls[1] },
    priority: 'low',
    dueDate: '2025-02-05',
    status: 'pending',
  },
];
