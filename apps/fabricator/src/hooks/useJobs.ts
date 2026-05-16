import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, getJobs, getJob, getJobPOs, createJob, updateJob } from '@sb/api-client';
import type { Job } from '@sb/types';

export function useJobs() {
  return useQuery({
    queryKey: queryKeys.jobs.list(),
    queryFn: getJobs,
  });
}

export function useJob(id: string | null) {
  return useQuery({
    queryKey: queryKeys.jobs.detail(id!),
    queryFn: () => getJob(id!),
    enabled: !!id,
  });
}

export function useJobPOs(jobId: string | null) {
  return useQuery({
    queryKey: queryKeys.jobs.pos(jobId!),
    queryFn: () => getJobPOs(jobId!),
    enabled: !!jobId,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all() });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Job> }) => updateJob(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(id) });
    },
  });
}
