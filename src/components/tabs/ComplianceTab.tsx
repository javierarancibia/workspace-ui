import React, { useState } from 'react';
import { ComplianceJob, ComplianceClause } from '@/types/workspace';
import { mockComplianceJobs } from '@/data/mockData';
import { 
  FileText, Eye, Info, RefreshCw, Check, X, Clock, 
  AlertTriangle, TrendingUp, MoreHorizontal, Shield,
  CheckCircle2, XCircle, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const statusConfig = {
  'pending': { 
    label: 'Pending', 
    bg: 'bg-slate-500/10', 
    text: 'text-slate-600',
    icon: Clock,
    iconClass: ''
  },
  'analyzing': { 
    label: 'Analyzing', 
    bg: 'bg-blue-500/10', 
    text: 'text-blue-600',
    icon: Loader2,
    iconClass: 'animate-spin'
  },
  'completed': { 
    label: 'Completed', 
    bg: 'bg-emerald-500/10', 
    text: 'text-emerald-600',
    icon: CheckCircle2,
    iconClass: ''
  },
  'failed': { 
    label: 'Failed', 
    bg: 'bg-rose-500/10', 
    text: 'text-rose-600',
    icon: XCircle,
    iconClass: ''
  },
};

const riskConfig = {
  'critical': { label: 'Critical', bg: 'bg-rose-500/10', text: 'text-rose-600', dot: 'bg-rose-500' },
  'high': { label: 'High', bg: 'bg-orange-500/10', text: 'text-orange-600', dot: 'bg-orange-500' },
  'medium': { label: 'Medium', bg: 'bg-amber-500/10', text: 'text-amber-600', dot: 'bg-amber-500' },
  'low': { label: 'Low', bg: 'bg-emerald-500/10', text: 'text-emerald-600', dot: 'bg-emerald-500' },
};

function JobStatusBadge({ status }: { status: ComplianceJob['status'] }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="secondary" className={cn('font-normal gap-1.5', config.bg, config.text)}>
      <Icon className={cn('h-3 w-3', config.iconClass)} />
      {config.label}
    </Badge>
  );
}

