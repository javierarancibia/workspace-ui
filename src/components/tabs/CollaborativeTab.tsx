import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Send, 
  Users, 
  CheckSquare, 
  AtSign, 
  Clock, 
  MoreHorizontal,
  Plus,
  Bell,
  Pin,
  ThumbsUp,
  Reply,
  Calendar,
  Flag,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockComments, mockTasks } from '@/data/mockData';
import { Comment, Task } from '@/types/workspace';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Team members data
const teamMembers = [
  { id: '1', name: 'Sarah Ahmed', role: 'Legal Counsel', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&crop=face', status: 'online' },
  { id: '2', name: 'Omar Hassan', role: 'Compliance Officer', avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=40&h=40&fit=crop&crop=face', status: 'online' },
  { id: '3', name: 'Layla Mansour', role: 'Senior Associate', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=40&h=40&fit=crop&crop=face', status: 'away' },
  { id: '4', name: 'Ahmed Al-Farsi', role: 'Partner', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', status: 'offline' },
  { id: '5', name: 'Fatima Khalid', role: 'Paralegal', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face', status: 'online' },
];

// Announcements data
const announcements = [
  { id: '1', title: 'Q1 Compliance Training', content: 'Mandatory compliance training scheduled for Feb 5th. All team members must attend.', author: 'Ahmed Al-Farsi', date: '2 hours ago', pinned: true },
  { id: '2', title: 'New DFSA Guidelines Released', content: 'Please review the updated investment regulations before your next client meeting.', author: 'Omar Hassan', date: 'Yesterday', pinned: true },
  { id: '3', title: 'Office Hours Change', content: 'Starting next week, office hours will be 8 AM - 5 PM.', author: 'Sarah Ahmed', date: '3 days ago', pinned: false },
];

const statusColors: Record<string, { bg: string; ring: string }> = {
  online: { bg: 'bg-emerald-500', ring: 'ring-emerald-500/30' },
  away: { bg: 'bg-amber-500', ring: 'ring-amber-500/30' },
  offline: { bg: 'bg-muted-foreground/50', ring: 'ring-muted-foreground/30' },
};

const priorityConfig: Record<string, { color: string; bg: string }> = {
  high: { color: 'text-rose-600', bg: 'bg-rose-500/15' },
  medium: { color: 'text-amber-600', bg: 'bg-amber-500/15' },
  low: { color: 'text-emerald-600', bg: 'bg-emerald-500/15' },
};

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  pending: { color: 'text-slate-600', bg: 'bg-slate-500/15', label: 'To Do' },
  'in-progress': { color: 'text-blue-600', bg: 'bg-blue-500/15', label: 'In Progress' },
  completed: { color: 'text-emerald-600', bg: 'bg-emerald-500/15', label: 'Done' },
};

function CommentCard({ comment }: { comment: Comment }) {
  return (
    <div className="group flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
        <AvatarFallback className="text-xs bg-primary/10 text-primary">
          {comment.author.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">{comment.author.name}</span>
          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed">
          {comment.content.split(/(@\w+\s\w+)/g).map((part, i) => 
            part.startsWith('@') ? (
              <span key={i} className="text-primary font-medium">{part}</span>
            ) : part
          )}
        </p>
        <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground">
            <ThumbsUp className="h-3 w-3 mr-1" />
            Like
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground">
            <Reply className="h-3 w-3 mr-1" />
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];

  return (
    <div className="group p-3 rounded-lg border border-border/50 bg-card hover:shadow-md hover:border-border transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit Task</DropdownMenuItem>
            <DropdownMenuItem>Reassign</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="secondary" className={cn('text-xs font-normal', priority.bg, priority.color)}>
          <Flag className="h-2.5 w-2.5 mr-1" />
          {task.priority}
        </Badge>
        <Badge variant="secondary" className={cn('text-xs font-normal', status.bg, status.color)}>
          <Circle className="h-2 w-2 mr-1 fill-current" />
          {status.label}
        </Badge>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
            <AvatarFallback className="text-[10px]">
              {task.assignee.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
}

function TeamMemberCard({ member }: { member: typeof teamMembers[0] }) {
  const status = statusColors[member.status];
  
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={member.avatar} alt={member.name} />
          <AvatarFallback className="text-xs bg-primary/10 text-primary">
            {member.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <span className={cn(
          'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ring-2',
          status.bg,
          status.ring
        )} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{member.name}</p>
        <p className="text-xs text-muted-foreground truncate">{member.role}</p>
      </div>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
}

function AnnouncementCard({ announcement }: { announcement: typeof announcements[0] }) {
  return (
    <div className="p-4 rounded-lg border border-border/50 bg-card hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {announcement.pinned && (
            <Pin className="h-3.5 w-3.5 text-primary shrink-0" />
          )}
          <h4 className="font-semibold text-sm">{announcement.title}</h4>
        </div>
        <span className="text-xs text-muted-foreground shrink-0">{announcement.date}</span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-2">{announcement.content}</p>
      <p className="text-xs text-muted-foreground">Posted by <span className="text-foreground font-medium">{announcement.author}</span></p>
    </div>
  );
}

export function CollaborativeTab() {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(mockComments);

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: String(Date.now()),
      author: { 
        name: 'You', 
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' 
      },
      content: newComment,
      timestamp: 'Just now',
      mentions: [],
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
  };

  const stats = [
    { label: 'Team Members', value: teamMembers.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-500/15' },
    { label: 'Active Tasks', value: mockTasks.filter(t => t.status !== 'completed').length, icon: CheckSquare, color: 'text-amber-600', bg: 'bg-amber-500/15' },
    { label: 'Comments Today', value: comments.length, icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-500/15' },
    { label: 'Online Now', value: teamMembers.filter(m => m.status === 'online').length, icon: Circle, color: 'text-violet-600', bg: 'bg-violet-500/15' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats Overview */}
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Discussion & Announcements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Discussion Thread */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Team Discussion
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  <Bell className="h-3 w-3 mr-1" />
                  {comments.length} messages
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Comment Input */}
              <div className="flex gap-3 mb-4">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Write a message... Use @ to mention someone"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[60px] resize-none text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                      <AtSign className="h-3.5 w-3.5 mr-1" />
                      Mention
                    </Button>
                    <Button size="sm" onClick={handlePostComment} disabled={!newComment.trim()}>
                      <Send className="h-3.5 w-3.5 mr-1" />
                      Post
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="mb-3" />

              {/* Comments List */}
              <ScrollArea className="h-[280px]">
                <div className="space-y-1">
                  {comments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Pin className="h-4 w-4 text-primary" />
                  Announcements
                </CardTitle>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  New
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <AnnouncementCard key={announcement.id} announcement={announcement} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Team & Tasks */}
        <div className="space-y-6">
          {/* Team Members */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Team Members
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ScrollArea className="h-[260px]">
                <div className="space-y-1">
                  {teamMembers.map((member) => (
                    <TeamMemberCard key={member.id} member={member} />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Active Tasks */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-primary" />
                  Active Tasks
                </CardTitle>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ScrollArea className="h-[340px]">
                <div className="space-y-3">
                  {mockTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
