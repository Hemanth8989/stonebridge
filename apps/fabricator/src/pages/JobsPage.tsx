import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List,
  Target,
  ArrowRight
} from 'lucide-react';
import { 
  Button, 
  SbSearchInput, 
  SbSpinner, 
  SbEmptyState,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  cn 
} from '@sb/ui';
import { useJobs } from '../hooks/useJobs';
import JobCard from '../components/jobs/JobCard';
import JobForm from '../components/jobs/JobForm';

export default function JobsPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useJobs();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = data?.data.filter(job => 
    job.jobName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    job.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Active Jobs</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1 italic">
            Manage your fabrication pipeline and track material spend per job.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-10 px-6 font-black uppercase tracking-widest text-[10px] border-border/50 bg-card/50"
            onClick={() => navigate('/analytics')}
          >
            <Target className="mr-2 h-3.5 w-3.5" />
            Job Analytics
          </Button>
          <Button 
            size="sm" 
            className="h-10 px-6 font-black uppercase tracking-widest text-[10px] shadow-lg"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="mr-2 h-3.5 w-3.5" />
            Create New Job
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/30 p-4 rounded-2xl border border-border/40 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <SbSearchInput 
            placeholder="Search jobs, customers, or numbers..." 
            className="w-[320px] h-10 bg-background/50 border-border/50"
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <div className="h-6 w-[1px] bg-border/60 mx-1" />
          <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">
            <Filter className="mr-2 h-3.5 w-3.5" />
            Filter Status
          </Button>
        </div>

        <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1 border border-border/20 shadow-inner">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md bg-background shadow-sm text-primary"><LayoutGrid className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-muted-foreground"><List className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Jobs Grid */}
      {isLoading ? (
        <div className="flex h-64 w-full items-center justify-center">
          <SbSpinner size="lg" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <SbEmptyState
          icon={<Briefcase className="h-10 w-10 text-muted-foreground/20" />}
          title="No jobs found"
          description="Create your first job to start tracking materials and fabrication progress."
          className="py-24"
          action={{
            label: "Add New Job",
            onClick: () => setIsCreateOpen(true)
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredJobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onClick={() => navigate(`/jobs/${job.id}`)} 
            />
          ))}
        </div>
      )}

      {/* Create Job Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">Create New Job</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <JobForm 
              mode="create" 
              onSuccess={(job) => {
                setIsCreateOpen(false);
                navigate(`/jobs/${job.id}`);
              }} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
