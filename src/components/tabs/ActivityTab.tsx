import { useState } from 'react';
import { Activity, ActivityType } from '@/types/workspace';
import { mockActivities } from '@/data/mockData';
import { 
  FileText, CheckCircle2, Newspaper, BookOpen, Bell, UserPlus,
  Filter, Clock, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Activity type configuration with colors and icons
const activityTypeConfig: Record<ActivityType, {
  label: string;
  icon: React.ElementType;
  bg: string;
  text: string;
  border: string;
}> = {
  document_uploaded: {
    label: 'Document Upload',
    icon: FileText,
    bg: 'bg-blue-500/10',
    text: 'text-blue-600',
    border: 'border-blue-500/20',
  },
  compliance_completed: {
    label: 'Compliance Complete',
    icon: CheckCircle2,
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600',
    border: 'border-emerald-500/20',
  },
  news_added: {
    label: 'Regulatory News',
    icon: Newspaper,
    bg: 'bg-amber-500/10',
    text: 'text-amber-600',
    border: 'border-amber-500/20',
  },
  publication_added: {
    label: 'Publication Added',
    icon: BookOpen,
    bg: 'bg-purple-500/10',
    text: 'text-purple-600',
    border: 'border-purple-500/20',
  },
  entity_subscribed: {
    label: 'Subscription',
    icon: Bell,
    bg: 'bg-rose-500/10',
    text: 'text-rose-600',
    border: 'border-rose-500/20',
  },
  team_joined: {
    label: 'Team Update',
    icon: UserPlus,
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-600',
    border: 'border-cyan-500/20',
  },
};

function ActivityCard({ activity }: { activity: Activity }) {
  const config = activityTypeConfig[activity.activity_type];
  const Icon = config.icon;

  return (
    <Card className={cn(
      'group transition-all duration-200 hover:shadow-md border',
      config.border,
      'bg-card hover:bg-accent/30'
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={cn(
            'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
            config.bg
          )}>
            <Icon className={cn('h-5 w-5', config.text)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                'px-2 py-0.5 text-xs font-medium rounded-full',
                config.bg, config.text
              )}>
                {config.label}
              </span>
            </div>
            <p className="font-medium text-foreground text-[15px] line-clamp-2">
              {activity.title}
            </p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {activity.relative_timestamp}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({ 
  label, 
  count, 
  icon: Icon, 
  trend,
  colorClass 
}: { 
  label: string; 
  count: number; 
  icon: React.ElementType;
  trend?: string;
  colorClass: string;
}) {
  return (
    <Card className="bg-card border shadow-soft">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{count}</p>
            {trend && (
              <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </p>
            )}
          </div>
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', colorClass)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ActivityTab() {
  const [activities] = useState<Activity[]>(mockActivities);
  const [selectedFilter, setSelectedFilter] = useState<ActivityType | 'all'>('all');

  const filteredActivities = selectedFilter === 'all' 
    ? activities 
    : activities.filter(a => a.activity_type === selectedFilter);

  // Calculate stats
  const stats = {
    documents: activities.filter(a => a.activity_type === 'document_uploaded').length,
    compliance: activities.filter(a => a.activity_type === 'compliance_completed').length,
    news: activities.filter(a => a.activity_type === 'news_added').length,
    total: activities.length,
  };

  const filterOptions: { value: ActivityType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Activity' },
    { value: 'document_uploaded', label: 'Documents' },
    { value: 'compliance_completed', label: 'Compliance' },
    { value: 'news_added', label: 'News' },
    { value: 'publication_added', label: 'Publications' },
    { value: 'entity_subscribed', label: 'Subscriptions' },
    { value: 'team_joined', label: 'Team' },
  ];

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Activity</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track all workspace activity and updates
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard 
          label="Total Activities" 
          count={stats.total} 
          icon={Clock}
          colorClass="bg-slate-500/10 text-slate-600"
        />
        <StatCard 
          label="Documents Uploaded" 
          count={stats.documents} 
          icon={FileText}
          trend="+2 this week"
          colorClass="bg-blue-500/10 text-blue-600"
        />
        <StatCard 
          label="Compliance Reviews" 
          count={stats.compliance} 
          icon={CheckCircle2}
          trend="+1 this week"
          colorClass="bg-emerald-500/10 text-emerald-600"
        />
        <StatCard 
          label="Regulatory News" 
          count={stats.news} 
          icon={Newspaper}
          colorClass="bg-amber-500/10 text-amber-600"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin">
        <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant={selectedFilter === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter(option.value)}
            className={cn(
              'whitespace-nowrap',
              selectedFilter === option.value && 'btn-primary-gold'
            )}
          >
            {option.label}
            {option.value !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({activities.filter(a => a.activity_type === option.value).length})
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Activity Timeline */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <Card className="bg-card border">
            <CardContent className="p-8 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No activities found for this filter</p>
            </CardContent>
          </Card>
        ) : (
          filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        )}
      </div>
    </div>
  );
}