function RiskBadge({ level }: { level: ComplianceClause['riskLevel'] }) {
  const config = riskConfig[level];

  return (
    <Badge variant="secondary" className={cn('font-normal gap-1.5', config.bg, config.text)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </Badge>
  );
}

function ScoreCircle({ score }: { score: number }) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-600';
    if (s >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getStrokeColor = (s: number) => {
    if (s >= 80) return 'stroke-emerald-500';
    if (s >= 60) return 'stroke-amber-500';
    return 'stroke-rose-500';
  };

  return (
    <div className="relative w-14 h-14">
      <svg className="w-14 h-14 transform -rotate-90">
        <circle
          cx="28"
          cy="28"
          r="24"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="4"
        />
        <circle
          cx="28"
          cy="28"
          r="24"
          fill="none"
          className={getStrokeColor(score)}
          strokeWidth="4"
          strokeDasharray={`${score * 1.51} 151`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn('text-sm font-bold', getScoreColor(score))}>{score}%</span>
      </div>
    </div>
  );
}

interface AnalysisDialogProps {
  job: ComplianceJob;
  open: boolean;
  onClose: () => void;
}

function AnalysisDialog({ job, open, onClose }: AnalysisDialogProps) {
  const [clauses, setClauses] = useState<ComplianceClause[]>(job.clauses || []);
  const [filter, setFilter] = useState<'all' | 'non-compliant' | 'critical' | 'review'>('all');

  const filteredClauses = clauses.filter(clause => {
    if (filter === 'all') return true;
    if (filter === 'non-compliant') return !clause.isCompliant;
    if (filter === 'critical') return clause.riskLevel === 'critical' || clause.riskLevel === 'high';
    if (filter === 'review') return clause.status === 'pending';
    return true;
  });

  const approvedCount = clauses.filter(c => c.status === 'approved').length;
  const rejectedCount = clauses.filter(c => c.status === 'rejected').length;
  const pendingCount = clauses.filter(c => c.status === 'pending').length;

  const handleClauseAction = (clauseId: string, action: 'approved' | 'rejected') => {
    setClauses(prev => prev.map(c => 
      c.id === clauseId ? { ...c, status: action } : c
    ));
  };

  const riskCounts = {
    critical: clauses.filter(c => c.riskLevel === 'critical').length,
    high: clauses.filter(c => c.riskLevel === 'high').length,
    medium: clauses.filter(c => c.riskLevel === 'medium').length,
    low: clauses.filter(c => c.riskLevel === 'low').length,
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {job.documentName} - Compliance Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {/* Summary Section */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Score Circle */}
            <Card className="border-border/50">
              <CardContent className="p-5 flex items-center gap-5">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="hsl(var(--border))"
                      strokeWidth="6"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="6"
                      strokeDasharray={`${(job.score || 0) * 2.51} 251`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-foreground">{job.score}%</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Compliance Score</h4>
                  <p className="text-sm text-muted-foreground">{clauses.length} clauses analyzed</p>
                </div>
              </CardContent>
            </Card>

            {/* Risk Indicators */}
            <Card className="border-border/50">
              <CardContent className="p-5">
                <h4 className="font-semibold text-foreground mb-3">Risk Indicators</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(riskCounts).map(([level, count]) => {
                    const config = riskConfig[level as keyof typeof riskConfig];
                    return (
                      <div key={level} className="flex items-center gap-2">
                        <span className={cn('w-2.5 h-2.5 rounded-full', config.dot)} />
                        <span className="text-sm text-muted-foreground capitalize">{level}:</span>
                        <span className={cn('text-sm font-medium', config.text)}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-4 border-b border-border pb-4">
            {(['all', 'non-compliant', 'critical', 'review'] as const).map(f => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
                className={filter === f ? 'btn-primary-gold' : ''}
              >
                {f === 'all' && 'All'}
                {f === 'non-compliant' && 'Non-Compliant'}
                {f === 'critical' && 'Critical/High'}
                {f === 'review' && 'Needs Review'}
              </Button>
            ))}
          </div>

          {/* Clauses */}
          <div className="space-y-4">
            {filteredClauses.map(clause => (
              <Card 
                key={clause.id} 
                className={cn(
                  'border',
                  clause.isCompliant ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <RiskBadge level={clause.riskLevel} />
                      {clause.isCompliant ? (
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 font-normal">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Compliant
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-rose-500/10 text-rose-600 font-normal">
                          <XCircle className="h-3 w-3 mr-1" />
                          Non-Compliant
                        </Badge>
                      )}
                    </div>
                    {clause.status !== 'pending' && (
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          'font-normal',
                          clause.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                        )}
                      >
                        {clause.status === 'approved' ? 'Approved' : 'Rejected'}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-foreground mb-3 italic bg-muted/50 p-3 rounded-lg">"{clause.text}"</p>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm">
                      <span className="font-medium text-foreground">Issue:</span>{' '}
                      <span className="text-muted-foreground">{clause.explanation}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-foreground">Recommendation:</span>{' '}
                      <span className="text-muted-foreground">{clause.recommendation}</span>
                    </p>
                  </div>

                  {clause.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        className="btn-primary-gold h-8"
                        onClick={() => handleClauseAction(clause.id, 'approved')}
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8"
                        onClick={() => handleClauseAction(clause.id, 'rejected')}
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary Footer */}
        <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 font-normal">
              Approved: {approvedCount}
            </Badge>
            <Badge variant="secondary" className="bg-rose-500/10 text-rose-600 font-normal">
              Rejected: {rejectedCount}
            </Badge>
            <Badge variant="secondary" className="bg-slate-500/10 text-slate-600 font-normal">
              Pending: {pendingCount}
            </Badge>
          </div>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ComplianceRow({ job, onView }: { job: ComplianceJob; onView: () => void }) {
  const status = statusConfig[job.status];

  return (
    <tr className="group border-b border-border/40 hover:bg-muted/30 transition-all duration-150">
      <td className="py-4 px-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-[15px] text-foreground">{job.documentName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{job.progress}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-5">
        <JobStatusBadge status={job.status} />
      </td>
      <td className="py-4 px-5">
        {job.status === 'completed' && job.score !== undefined ? (
          <ScoreCircle score={job.score} />
        ) : job.status === 'analyzing' ? (
          <div className="w-24">
            <Progress value={45} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">Analyzing...</p>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </td>
      <td className="py-4 px-5">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {job.updatedAt}
        </div>
      </td>
      <td className="py-4 px-5">
        <div className="flex items-center justify-end gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 px-3 text-xs font-medium hover:bg-primary/10 hover:text-primary"
            disabled={job.status !== 'completed'}
            onClick={onView}
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            View
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <RefreshCw className="h-4 w-4 mr-2" />
                Re-analyze
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                View Document
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}

export function ComplianceTab() {
  const [jobs] = useState<ComplianceJob[]>(mockComplianceJobs);
  const [selectedJob, setSelectedJob] = useState<ComplianceJob | null>(null);

  const completedJobs = jobs.filter(j => j.status === 'completed');
  const avgScore = completedJobs.length > 0 
    ? Math.round(completedJobs.reduce((acc, j) => acc + (j.score || 0), 0) / completedJobs.length)
    : 0;

  const stats = [
    { label: 'Total Jobs', value: jobs.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Completed', value: completedJobs.length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    { label: 'Analyzing', value: jobs.filter(j => j.status === 'analyzing').length, icon: Loader2, color: 'text-amber-600', bg: 'bg-amber-500/10' },
    { label: 'Avg. Score', value: `${avgScore}%`, icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-500/10' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Compliance</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor and manage document compliance analysis</p>
        </div>
        <Button className="btn-primary-gold gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh All
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn('p-2.5 rounded-lg', stat.bg)}>
                    <Icon className={cn('h-5 w-5', stat.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Jobs Table */}
      <Card className="border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Document</th>
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score</th>
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Updated</th>
                <th className="py-3.5 px-5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <ComplianceRow 
                  key={job.id} 
                  job={job} 
                  onView={() => setSelectedJob(job)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Info Footer */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">About Compliance Analysis</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Our AI reviews your documents against current regulations and identifies clauses that may need updates. 
              Click "View" on completed jobs to see detailed findings and recommendations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Dialog */}
      {selectedJob && (
        <AnalysisDialog
          job={selectedJob}
          open={!!selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
