export type JobApplication = {
  id: number;
  user: {
    username: string;
    name: string;
    avatar: string;
    headline: string;
  };
  pipelineStage: PipelineStage[];
}

export type PipelineStage = {
  status: JobApplicationStatus;
  createdAt: string;
  note?: string;
}
export type NewPipelineStage = Pick<PipelineStage, 'status' | 'note'>;
export type JobApplicationStatus = 'SUBMITTED' | 'VIEWED' | 'INTERVIEW' | 'ACCEPTED' | 'REJECTED' | 'PASSED';
